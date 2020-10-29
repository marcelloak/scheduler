import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from './DayList';
import Appointment from './Appointment';

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from '../helpers/selectors';

import "components/Application.scss";

export default function Application(props) {

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const dailyInterviewers = getInterviewersForDay(state, state.day)

  const setDay = day => setState({ ...state, day });

  const bookInterview = function(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`api/appointments/${id}`, appointment)
      .then(() => {
        setState({
          ...state,
          appointments
        });
      });
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
    return axios.delete(`api/appointments/${id}`)
      .then(() => {
        setState({
          ...state,
          appointments
        })
      });
  }

  useEffect(() => {
    Promise.all([
      axios.get('api/days'),
      axios.get('api/appointments'),
      axios.get('api/interviewers')
    ])
    .then(all => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  }, [])

  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList days={state.days} day={state.day} setDay={setDay} />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {dailyAppointments.map(appointment => {
          const interview = getInterview(state, appointment.interview);

          return (
            <Appointment
              key={appointment.id}
              id={appointment.id}
              time={appointment.time}
              interview={interview}
              interviewers={dailyInterviewers}
              bookInterview={bookInterview}
              cancelInterview={cancelInterview}
            />
          );
        })}
        <Appointment key='last' time='5pm' />
      </section>
    </main>
  );
}
