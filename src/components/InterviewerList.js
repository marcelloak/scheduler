import React from 'react';
import propTypes from 'prop-types';

import InterviewerListItem from './InterviewerListItem';

import 'components/InterviewerList.scss';

export default function InterviewerList(props) {
  // Require prop interviewer list to be an array
  InterviewerList.propTypes = {
    interviewers: propTypes.array.isRequired
  };

  const interviewers = props.interviewers.map((interviewer) => {
    return <InterviewerListItem 
      key={interviewer.id}
      name={interviewer.name} 
      avatar={interviewer.avatar} 
      selected={interviewer.id === props.value}
      onChange={() => props.onChange(interviewer.id)}  
    />
  });

  return (
    <section className='interviewers'>
      <h4 className='interviewers__header text--light'>Interviewer</h4>
      <ul className='interviewers__list'>{interviewers}</ul>
    </section>
  );
};