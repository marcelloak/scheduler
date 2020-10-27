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