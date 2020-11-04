import { useEffect, useReducer } from 'react'
import axios from 'axios';

import reducer from 'reducers/application'

export default function useApplicationData() {

  // Creates a websocket to the DB API and dispatches an appointment change when receiving a message
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onmessage = (event) => {
      const { id, interview } = JSON.parse(event.data);
      dispatch({type: 'interview', id, interview})
    };

    return () => {webSocket.close()}
  }, []);

  const [state, dispatch] = useReducer(reducer, {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  // Sets the currently visible day to the given day 
  const setDay = day => dispatch({ type: 'day', day });

  // Books an interview with the given id and interview object
  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview
    };
    
    return axios.put(`/api/appointments/${id}`, appointment);
  }

  // Deletes an interview with the given id
  const cancelInterview = function(id) {
    return axios.delete(`/api/appointments/${id}`);
  }

  // Gets all days, appointments and interviews from the DB API at launch then configures local data
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then(all => {
      const [days, appointments, interviewers] = all.map((result) => result.data)
      dispatch({type: 'application', days, appointments, interviewers})
    })
  }, [])

  return {state, setDay, bookInterview, cancelInterview }
}
