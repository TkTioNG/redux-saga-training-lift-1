export const BUTTON_PRESS = '@lift/BUTTON_PRESS';

export const ADD_UP_FLOOR = '@lift/ADD_UP_FLOOR';
export const ADD_DOWN_FLOOR = '@lift/ADD_DOWN_FLOOR';

export const MOVE_UP = '@lift/MOVE_UP';
export const MOVE_DOWN = '@lift/MOVE_DOWN';

export const CLOSE_DOOR = '@lift/CLOSE_DOOR';
export const OPEN_DOOR = '@lift/OPEN_DOOR';

export const DOOR_SENSOR_OFF = '@lift/DOOR_SENSOR_OFF';
export const DOOR_SENSOR_ON = '@lift/DOOR_SENSOR_ON';

export const INCREMENT_PASSENGERS = '@lift/INCREMENT_PASSENGERS';
export const DECREMENT_PASSENGERS = '@lift/DECREMENT_PASSENGERS';

export const REACHED_FLOOR = '@lift/REACHED_FLOOR';

export const SET_LIFT_STATE = '@lift/SET_LIFT_STATE';

export const buttonPress = ({ button, data }) => ({
  type: BUTTON_PRESS,
  button,
  data,
});

export const addUpFloor = ({ floor }) => ({
  type: ADD_UP_FLOOR,
  floor,
});

export const addDownFloor = ({ floor }) => ({
  type: ADD_DOWN_FLOOR,
  floor,
});

export const moveUp = () => ({
  type: MOVE_UP,
});

export const moveDown = () => ({
  type: MOVE_DOWN,
});

export const doorSensorOff = () => ({
  type: DOOR_SENSOR_OFF,
});

export const doorSensorOn = () => ({
  type: DOOR_SENSOR_ON,
});

export const closeDoor = () => ({
  type: CLOSE_DOOR,
});

export const openDoor = () => ({
  type: OPEN_DOOR,
});

export const incrementPassengers = () => ({
  type: INCREMENT_PASSENGERS,
});

export const decrementPassengers = () => ({
  type: DECREMENT_PASSENGERS,
});

export const reachedFloor = ({ floor }) => ({
  type: REACHED_FLOOR,
  floor,
});

export const setLiftState = ({ state }) => ({
  type: SET_LIFT_STATE,
  state,
});
