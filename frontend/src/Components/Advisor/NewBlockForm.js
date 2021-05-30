// import 'date-fns';

import React, { Component } from 'react'
// import { connect } from 'react-redux'
import axios from 'axios'

import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';


/*
advisor_id,
start_day,
session_length,
num_sessions_in_day

*/

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Snackbar from '@material-ui/core/Snackbar';



import { 
    MuiPickersUtilsProvider, 
    TimePicker, 
    DatePicker 
} from 'material-ui-pickers';
import { connect } from 'react-redux';


const styles = {
    grid: {
      width: '60%',
    },
  };

class NewBlockForm extends Component {

    state = {
        selectedDate: new Date(),
        sessionLength: '',
        numSession: '',
        displaySnackbar: false,
        snackbarMessage: ""
    }

    handleDateChange = date => {
        this.setState({ selectedDate: date });
    };

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    onCreateBlock = async (event) => {

        let { selectedDate, sessionLength, numSession } = this.state

        try {

            let { data } = await axios.post(`http://localhost:8239/v1/createBlock`, {
                advisor_id: this.props.advisor_id, 
                start_day: selectedDate,
                session_length: parseInt(sessionLength),
                num_sessions_in_day: parseInt(numSession)
            })

            let { success } = data;

            if ( success ) {
                 await this.setState({ displaySnackbar: true, snackbarMessage: 'Success!' })
            } else {
                await this.setState({ displaySnackbar: false, snackbarMessage: "Error :-(" })
            }

        } catch (e) {

        }

        setTimeout(() => {
            this.setState({ displaySnackbar: false, snackbarMessage: "" })
            this.props.handleClose(0)
        }, 500)
        
    }

    render() {
        const { classes, open, handleClose } = this.props;
        const { selectedDate, displaySnackbar } = this.state;
        return (
            <Dialog
            open={open > 0 ? true : false}
            onClose={() => /*handleClose(false)*/ {}}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Create Block</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To create a new advising block - please fill in this form and submit!
              </DialogContentText>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', height: '100%', marginTop: '10px' }}>
                    <div style={{ display: 'flex'}}>
                        <DatePicker
                            margin="normal"
                            label="Date picker"
                            value={selectedDate}
                            style={{ margin: '10px'}}
                            onChange={this.handleDateChange}
                        />
                        <TimePicker
                            margin="normal"
                            label="Time picker"
                            value={selectedDate}
                            style={{ margin: '10px' }}
                            onChange={this.handleDateChange}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FormControl className={classes.formControl} style={{ margin: '20px' }}>
                            <InputLabel htmlFor="session-length-native-simple">Session Length</InputLabel>
                            <Select
                                native
                                value={this.state.sessionLength}
                                onChange={this.handleChange('sessionLength')}
                                style={{ width: '130px' }}
                                inputProps={{
                                name: 'Session Length',
                                id: 'session-length-native-simple',
                                }}
                            >
                                <option value="" />
                                <option value={10}>10 Min</option>
                                <option value={20}>20 Min</option>
                                <option value={30}>30 Min</option>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl} style={{ margin: '20px' }}>
                            <InputLabel htmlFor="age-native-simple"># Sessions</InputLabel>
                            <Select
                                native
                                autoWidth={false}
                                value={this.state.numSession}
                                onChange={this.handleChange('numSession')}
                                style={{ width: '100px' }}
                                inputProps={{
                                name: '#asdfasdfas',
                                id: 'age-native-simple',
                                }}
                            >
                                {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((item, idx) => {
                                    if ( idx === 0 )
                                        return <option key={idx} value="" />

                                    return <option key={idx} value={item}>{item}</option>
                                })}
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(0)} color="primary">
                Cancel
              </Button>
              <Button onClick={this.onCreateBlock} color="primary">
                Create
              </Button>
            </DialogActions>
            {displaySnackbar && <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={true}
                autoHideDuration={300}
                onClose={() => {}}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Success!</span>}
            />}
          </Dialog>
        )
    }
}


function mapStateToProps({ userReducer: { user } }) {
    return {
        advisor_id: user.advisor_id
    }
}

// export default withStyles(styles)(NewBlockForm);
export default connect(mapStateToProps)(withStyles(styles)(NewBlockForm));

// export default NewBlockForm