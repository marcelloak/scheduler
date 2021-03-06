import React from 'react';
import classNames from 'classnames';

import 'components/InterviewerListItem.scss';

export default function InterviewerListItem(props) {
  const interviewerListItemClass = classNames('interviewers__item', {
     'interviewers__item--selected': props.selected,
  });

  const interviewerListItemImageClass = classNames('interviewers__item-image', {
    'interviewers__item-image--selected': props.selected,
 });

  return (
    <li
      onClick={props.onChange}
      className={interviewerListItemClass}>
      <img
        className={interviewerListItemImageClass}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected ? props.name : ''}
    </li>
  );
};