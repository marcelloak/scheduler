export default function reducer(state, action) {
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

  return reducers[action.type](state, action);
}