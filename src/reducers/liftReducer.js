import * as liftActions from '../actions/liftActions';
import * as reducerActions from '../actions/reducerActions';
import doorStateEnum from '../enums/doorStateEnum';
import liftStateEnum from '../enums/liftStateEnum';
import sensorStateEnum from '../enums/sensorStateEnum';

const defaultState = Object.freeze({
  currentFloor: 0,
  maximumFloor: 10,
  passengersCount: 0,
  doorState: doorStateEnum.CLOSED,
  sensorState: sensorStateEnum.OFF,
  liftState: liftStateEnum.IDLE,
  waitingFloor: new Set(),
  waitingFloorSet: {
    upFloor: new Set(),
    downFloor: new Set(),
    requestFloor: new Set(),
  },
});

export default function liftReducer(state = defaultState, action) {
  switch (action.type) {
    case liftActions.BUTTON_PRESS: {
      return Object.freeze({
        ...state,
        waitingFloor: new Set([...state.waitingFloor]).add(action.data),
      });
    }
    case liftActions.ADD_UP_FLOOR: {
      return Object.freeze({
        ...state,
        waitingFloorSet: {
          ...state.waitingFloorSet,
          upFloor: new Set([...state.waitingFloorSet.upFloor]).add(action.floor),
        },
      });
    }
    case liftActions.ADD_DOWN_FLOOR: {
      return Object.freeze({
        ...state,
        waitingFloorSet: {
          ...state.waitingFloorSet,
          downFloor: new Set([...state.waitingFloorSet.downFloor]).add(action.floor),
        },
      });
    }
    case liftActions.ADD_REQUEST_FLOOR: {
      return Object.freeze({
        ...state,
        waitingFloorSet: {
          ...state.waitingFloorSet,
          requestFloor: new Set([...state.waitingFloorSet.requestFloor]).add(action.floor),
        },
      });
    }
    case liftActions.MOVE_UP: {
      return Object.freeze({
        ...state,
        currentFloor: state.currentFloor + 1,
      });
    }
    case liftActions.MOVE_DOWN: {
      return Object.freeze({
        ...state,
        currentFloor: state.currentFloor - 1,
      });
    }
    case liftActions.CLOSE_DOOR: {
      return Object.freeze({
        ...state,
        doorState: doorStateEnum.CLOSED,
      });
    }
    case liftActions.OPEN_DOOR: {
      return Object.freeze({
        ...state,
        doorState: doorStateEnum.OPEN,
      });
    }
    case liftActions.DOOR_SENSOR_OFF: {
      return Object.freeze({
        ...state,
        sensorState: sensorStateEnum.OFF,
      });
    }
    case liftActions.DOOR_SENSOR_ON: {
      return Object.freeze({
        ...state,
        sensorState: sensorStateEnum.ON,
      });
    }
    case liftActions.INCREMENT_PASSENGERS: {
      return Object.freeze({
        ...state,
        passengersCount: state.passengersCount + 1,
      });
    }
    case liftActions.DECREMENT_PASSENGERS: {
      return Object.freeze({
        ...state,
        passengersCount: state.passengersCount - 1,
      });
    }
    case liftActions.REACHED_FLOOR: {
      const newWaitingFloor = new Set([...state.waitingFloor]);
      newWaitingFloor.delete(action.floor);
      return Object.freeze({
        ...state,
        waitingFloor: newWaitingFloor,
      });
    }
    case liftActions.SET_LIFT_STATE: {
      return Object.freeze({
        ...state,
        liftState: action.state,
      });
    }
    case reducerActions.RESET: {
      return defaultState;
    }
    default:
      return state;
  }
}
