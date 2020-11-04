export default function reducer(state, action) {
  // Creates reducers to change currently visible day, appointment data, or all local data
  const reducers = {
    day(state, {day}) {
      return {...state, day};
    },
    application(state, {days, appointments, interviewers}) {
      return {...state, days, appointments, interviewers};
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

      let spots = 0;
      if (state.appointments[id].interview && !interview) spots = 1;
      if (!state.appointments[id].interview && interview) spots = -1;
  
      for (let i = 0; i < days.length; i++) {
        if (days[i].appointments.includes(id)) {
          days[i] = {...days[i], spots: days[i].spots + spots}
        }
      }
      return {...state, appointments, days};
    }
  };

  return reducers[action.type](state, action);
};