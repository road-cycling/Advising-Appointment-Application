import React from 'react';

import axios from 'axios'
import { connect } from 'react-redux'

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import DoneIcon from '@material-ui/icons/Done';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    maxHeight: '86%',
    overflow: 'auto',
  },
});

//For the sake of display we will include these 
class PureStudentList extends React.Component {
  state = {
    students: [
      { name: '...', email: '...' },

    ]
  };

  async componentWillMount() {
    let { user: { advisor_id } } = this.props
    try {
      const { data: { success, data } } = await axios.get(`http://localhost:8239/v1/advisingSession/advisee/${advisor_id}`)

      if ( success ) {
        let studentsAdvised = data.map(({ first_name, last_name, email }) => { return { name: `${first_name} ${last_name}`, email } })
        this.setState({ students: [...this.state.students, ...studentsAdvised] })
      }

    } catch (e) {
      console.log('monkaS')
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <List className={classes.root}>
        {this.state.students.map(({ name, email }, idx) => (
          <ListItem key={idx} dense button >
            <ListItemText primary={name} />
            <ListItemSecondaryAction>
              <IconButton aria-label="Email">
                <a
                style={{ textDecoration: 'none', color: 'gray', fontSize: 1 }}
                href={`mailto:${email}`}
                >
                <EmailIcon />
                </a>
              
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}


class PureStudentPending extends React.Component {
  state = {
    pendingAppointment: [
      { name: ' dd', date: '04/15/2019 - 10:00 AM', student_id: 4564534, lookup_key: 'foo' },
      { name: 'dd d', date: '04/15/2019 - 10:20 AM', student_id: 2345, lookup_key: 'foo' },
      { name: 'Tdd', date: '04/15/2019 - 10:40 AM', student_id: 4564534, lookup_key: 'foo' },
      { name: 'dd dd', date: '04/15/2019 - 11:00 AM', student_id: 2345, lookup_key: 'foo' },
    ]
  };

  async componentWillMount() {

    let { user: { advisor_id } } = this.props
    try {
      const { data: { success, data } } = await axios.get(`http://localhost:8239/v1/advisingSession/pending/${advisor_id}`)

      if ( success ) {
        let pendingAppointment = data.map(
            ({ student_id, start_time, lookup_key, first_name, last_name }) => 
              ({ name: `${first_name} ${last_name}`, 
              date: new Date(start_time).toString().slice(0, 25), 
              student_id, 
              lookup_key }))
        this.setState({ pendingAppointment })
      }

    } catch (e) {
      console.log('monkaS')
    }
  }

  signUpForEvent = async (lookup_key) => {

    let { user: { advisor_id } } = this.props

    try {
      await axios.post(`http://localhost:8239/v1/advisingSession/approve`, { advisor_id, lookup_key })

      const newState = this.state.pendingAppointment.filter(item => item.lookup_key !== lookup_key)
      this.setState({ pendingAppointment: newState })
    } catch (e) {
      console.log(e)
      console.log('monkaS')
    }
  }
  

  render() {
    const { classes } = this.props;

    return (
      <List className={classes.root}>
        {this.state.pendingAppointment.map(({ name, date, lookup_key }, idx) => (
          <ListItem key={idx} dense button >
            <ListItemText primary={`${name} ${date}`} />
            <ListItemSecondaryAction>
              <span style={{color: 'green'}}>
                <IconButton 
                  aria-label="Done" 
                  color="inherit"
                  onClick={() => this.signUpForEvent(lookup_key)}
                >
                  <DoneIcon/>              
                </IconButton>
              </span>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}

PureStudentList.propTypes = {
  classes: PropTypes.object.isRequired,
};

PureStudentPending.propTypes = {
  classes: PropTypes.object.isRequired
}

function mapStateToProps({ userReducer: { user } }) {
  return { user }
}

const StudentList = 
  connect(mapStateToProps, {})(withStyles(styles)(PureStudentList))

const StudentPending = 
  connect(mapStateToProps, {})(withStyles(styles)(PureStudentPending))

export  { StudentList, StudentPending }

