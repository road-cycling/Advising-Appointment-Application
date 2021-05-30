import React, { Component } from "react";

import { connect } from 'react-redux'

import BigCalendar from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const localizer = BigCalendar.momentLocalizer(moment)


class CalendarComponent extends Component {
  state = {
    events: [],
    selected: {}
  };

  async componentWillMount() {

    try {

      console.log('calendar mounting')
      console.log(this.props)
        const { data } = await axios.get(`http://localhost:8239/v1/advisingSession/${this.props.advisor_id}`)
        const events = data.map(event => {

            let { start_time, session_length } = event
            const d = new Date(start_time)
            
            return { 
                start_time: new Date(moment(d, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD hh:mm:ss')),
                end_time: new Date(moment(d, 'YYYY-MM-DD hh:mm:ss').add(session_length, 'minutes').format('YYYY-MM-DD hh:mm:ss')),
            }
        })

        this.setState({ events })
    } catch (e) {
      console.log(e)
        console.log("monkaS")
    } 
  }

  render() {
    return (
      <div className="App">
        <BigCalendar
        localizer={localizer}
        events={this.state.events}
        startAccessor="start_time"
        endAccessor="end_time"
        resourceAccessor="lookup_key"
        style={{ height: '70.5vh'}}
        onSelectEvent={event => console.log(event)}
    />
      </div>
    );
  }
}

function mapStateToProps({ userReducer: { user } }) {
  let { advisor_id } = user 
  return { advisor_id }
}

export default connect(mapStateToProps, {})(CalendarComponent)
// export default CalendarComponent;
