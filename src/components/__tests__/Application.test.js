import React from "react";
import axios from 'axios';
import WS from "jest-websocket-mock";

import { render, cleanup, waitForElement, waitForElementToBeRemoved, fireEvent, getByText, queryByText, getByPlaceholderText, getAllByTestId, getByAltText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe('Application', () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));
    fireEvent.click(getByText('Tuesday'));
    expect(getByText('Leopold Silvers')).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the Application and start the WebSocket.
    const server = new WS("ws://localhost:8001");
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Add" button on the first empty appointment.
    const appointment = getAllByTestId(container, 'appointment')[0];
    fireEvent.click(getByAltText(appointment, 'Add'));

    // 4. Add an entered name and interviewer
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, 'Sylvia Palmer'));

    // 5. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));

    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();
    
    // 7. Wait until the element with the text "Saving" button is not displayed.
    await waitForElementToBeRemoved(() => getByText(container, 'Saving'));

    // 8. Update the local data by faking a websocket message from the server
    server.send(`{"type":"SET_INTERVIEW","id":1,"interview":{"student":"Lydia Miller-Jones","interviewer":1}}`);
    expect(getByText(container, 'Lydia Miller-Jones', {exact: false})).toBeInTheDocument();

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, "Monday"));
    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
    server.close();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application and start the WebSocket.
    const server = new WS("ws://localhost:8001");
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the first filled appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Are you sure you would like to delete?')).toBeInTheDocument();

    // 5. Click the "Confirm" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();
    
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElementToBeRemoved(() => getByText(appointment, 'Deleting'));
    server.send(`{"type":"SET_INTERVIEW","id":2,"interview":null}`);
    expect(getByAltText(appointment, 'Add')).toBeInTheDocument();
    
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, "Monday"));
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
    server.close();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application and start the WebSocket.
    const server = new WS("ws://localhost:8001");
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Edit" button on the first filled appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, 'Edit'));

    // 4. Check that the form is shown.
    expect(getByText(appointment, 'Save')).toBeInTheDocument();

    // 5. Change the entered name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Save'));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();
    
    // 8. Wait until the element with the "Edit" button is displayed.
    await waitForElementToBeRemoved(() => getByText(appointment, 'Saving'));
    server.send(`{"type":"SET_INTERVIEW","id":2,"interview":{"student":"Lydia Miller-Jones","interviewer":2}}`);
    expect(getByAltText(appointment, 'Edit')).toBeInTheDocument();
    
    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spots remaining".
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, "Monday"));
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();
    server.close();
  });

  it("shows the save error when failing to save an appointment", async () => {
    // 1. Render the Application and setup rejection of axios put request.
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Edit" button on the first filled appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, 'Edit'));

    // 4. Check that the form is shown.
    expect(getByText(appointment, 'Save')).toBeInTheDocument();

    // 5. Change the entered name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 6. Submit that same appointment.
    fireEvent.submit(getByPlaceholderText(appointment, /enter student name/i));

    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();
    
    // 8. Wait until the error message is displayed.
    await waitForElement(() => getByText(appointment, 'Error encountered during save'));

    // 9. Click the "Close" button on that same appointment.
    fireEvent.click(getByAltText(appointment, 'Close'));

    // 10. Check that the form is shown.
    expect(getByText(appointment, 'Save')).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    // 1. Render the Application and setup rejection of axios delete request.
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // 3. Click the "Delete" button on the first filled appointment.
    const appointment = getAllByTestId(container, 'appointment').find(appointment => queryByText(appointment, "Archie Cohen"));
    fireEvent.click(getByAltText(appointment, 'Delete'));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, 'Are you sure you would like to delete?')).toBeInTheDocument();

    // 5. Click the "Confirm" button on that same appointment.
    fireEvent.click(getByText(appointment, 'Confirm'));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, 'Deleting')).toBeInTheDocument();
    
    // 7. Wait until the error message is displayed.
    await waitForElement(() => getByText(appointment, 'Error encountered during delete'));

    // 8. Click the "Close" button on that same appointment.
    fireEvent.click(getByAltText(appointment, 'Close'));
  
    // 9. Check that the text "Archie Cohen" is displayed.
    expect(getByText(appointment, 'Archie Cohen')).toBeInTheDocument();
  });
});