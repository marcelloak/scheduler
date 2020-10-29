import { useEffect, useReducer } from 'react'
import axios from 'axios';

export default function useApplicationData() {

  const reducer = function(state, action) {
    const reducers = {
      day(state, {day}) {
        return {...state, day}
      },
      application(state, {days, appointments, interviewers}) {
        return {...state, days, appointments, interviewers}
      },
      interview(state, {id, interview}) {
        const appointment = {
          ...state.appointments[id],
          interview
        };
    
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
    
        const days = [...state.days];
    
        for (let i = 0; i < days.length; i++) {
          if (days[i].appointments.includes(id)) {
            days[i] = {...days[i], spots: days[i].spots + (interview ? -1 : 1)}
          }
        }
        return {...state, appointments, days}
      }
    }

    return reducers[action.type](state, action) || state;
  }

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
    
    return axios.put(`api/appointments/${id}`, appointment)
      .then(() => dispatch({type: 'interview', id, interview}));
  }

  const cancelInterview = function(id) {
    return axios.delete(`api/appointments/${id}`)
      .then(() => dispatch({type: 'interview', id, interview: null}));
  }

  useEffect(() => {
    Promise.all([
      axios.get('api/days'),
      axios.get('api/appointments'),
      axios.get('api/interviewers')
    ])
    .then(all => {
      const [days, appointments, interviewers] = all.map((result) => result.data)
      dispatch({type: 'application', days, appointments, interviewers})
    })
  }, [])

  return {state, setDay, bookInterview, cancelInterview }
}
