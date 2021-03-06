import React from 'react';
import classNames from 'classnames';

import "components/DayListItem.scss";

export default function DayListItem(props) {
  let dayListItemClass = classNames('day-list__item', {
     'day-list__item--selected': props.selected,
     'day-list__item--full': props.spots === 0,
  });

  // Format spots remaining text based on 0, 1 or other 
  const formatSpots = function(spots) {
    return `${spots === 0 ? 'no' : spots} spot${spots === 1 ? '' : 's'} remaining`;
  };

  return (
    <li data-testid='day' className={dayListItemClass} onClick={() => props.setDay(props.name)}>
      <h2 className='text--regular'>{props.name}</h2>
      <h3 className='text--light'>{formatSpots(props.spots)}</h3>
    </li>
  );
};