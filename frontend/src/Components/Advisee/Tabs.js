import React from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ClearIcon from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';


import axios from 'axios'

const styles = {
  root: {
    flexGrow: 0,
  },
};

function TabContainer({ children, dir }) {
    return (
      <Typography component="div" dir={dir} style={{ padding: 8 * 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {children}
      </Typography>
    );
  }


  // appRouter.get('/advisingSession/student/approved/:student_id', middleware, AdvisingController.genericSelect.bind({
  //   query: `select * from AdvisingSession where student_id = ? AND approved = true AND start_time > NOW();`,
  //   url_param: ['student_id']
  // }))
  
  // appRouter.get('/advisingSession/student/pending/:student_id', middleware, AdvisingController.genericSelect.bind({
  //   query: `select * from AdvisingSession where student_id = ? AND approved = false AND start_time > NOW();`,
  //   url_param: ['student_id']
  // }))

class CenteredTabs extends React.Component {
  state = {
    value: 0,
    approved: [],
    pending: []
  };

  async componentWillMount() {
    let { user: { student_id } } = this.props
    try {
      const [ resp_1, resp_2 ] = await Promise.all([
        axios.get(`http://localhost:8239/v1/advisingSession/student/approved/${student_id}`),
        axios.get(`http://localhost:8239/v1/advisingSession/student/pending/${student_id}`)
      ])

      let approved = resp_1.data.data
      let pending = resp_2.data.data

      this.setState({ approved, pending })
      
    } catch (e) {
      console.log('monkaS')
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    const approvedAppointments = this.state.approved.map((item, key) => <TabContainer key={key}> { item } <ClearIcon /></TabContainer>)
    const pendingAppointments  = this.state.pending.map((item, key) => <TabContainer key={key}> { item } </TabContainer>)

    if (approvedAppointments.length === 0) {
      approvedAppointments.push( 
        <TabContainer key={0}>
          Suzanne Rivoire DUMMY APT - 04/30/19 - 12:00:00
          <ClearIcon />
        </TabContainer>)
    }

    if (pendingAppointments.length === 0) {
      pendingAppointments.push(
        <TabContainer key={0}>
            You Have No Pending Appointments 
        </TabContainer>
      )
    }

    return (
      <Paper className={classes.root}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Upcoming Apt" />
          <Tab label="Pending Apt" />
        </Tabs>
        {
            this.state.value === 0 ?  
              approvedAppointments : pendingAppointments
        }
      </Paper>
    );
  }
}

CenteredTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ userReducer: { user } }) {
  return { user }
}
export default connect(mapStateToProps, {})(withStyles(styles)(CenteredTabs))