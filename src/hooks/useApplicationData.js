import { useEffect, useReducer } from 'react'
import axios from 'axios';

export default function useApplicationData() {

  const reducer = function(state, action) {
    const reducers = {
      day(state, action) {
        return {...state, day: action.value}
      },
      application(state, action) {
        return {...state, days: action.all[0].data, appointments: action.all[1].data, interviewers: action.all[2].data}
      },
      appointment(state, action) {
        return {...state, appointments: action.appointments, days: action.days}
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

  const setDay = day => dispatch({ type: 'day', value: day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = [...state.days];

    for (let i = 0; i < state.days.length; i++) {
      if (state.days[i].appointments.includes(id)) {
        const day = {...state.days[i], spots: state.days[i].spots - 1}
        days[i] = day;
      }
    }

    return axios.put(`api/appointments/${id}`, appointment)
      .then(() => dispatch({type: 'appointment', appointments, days}));
  }

  const cancelInterview = function(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    const days = [...state.days];

    for (let i = 0; i < state.days.length; i++) {
      if (state.days[i].appointments.includes(id)) {
        const day = {...state.days[i], spots: state.days[i].spots + 1}
        days[i] = day;
      }
    }

    return axios.delete(`api/appointments/${id}`)
      .then(() => dispatch({type: 'appointment', appointments, days}));
  }

  useEffect(() => {
    Promise.all([
      axios.get('api/days'),
      axios.get('api/appointments'),
      axios.get('api/interviewers')
    ])
    .then(all => {
      dispatch({type: 'application', all})
    })
  }, [])

  return {state, setDay, bookInterview, cancelInterview }
}
