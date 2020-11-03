import { useEffect, useReducer } from 'react'
import axios from 'axios';

import reducer from 'reducers/application'

export default function useApplicationData() {

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

  const setDay = day => dispatch({ type: 'day', day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview
    };
    
    return axios.put(`/api/appointments/${id}`, appointment);
  }

  const cancelInterview = function(id) {
    return axios.delete(`/api/appointments/${id}`);
  }

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
