// Returns the appointments from the given state that belong to the given day
export function getAppointmentsForDay(state, day) {
  const appointments = [];

  for (const stateDay of state.days) {
    if (stateDay.name === day) {
      for (const id of stateDay.appointments) {
        appointments.push(state.appointments[id])
      }
    }
  }

  return appointments;
}

// Returns the interviewers from the given state that belong to the given day
export function getInterviewersForDay(state, day) {
  const interviewers = [];

  for (const stateDay of state.days) {
    if (stateDay.name === day) {
      for (const id of stateDay.interviewers) {
        interviewers.push(state.interviewers[id])
      }
    }
  }

  return interviewers;
}

// Returns the appointments from the given state that has the given id
export function getInterview(state, interview) {
  if (!interview) return null;

  const interviewInfo = {...interview};
  for (const interviewer in state.interviewers) {
    if (state.interviewers[interviewer].id === interviewInfo.interviewer) {
      interviewInfo.interviewer = {...state.interviewers[interviewer]};
    }
  }

  return interviewInfo;
}