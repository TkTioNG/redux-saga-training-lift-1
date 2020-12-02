import {
  select, all, take, put, race, delay, call,
} from 'redux-saga/effects';
import * as liftActions from '../actions/liftActions';
import sensorStateEnum from '../enums/sensorStateEnum';

function* checkOpenFloor(currentFloor) {
  /* Check is it required to open the door in this floor */
  const waitingFloor = yield select(state => state.lift.waitingFloor);
  return waitingFloor.has(currentFloor);
}

function* isAnyFloorWaiting() {
  /* Check if there is no passenger waiting. */
  const waitingFloor = yield select(state => state.lift.waitingFloor);
  return waitingFloor.size > 0;
}

function* isHigherFloorWaiting(currentFloor) {
  const higherFloor = yield select(state => Math.max(...state.lift.waitingFloor));
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

    const isIdle = yield isAnyFloorWaiting();
    if (!isIdle) {
      /* Wait for button press is there is not passenger waiting */
      yield take(liftActions.BUTTON_PRESS);
    } else {
      /* Take 4 seconds for lift to move between floor */
      yield delay(4000);

      if (currentFloor === 0) {
        movingUp = true;
      }
      const moveUp = yield isHigherFloorWaiting(currentFloor);
      if (movingUp && moveUp) {
        yield put(liftActions.moveUp());
      } else if (currentFloor > 0) {
        yield put(liftActions.moveDown());
        movingUp = false;
      }
    }
  }
}

export default function* liftSaga() {
  /* TODO: Program your saga for lift control here. 🙂 */
  yield all([
    watchLift(),
  ]);
}
