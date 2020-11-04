import React, { useState } from 'react';
import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState('');

  // Resets the contents of the form
  const reset = function () {
    setName('');
    setInterviewer(null);
  }

  const cancel = function () {
    reset();
    props.onCancel();
  }

  const submit = function(event) {
    event.preventDefault();
    validate();
  }

  // Validates that the name is not blank
  // Sets error if name is blank and otherwise saves the form 
  const validate = function() {
    if (name === '') {
      setError('Student name cannot be blank');
      return;
    }

    setError('');

    props.onSave(name, interviewer);
  }

  return (
    <main className='appointment__card appointment__card--create'>
      <section className='appointment__card-left'>
        <form onSubmit={submit} autoComplete='off'>
          <input
            className='appointment__create-input text--semi-bold'
            name='name'
            type='text'
            placeholder='Enter Student Name'
            value={name}
            onChange={(event) => setName(event.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <section className='appointment__validation'>{error}</section>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className='appointment__card-right'>
        <section className='appointment__actions'>
          <Button onClick={cancel} danger>Cancel</Button>
          <Button onClick={validate} confirm>Save</Button>
        </section>
      </section>
    </main>
  );
}