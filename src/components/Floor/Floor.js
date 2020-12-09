import React from 'react';
import PropTypes from 'prop-types';

import './Floor.scss';

const Floor = ({ floor }) => (
  // <div className="container-outer">
  //   <div className="container-main">{floor}</div>
  // </div>
  <div className="floor">{floor}</div>
);

Floor.propTypes = {
  floor: PropTypes.number,
};

Floor.defaultProps = {
  floor: 0,
};

export default Floor;
