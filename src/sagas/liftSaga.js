import {
  select, all, take, put, race, delay, call, takeEvery,
} from 'redux-saga/effects';
import * as liftActions from '../actions/liftActions';
import buttonsEnum from '../enums/buttonsEnum';
import liftStateEnum from '../enums/liftStateEnum';
import sensorStateEnum from '../enums/sensorStateEnum';


function* checkOpenFloor(currentFloor) {
  /* Check is it required to open the door in this floor based
     on the moving direction of the lift */
  const liftState = yield select(state => state.lift.liftState);
  if (liftState === liftStateEnum.MOVING_UP) {
    const waitingFloor = yield select(state => state.lift.waitingFloorSet.upFloor);
    return waitingFloor.has(currentFloor);
  } if (liftState === liftStateEnum.MOVING_DOWN) {
    const waitingFloor = yield select(state => state.lift.waitingFloorSet.downFloor);
    return waitingFloor.has(currentFloor);
  }
  /* Do not open door if the lift is idle */
  return false;
}

function* isAnyFloorWaiting() {
  /* Check if there is no passenger waiting. */
  const waitingFloorSet = yield select(state => state.lift.waitingFloorSet);
  return waitingFloorSet.upFloor.size > 0 || waitingFloorSet.downFloor.size > 0;
}

function* isHigherFloorWaiting(currentFloor) {
  const higherFloor = yield select(state => Math.max(...state.lift.waitingFloorSet.upFloor));
  return currentFloor < 10 && currentFloor < higherFloor;
}

function* waitingPassenger({ floor }) {
  /* Waiting passenger to leave or enter the lift */
  const sensorState = yield select(state => state.lift.sensorState);
  if (sensorState === sensorStateEnum.OFF) {
    /* If the door is unblocked, close the door in 5 seconds. */
    const enterLiftResult = yield race({
      success: delay(5000),
      failure: take(liftActions.DOOR_SENSOR_ON),
    });

    if (enterLiftResult.failure) {
      /* Door is blocked before closing. Wait for the passenger again */
      yield call(waitingPassenger, { floor });
    } else {
      /* Take 1 second to close the lift door */
      const closeLiftDoor = yield race({
        success: delay(1000),
        failure: take(liftActions.DOOR_SENSOR_ON),
      });
      if (closeLiftDoor.failure) {
        /* Door is blocked just before closing. Wait for the passenger again */
        yield call(waitingPassenger, { floor });
      } else {
        /* Close the lift floor */
        yield put(liftActions.closeDoor());
      }
    }
  } else {
    /* If door is blocked, waiting for the door to be unblocked */
    yield take(liftActions.DOOR_SENSOR_OFF);
    yield call(waitingPassenger, { floor });
  }
}

function* openLiftDoor({ floor }) {
/* Take 1 second to open the lift door */
  yield delay(1000);

  /* Open the lift floor */
  yield put(liftActions.openDoor());

  yield call(waitingPassenger, { floor });

  /* Remove this floor from waiting list */
  yield put(liftActions.reachedFloor({ floor }));
}

function* watchLift() {
  /* Initialize the moving direction of the lift */
  let movingUp = true;
  while (true) {
    const currentFloor = yield select(state => state.lift.currentFloor);
    const isOpenLiftFloor = yield checkOpenFloor(currentFloor);
    if (isOpenLiftFloor) {
      yield call(openLiftDoor, { floor: currentFloor });
    }
    const isNotIdle = yield isAnyFloorWaiting();
    if (!isNotIdle) {
      /* Wait for button press is there is not passenger waiting */
      yield put(liftActions.setLiftState({ state: liftStateEnum.IDLE }));
      yield take(liftActions.BUTTON_PRESS);
    } else {
      if (currentFloor === 0) {
        movingUp = true;
      }
      const moveUp = yield isHigherFloorWaiting(currentFloor);
      if (movingUp && moveUp) {
        yield put(liftActions.setLiftState({ state: liftStateEnum.MOVING_UP }));
        yield put(liftActions.moveUp());
      } else if (currentFloor > 0) {
        yield put(liftActions.setLiftState({ state: liftStateEnum.MOVING_DOWN }));
        yield put(liftActions.moveDown());
        movingUp = false;
      }
      /* Take 4 seconds for lift to move between floor */
      yield delay(4000);
    }
  }
}

function* watchButtonPress(action) {
  const { button, data: floor } = action;
  if (button === buttonsEnum.CALL_UP) {
    yield put(liftActions.addUpFloor({ floor }));
  } else if (button === buttonsEnum.CALL_DOWN) {
    yield put(liftActions.addDownFloor({ floor }));
  } else {
    /* For request button, it depends on which floor is requested */
    const currentFloor = yield select(state => state.lift.currentFloor);
    if (floor > currentFloor) {
      yield put(liftActions.addUpFloor({ floor }));
    } else {
      yield put(liftActions.addDownFloor({ floor }));
    }
  }
}

export default function* liftSaga() {
  /* TODO: Program your saga for lift control here. 🙂 */
  yield all([
    watchLift(),
    takeEvery(liftActions.BUTTON_PRESS, watchButtonPress),
  ]);
}
