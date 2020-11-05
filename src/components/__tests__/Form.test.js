import React from "react";

import { render, cleanup, fireEvent } from "@testing-library/react";

import Form from "components/Appointment/Form";

afterEach(cleanup);

describe('Form', () => {

  const interviewers = [
    {
      id: 1,
      name: 'Silvia Palmer',
      avatar: "https://i.imgur.com/LpaY82x.png",
    }
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(<Form interviewers={interviewers} />);
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(<Form name='Lydia Miller-Jones' interviewers={interviewers} />);
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name and interviewer are given", () => {
    // 1. Render the Form
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText } = render(<Form onSave={onSave} interviewers={interviewers} />);

    // 2. Attempt to save with no name
    fireEvent.click(getByText("Save"));

    // 3. Check for error message and no onSave call
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  
    // 4. Enter name and attempt to save again
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByText("Save"));

    // 5. Check for error message and no onSave call
    expect(getByText(/interviewer needs to be selected/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
  
  it("can successfully save after trying to submit an empty student name", () => {
    // 1. Render the Form
    const onSave = jest.fn();
    const { getByText, getByAltText, getByPlaceholderText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );
  
    // 2. Attempt to save with no name
    fireEvent.click(getByText("Save"));
  
    // 3. Check for error message and no onSave call
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  
    // 4. Enter name and save again
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText('Silvia Palmer'));
    fireEvent.click(getByText("Save"));
  
    // 5. Check error message is gone and onSave has been called once with the entered name
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it("calls onCancel and resets the input field", () => {
    // 1. Render the Form
    const onCancel = jest.fn();
    const { getByText, getByPlaceholderText, queryByText, debug } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Mill-Jones"
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );
  
    // 2. Click save button
    fireEvent.click(getByText("Save"));
  
    // 3. Edit the name
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });
  
    // 4. Click cancel button
    fireEvent.click(getByText("Cancel"));
  
    // 5. Check error message is not there, student name field is empty and onCancel has been called once
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

