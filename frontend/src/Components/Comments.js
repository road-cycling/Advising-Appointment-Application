import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import EmailIcon from '@material-ui/icons/Email';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

import axios from 'axios'

const styles = theme => ({
  root: {
    width: '95vw',
    height: '100vh',
    margin: theme.spacing.unit * 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flexStart',
  },
  table: {
    width: '90%',
  },
  button: {
    
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    left: '0',
    right: '0',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '100px'

  },
});


class SimpleModal extends React.Component {

    render() {
      const { classes, handleClose, open, comment } = this.props;
    
      return (
        <div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
          >
            <div className={classes.paper}>
              <Typography variant="h6" id="modal-title">
                Comments
              </Typography>
              <Typography 
                style={{ maxHeight: '100%', overflow: 'auto' }}
                variant="subtitle1" 
                id="simple-modal-description">
              { comment }
              </Typography>
            </div>
          </Modal>
        </div>
      );
    }
  }
  


class AdvisorComments extends Component {
  
    state = {
        pastAppointments: [
            { 
                full_name: '', 
                appointment_time: `${new Date().toString().substring(0, 25)}`, 
                comments: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`, 
                missed: 'False',
                email: '@.com',
                lookup_key: "dummy"
            }
        ],
        selectedAppointmentIndex: -1,
        open: false
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleOpenExtended = (idx) => {
        this.setState({ selectedAppointmentIndex: idx })
        this.handleOpen()
    }
    
    handleClose = () => {
        this.setState({ open: false });
    };

    async componentWillMount() {
        try {
            const { data: { data } } = await axios.get(`http://localhost:8239/v1/advisingSession/past/data/${this.props.user.advisor_id}`)
            console.log('data is')
            console.log(data)
            const newData = data.map(user => {
                return { full_name: `${user.first_name} ${user.last_name}`, 
                         appointment_time: new Date(user.start_time).toString().substring(0, 25), 
                         comments: user.comments, 
                         missed: `${user.missed === 0 ? 'False' : 'True'}` ,
                         email: user.email,
                         lookup_key: user.lookup_key
                }
            }).reverse()
            
            // I need my dummy data to stay sane
            this.setState({
                pastAppointments: [...this.state.pastAppointments, ...newData]
            })

        } catch (e) {
            console.log('monkaS')
        }
    }

    async markMissed(lookup_key) {
        try {
            await axios.put(`http://localhost:8239/v1advisingSession/missed`, { lookup_key })
            const newState = this.state.pastAppointments.map(appointment => {
                if ( appointment.lookup_key === lookup_key )
                    return { lookup_key, ...appointment }
                return appointment
            })

            this.setState({ pastAppointments: newState })
        } catch (e) {
            console.log('monkaS')
        }
    }

    render() {

        let { selectedAppointmentIndex } = this.state 

        let com = selectedAppointmentIndex === -1 
            ? "I don't think this code will ever be executed"
            : this.state.pastAppointments[selectedAppointmentIndex].comments

        const { classes } = this.props;
        return (
            <div>
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                        <TableRow>
                            <TableCell>Full Name</TableCell>
                            <TableCell align="left">Time</TableCell>
                            <TableCell align="right">Missed</TableCell>
                            <TableCell align="right">Mark Missed</TableCell>
                            <TableCell align="right">Email</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.pastAppointments.map((row, id) => (
                            <TableRow 
                                key={id}
                                hover
                            >
                            <TableCell 
                                onClick={() => this.handleOpenExtended(id)}
                                component="th"
                                scope="row"
                            >
                                {row.full_name}
                            </TableCell>
                            <TableCell align="left">{row.appointment_time}</TableCell>
                            <TableCell align="right">{row.missed}</TableCell>
                            <TableCell align="right">
                                <Button variant="contained" className={classes.button} onClick={() => this.markMissed(row.lookup_key)}>
                                    Missed
                                </Button>
                            </TableCell>
                            <TableCell align="right">
                                <IconButton aria-label="Email">
                                    <a
                                        style={{ textDecoration: 'none', color: 'gray', fontSize: 1 }}
                                        href={`mailto:${row.email}`}
                                    >
                                        <EmailIcon />
                                    </a>
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </Paper>
                <SimpleModal 
                    classes={classes} 
                    open={this.state.open}
                    handleOpen={this.handleOpen}
                    handleClose={this.handleClose}
                    comment={com}
                />
            </div>
        );
    }
}

AdvisorComments.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ userReducer: { user } }) {
    return { user }
}

// export default withStyles(styles)(AdvisorComments);
// export default AdvisorComments;


export default connect(mapStateToProps, {})(withStyles(styles)(AdvisorComments))