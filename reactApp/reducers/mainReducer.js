
// Default state is ordered by timeslot first, then day of the week
// Timeslots go from 9 AM to 4 PM.     Each timeslot is one Hour.     The day ends at 5 PM.
// Days of the Week go from Sunday(0) to Saturday(6)
// defaultState[ 0 ][ 0 ] = defaultState[  9 AM ][ Sunday ]
// defaultState[ 3 ][ 6 ] = defaultState[ 12 PM ][ Saturday ]
// defaultState[ 8 ][ 5 ] = defaultState[  4 PM ][ Friday ]

//  Sunday to Saturday:  0  1  2  3  4  5  6
const defaultState = [ [ 0, 0, 0, 0, 0, 0, 0 ],   //  9 AM
                       [ 0, 0, 0, 0, 0, 0, 0 ],   // 10 AM
                       [ 0, 0, 0, 0, 0, 0, 0 ],   // 11 AM
                       [ 0, 0, 0, 0, 0, 0, 0 ],   // 12 PM
                       [ 0, 0, 0, 0, 0, 0, 0 ],   //  1 PM
                       [ 0, 0, 0, 0, 0, 0, 0 ],   //  2 PM
                       [ 0, 0, 0, 0, 0, 0, 0 ],   //  3 PM
                       [ 0, 0, 0, 0, 0, 0, 0 ] ]; //  4 PM

function cloneState( state ) {
  const newState = [];
  for( let i = 0; i < 8; i++ ) {
    const newInnerArr = [ 0, 0, 0, 0, 0, 0, 0 ];
    for( let j = 0; j < 7; j++ ) {
      if( state[i][j] !== 0 ) {
        newInnerArr[j] = Object.assign( {}, state[i][j] );
      }
    }
    newState.push( newInnerArr );
  }
  return newState;
}

const mainReducer = ( state = defaultState, action ) => {
  switch( action.type ) {
    case "ADD_TIMESLOT": {
      // Adds a new Timeslot to a specific day of the week
      const newState = cloneState( state );
      const newTimeslotObj = {
        name: action.name,
        number: action.number,
      }
      newState[ action.timeStart ][ action.day ] = newTimeslotObj;
      return newState;
    }
    case "EDIT_TIMESLOT": {
      // Finds and Edits an existing Timeslot
      let newState = cloneState( state );
      const newTimeslotObj = {
        name: action.name,
        number: action.number,
      }
      newState[ action.prevTimeStart ][ action.prevDay ] = 0;
      newState[ action.timeStart ][ action.day ] = newTimeslotObj;
      return newState;
    }
    case "REMOVE_TIMESLOT": {
      // Finds and Removes an existing Timeslot
      let newState = cloneState( state );
      newState[ action.timeStart ][ action.day ] = 0;
      return newState;
    }
    default: {
      return state;
    }
  }
}
export default mainReducer;