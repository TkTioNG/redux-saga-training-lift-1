import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import './Elevator.scss';

const Elevator = ({ floor, open }) => {
  useEffect(() => {
    const elevator = document.querySelector('.elevator');
    elevator.style.bottom = `${60 * floor}px`;
  }, [floor]);

  return (
    <div className="elevator">
      <div className={`leftDoor${open ? ' open' : ''}`} />
      <div className={`rightDoor${open ? ' open' : ''}`} />
    </div>
  );
};

Elevator.propTypes = {
  floor: PropTypes.number,
  open: PropTypes.bool,
};

Elevator.defaultProps = {
  floor: 0,
  open: false,
};

export default Elevator;
