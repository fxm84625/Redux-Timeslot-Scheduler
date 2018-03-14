import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
Modal.setAppElement( "#root" );

const dayNumToString = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
const timeNumToString = [ '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM' ];

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      modalType: 'Add',   // Determines whether to "Add" new Timeslot or "Edit" existing Timeslot
      inputName: '',
      inputNumber: '',
      inputDay: 0,        // Numbers to Days of the Week: Sunday(0) to Saturday(6)
      prevInputDay: 0,        // Used for finding a Day of the Week to Edit
      inputTimeStart: 0,  // Only accepts time in one hour increments. Numbered from 0-23
                          // 9 -> 9 AM,   13 -> 1 PM,   17 -> 5 PM
      prevTimeStart: 0,       // Used for finding a Timeslot to Edit
    };
  }
  
  openModal( time, day, type = 'Add', name, number )  {
    this.setState({
      showModal: true,
      modalType: type,
      inputName: name ? name : '',
      inputNumber: number ? number: '',
      inputDay: day,
      prevInputDay: day,
      inputTimeStart: time,
      prevTimeStart: time,
    });
  }
  closeModal() {
    this.setState({ showModal: false });
  }
  renderModal() {
    return (
      <Modal
        isOpen={ this.state.showModal }
        onRequestClose={ () => this.closeModal() }
        className="modalBody"
        contentLabel={ this.state.modalType + " Timeslot" }
        shouldFocusAfterRender={true}
      >
        <label className="modalLabel"> Day: </label>
        <select className="modalField" value={ this.state.inputDay } onChange={ (e) => this.setState({ inputDay: e.target.value }) }>
          <option value={ 0 }> { dayNumToString[ 0 ] } </option>
          <option value={ 1 }> { dayNumToString[ 1 ] } </option>
          <option value={ 2 }> { dayNumToString[ 2 ] } </option>
          <option value={ 3 }> { dayNumToString[ 3 ] } </option>
          <option value={ 4 }> { dayNumToString[ 4 ] } </option>
          <option value={ 5 }> { dayNumToString[ 5 ] } </option>
          <option value={ 6 }> { dayNumToString[ 6 ] } </option>
        </select><br/>
        <span className="modalLabel"><label> Start Time: </label></span>
        <input
          className="modalField"
          type="time" step="3600"
          placeholder="Start Time"
          value={ this.state.inputTimeStart < 10 ? '0' + String(this.state.inputTimeStart) + ":00" : String(this.state.inputTimeStart) + ":00" }
          onChange={ (e) => this.setState({ inputTimeStart: parseInt(e.target.value.split(':')[0]) }) }
        /><br/>
        <span className="modalLabel"><label> Name: </label></span>
        <input
          className="modalField"
          type="text"
          placeholder="Name"
          value={ this.state.inputName }
          onChange={ (e) => this.setState({ inputName: e.target.value }) }
        /><br/>
        <span className="modalLabel"><label> Phone Number: </label></span>
        <input
          className="modalField"
          type="text"
          placeholder="Phone Number"
          value={ this.state.inputNumber }
          onChange={ (e) => this.setState({ inputNumber: e.target.value }) }
        /><br/>
        <div className="modalButtonContainer">
          {
            this.state.modalType === 'Add'
            ? <button className="modalButton" onClick={ () => this.addTimeslot()  }> Submit Timeslot </button>
            : <button className="modalButton" onClick={ () => this.editTimeslot() }> Edit Timeslot </button>
          }
          <button className="modalButton" onClick={ () => this.removeTimeslot() }> Remove Timeslot </button>
          <button className="modalButton" onClick={ () => this.closeModal() }> Cancel </button>
        </div>
      </Modal>
    );
  }
  renderScheduler() {
    const scheduleElementArray = [];
    // this.props.schedulerArray is ordered by Time first, then Day of the Week
    // schedulerArray[ 0 ][ 0 ] = schedulerArray[  9 AM ][ Sunday ]
    // schedulerArray[ 3 ][ 6 ] = schedulerArray[ 12 PM ][ Saturday ]
    // schedulerArray[ 8 ][ 5 ] = schedulerArray[  4 PM ][ Friday ]
    
    for( let i = 0; i < 8; i++ ) {    // Looping through each Timeslot
      const timeslotElementArray = [];
      timeslotElementArray.push( <th width="7.5%">{ timeNumToString[i] }</th> );
      for( let j = 0; j < 7; j++ ) {  // Looping through each Day of the Week
        if( this.props.schedulerArray[i][j] === 0 ) {
          timeslotElementArray.push(
            <td
              className="tableEmptyTimeslot" width="12.5%"
              onClick={ () => this.openModal( i+9, j, 'Add' ) }
            >
            </td>
          );
        }
        else {
          timeslotElementArray.push(
            <td
              className="tableTimeslot" width="12.5%"
              onClick={ () => this.openModal( i+9, j, 'Edit', this.props.schedulerArray[i][j].name, this.props.schedulerArray[i][j].number ) }
            >
              <div className="tableTimeslotTop">
                { this.props.schedulerArray[i][j].name }
              </div>
              <div className="tableTimeslotBottom">
                { this.props.schedulerArray[i][j].number }
              </div>
            </td>
          );
        }
      }
      scheduleElementArray.push(
        <tr>
          { timeslotElementArray }
        </tr>
      );
    }
    
    return (
      <table width="95%">
        <thead>
          <tr>
            <th width="7.5%"> </th>
            <th> Sunday    </th>
            <th> Monday    </th>
            <th> Tuesday   </th>
            <th> Wednesday </th>
            <th> Thursday  </th>
            <th> Friday    </th>
            <th> Saturday  </th>
          </tr>
        </thead>
        <tbody>
          { scheduleElementArray }
        </tbody>
      </table>
    );
    
  }
  
  addTimeslot() {
    // Makes a call to Add a new Timeslot to a specific day of the week
    this.setState({
      showModal: false,
      inputName: '',
      inputNumber: '',
      inputDay: 0,
      inputTimeStart: 0,
    });
    if( this.props.schedulerArray[ this.state.inputTimeStart-9 ][ this.state.inputDay ] === 0 ) {
      this.props.dispatchAddTimeslot(
        this.state.inputName,
        this.state.inputNumber,
        this.state.inputDay,
        this.state.inputTimeStart-9,
      );
    }
  }
  editTimeslot() {
    // Makes a call to Edit an existing Timeslot
    this.setState({
      showModal: false,
      inputName: '',
      inputNumber: '',
      inputDay: 0,
      inputTimeStart: 0,
    });
    if( (this.state.inputTimeStart === this.state.prevTimeStart && this.state.inputDay === this.state.prevInputDay)
    || (this.props.schedulerArray[ this.state.inputTimeStart-9 ][ this.state.inputDay ] === 0) ) {
      this.props.dispatchEditTimeslot(
        this.state.inputName,
        this.state.inputNumber,
        this.state.inputDay,
        this.state.prevInputDay,
        this.state.inputTimeStart-9,
        this.state.prevTimeStart-9,
      );
    }
  }
  removeTimeslot() {
    // Makes a call to Remove an existing Timeslot
    this.setState({
      showModal: false,
      inputName: '',
      inputNumber: '',
      inputDay: 0,
      inputTimeStart: 0,
    });
    this.props.dispatchRemoveTimeslot( this.state.inputDay, this.state.inputTimeStart-9 );
  }
  
  render() {
    // <button onClick={ () => this.openModal() }> New Timeslot </button>
    return (
      <div>
        { this.state.showModal ? this.renderModal() : null }
        { this.renderScheduler() }
      </div>
    );
  }
};

const mapStateToProps = ( state ) => ({
  schedulerArray: state,
});

const mapDispatchToProps = ( dispatch ) => ({
  // Adds a new Timeslot to a specific day of the week
  dispatchAddTimeslot: ( name, number, day, timeStart ) =>
    dispatch({ type: "ADD_TIMESLOT",  name: name, number: number, day: day, timeStart: timeStart }),
  // Finds and Edits an existing Timeslot
  dispatchEditTimeslot: ( name, number, day, prevDay, timeStart, prevTimeStart ) =>
    dispatch({ type: "EDIT_TIMESLOT", name: name, number: number, day: day, prevDay: prevDay, timeStart: timeStart, prevTimeStart: prevTimeStart }),
  // Finds and Removes an existing Timeslot
  dispatchRemoveTimeslot: ( day, timeStart ) =>
    dispatch({ type: "REMOVE_TIMESLOT", day: day, timeStart: timeStart }),
});

App = connect(mapStateToProps, mapDispatchToProps)(App);

export default App;
