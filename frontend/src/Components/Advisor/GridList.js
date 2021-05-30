import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import GridList from '@material-ui/core/GridList';
import axios from 'axios'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
    fontSize: 14
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  card: {
    minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    pos: {
        marginBottom: 12,
    }
});

class FormDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We will send
              updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

function SimpleCard(props) {
    let { styles, data, upcoming, advisor_id } = props

    let [shouldDisplay, setDisplay] = useState(false)
    let [comments, updateComments] = useState('')

    const updateState = newValue => {
      setDisplay(newValue)
    }

    const handleSubmit = async () => {
      let oldData = data
      try {
        await axios.put(`http://localhost:8239/v1/advisingSession/comments`, {
          comments,
          advisor_id,
          lookup_key: oldData.lookup_key
        })

      } catch (e) {
        console.log(e)
        console.log('monkaS')
      }
      setDisplay(false)
    }

    return (
    <div>
      <Card className={styles.card} onClick={() => updateState(true)}>
        <CardContent>
          <Typography className={styles.title} color="textSecondary" gutterBottom>
            {upcoming ? "Upcoming" : "Past"} Appointment
          </Typography>
          <Typography variant="h5" component="h2">
            { data.name }
          </Typography>
          <Typography className={styles.pos} color="textSecondary">
            {data.year} ID #{data.id}
          </Typography>
          <Typography component="p">
            {data.date}
          </Typography>
        </CardContent>
        <FormDialog/>
      </Card>
      <Dialog
          open={shouldDisplay}
          onClose={() => updateState(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Comment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Notes👇🏼
            </DialogContentText>
            <TextField
              id="filled-multiline-static"
              label="Comment"
              multiline
              style={{ width: '500px' }}
              onChange={event => updateComments(event.target.value)}
              rows="8"         
              margin="normal"
              variant="filled"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              updateState(false)
            }} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

const tileData = [
    {
        name: '',
        year: 'Senior',
        id: 4793287,
        date: 'January 5, 2017 @ 10:30am',
        lookup_key: 'asdf'
    },
    {
        name: '',
        year: 'Senior',
        id: 23452345,
        date: 'January 5, 2017 @ 11:00am',
        lookup_key: 'asdf'
    },
    {
        name: ' L',
        year: 'Senior',
        id: 4534656,
        date: 'January 5, 2017 @ 11:30am',
        lookup_key: 'asdf'
    },
    {
        name: 'n',
        year: 'Senior',
        id: 4793287,
        date: 'January 5, 2017 @ 12:00am',
        lookup_key: 'asdf'
    },
    {
        name: ' ',
        year: 'Senior',
        id: 2463456,
        date: 'January 5, 2017 @ 12:30am',
        lookup_key: 'asdf'
    },
    {
        name: '',
        year: 'Senior',
        id: 23452345,
        date: 'January 5, 2017 @ 1:00am',
        lookup_key: 'asdf'
    }
]

function SingleLineGridList(props) {
  const { classes, upcoming } = props;
  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {tileData.map((tile, idx) => (
            <SimpleCard key={idx} styles={classes} data={tile} upcoming={upcoming}/>
        ))}
      </GridList>
    </div>
  );
}

class UpcomingAppointments extends Component {

  state = {
    upcomingAppointments: tileData,
    pastAppointments: tileData
  }

  async refreshAppointments(type) {
  
    let { advisor_id } = this.props
    try {
      const { data } = await axios
        .get(`http://localhost:8239/v1/advisingSession/${type}/${advisor_id}`)

      const newData = data.data.map(item => {
        return { name: "Update Join", year: "Senior", id: item.student_id, date: new Date(item.start_time).toString().slice(0, 25), lookup_key: item.lookup_key }
      })

      if (type === 'upcoming')
        
        this.setState({ upcomingAppointments: [...this.state.upcomingAppointments, ...newData] })
      else 
        this.setState({ pastAppointments: [...this.state.pastAppointments, ...newData] })

    // localStorage.setItem(`${upcoming===true ? 'upcoming': 'past'}appointments`, JSON.stringify({ ...newData, date: new Date() }))

    } catch (e) {
      console.log('monkaS')
    }
  }

  async componentWillMount(){
    await this.refreshAppointments('upcoming')
    await this.refreshAppointments('past')
  }

  render() {
    const { classes, upcoming, advisor_id } = this.props
    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cols={2.5}>
        {this.state.upcoming ?
          (this.state.upcomingAppointments.map((tile, idx) => (
            <SimpleCard 
              key={idx} 
              styles={classes} 
              data={tile} 
              upcoming={upcoming}
              advisor_id={advisor_id} 
            />
          )))
          :
          (this.state.pastAppointments.map((tile, idx) => (
            <SimpleCard 
              key={idx} 
              styles={classes} 
              data={tile} 
              upcoming={upcoming} 
              advisor_id={advisor_id}
              />
          )))
        }
        </GridList>
      </div>
    )
  }

}


SingleLineGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ userReducer: { user } }) {
  let { advisor_id } = user
  return { advisor_id }
}

export default connect(mapStateToProps, {})(withStyles(styles)(UpcomingAppointments))