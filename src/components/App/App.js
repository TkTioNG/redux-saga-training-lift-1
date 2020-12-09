import React from 'react';
import { useSelector } from 'react-redux';

import Elevator from '../Elevator';
import Floor from '../Floor';

import doorStateEnum from '../../enums/doorStateEnum';
import sensorStateEnum from '../../enums/sensorStateEnum';

import './App.css';

const liftFloors = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

function App() {
  const error = useSelector(state => state.error.error);

  const passengersCount = useSelector(state => state.lift.passengersCount);

  const currentFloor = useSelector(state => state.lift.currentFloor);
  const doorState = useSelector(state => state.lift.doorState);
  const sensorState = useSelector(state => state.lift.sensorState);

  const doorStateCaption = {
    [doorStateEnum.CLOSED]: 'closed',
    [doorStateEnum.OPEN]: 'open',
  }[doorState];

  const sensorStateCaption = {
    [sensorStateEnum.ON]: 'blocked',
    [sensorStateEnum.OFF]: 'unblocked',
  }[sensorState];

  return (
    <div className="App">
      <div className="App-content">
        {error && (
          <div>
            <p>The lift is broken.</p>
            <p>{error}</p>
          </div>
        )}
        {!error && (
          <div>
            <p>Everything is in order.</p>
            <p>{`The lift is on the ${currentFloor} floor.`}</p>
            <p>{`There are ${passengersCount} passengers waiting.`}</p>
            <p>{`The doors are ${doorStateCaption} and ${sensorStateCaption}.`}</p>
          </div>
        )}
      </div>
      <div className="App-content">
        <div className="flex">
          <div className="floor-holder">
            {liftFloors.map(liftFloor => (
              <Floor key={liftFloor} floor={liftFloor} />
            ))}
            <Elevator floor={currentFloor} open={doorState === doorStateEnum.OPEN} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
