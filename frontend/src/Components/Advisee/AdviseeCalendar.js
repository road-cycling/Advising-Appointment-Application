import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";

import { connect } from 'react-redux'

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';



import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const localizer = BigCalendar.momentLocalizer(moment)

const styles = theme => ({
    progress: {
      padding: theme.spacing.unit * 2,
    },
  });
  

class AdviseeCalendar extends Component {
  state = {
    events: [],
    itemSelected: false,
    booking: false,
    finishedBooking: false,
    displayMessage: "",
    selected: {},
    spinnerCompleted: 0
  };

  async componentWillMount() {
    
    let { advisor_id } = this.props
    try {
      console.log('calendar mounting')
        const { data } = await axios.get(`http://localhost:8239/v1/advisingSession/${advisor_id}`)

        const events = data.map(event => {

            let { start_time, session_length } = event
            const d = new Date(start_time)

            return { ...event,
                start_time: new Date(moment(d, 'YYYY-MM-DD hh:mm:ss') .format('YYYY-MM-DD hh:mm:ss')),
                end_time: new Date(moment(d, 'YYYY-MM-DD hh:mm:ss').add(session_length, 'minutes').format('YYYY-MM-DD hh:mm:ss'))
            }

        })

        this.setState({ events })
    } catch (e) {
        console.log("monkaS")
    } 
  }

  eventSelected = (event) => {
    this.setState({
        selected: event,
        itemSelected: true
    })
  }

  handleClose = () => {
      this.setState({ itemSelected: false })
  }

  progress = () => {
    const { spinnerCompleted } = this.state;
    this.setState({ spinnerCompleted: spinnerCompleted >= 100 ? 0 : spinnerCompleted + 4 });
  };

  bookEvent = async () => {
      this.setState({ booking: true })
      let clear = setInterval(this.progress, 20);
      setTimeout(() => {
          clearInterval(clear)
      }, 1250)

      try {
        console.log(`advisor_id: ${this.state.selected.advisor_id}`)
        console.log(`lookup_key: ${this.state.selected.lookup_key}`)
        let { data } = await axios.post(`http://localhost:8239/v1/advisingSession/book`, {
            student_id: parseInt(this.props.student_id), 
            advisor_id: this.state.selected.advisor_id,
            lookup_key: this.state.selected.lookup_key
        })
        console.log(data)
        let { success } = data

        if ( success ) {
            this.setState({ finishedbooking: true, displayMessage: "Success!" })
        } else {
            this.setState({ finishedBooking: true, displayMessage: "Error :-(" })
        }

        setTimeout(() => {
            this.setState({ itemSelected: false, booking: false, finishedBooking: false, displayMessage: "", spinnerCompleted: 0 })
        }, 500)

      } catch (e) {
          clearInterval(clear)
          this.setState({ booking: false })
      }
      
  }

  render() {
    let { selected } = this.state
    return (
      <div className="App">
        <BigCalendar
        localizer={localizer}
        events={this.state.events}
        startAccessor="start_time"
        endAccessor="end_time"
        resourceAccessor="lookup_key"
        style={{ height: '100vh'}}
        onSelectEvent={this.eventSelected}
        // selected={this.state.selected}
    />
    {
        this.state.itemSelected &&

        <Snackbar
            key={1}
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            open={this.state.itemSelected}
            autoHideDuration={99999999}
            onClose={this.handleClose}
            onExited={this.handleExited}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.finishedBooking ? this.state.displayMessage : `Book ${selected.start_time.toDateString()} @ ${selected.start_time.toTimeString().substr(0,8)}?`}</span>}
            action={[
            <Button key="undo" color="secondary" size="small" onClick={this.bookEvent}>
                {this.state.booking ? 
                    (<CircularProgress
                        variant="determinate"
                        value={this.state.spinnerCompleted}
                      />) : "Book Now"
                    }
                
            </Button>,
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={"classes.close"}
                onClick={this.handleClose}
            >
                <CloseIcon />
            </IconButton>
            ]}
        />
    }
      </div>
    );
  }
}

function mapStateToProps({ userReducer: { user: { student_id } } }) {
  return { student_id }
}

export default connect(mapStateToProps, {})(withStyles(styles)(AdviseeCalendar))