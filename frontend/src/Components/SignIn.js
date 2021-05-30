import React, { Component } from 'react';

import axios from 'axios'
import { connect } from 'react-redux'

import {
    setCurrentUser,
    setAuthorizationToken
} from '../store/actions/auth'

import jwtDecode from 'jwt-decode'

import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class SignIn extends Component {

    state = {
        isAdvisor: false,
        password: "",
        id: ""

    };

    handleSwitch = (event) => {
        console.log(event)
        let { isAdvisor } = this.state 
        this.setState({ isAdvisor: !isAdvisor })
        event.stopPropagation()
    };

    contactServer = async (event) => {

        let { id, password, isAdvisor } = this.state 

        if (id === "" || password === "")
            return 

        axios.post(`http://localhost:8239/v1/${isAdvisor ? 'loginAdvisor' : 'loginAdvisee'}`, {
            student_id: parseInt(id),
            advisor_id: parseInt(id),
            h_password: password
        }).then(({ data }) => {
            
            let { success, jwt } = data

            if ( success ) {
                localStorage.setItem("jwtToken", jwt)

                let user = jwtDecode(jwt)
                setAuthorizationToken(jwt)
                this.props.setCurrentUser( user )

                if ( isAdvisor )
                    this.props.history.push('/advisor')
                else 
                    this.props.history.push('/advisee')
            }
        })

        event.preventDefault()

    }

    render () {
        const { classes } = this.props;

        return (
            <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {this.state.isAdvisor ? "Advisor": "AdviseeView"} Sign in
                </Typography>
                <form className={classes.form}>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel 
                        htmlFor="ID">
                        { this.state.isAdvisor ? "Advisor" : "Student" } ID Number
                    </InputLabel>
                    <Input 
                        id="ID" 
                        name="ID" 
                        autoComplete="ID" 
                        autoFocus 
                        value = {this.state.id}
                        onChange={event => this.setState({id: event.target.value})}
                    />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="password" borderColor="primary">
                        Password
                    </InputLabel>
                    <Input 
                        name="password" 
                        type="password" 
                        id="password"
                        autoFocus
                        autoComplete="current-password" 
                        value={this.state.password}
                        onChange={event => this.setState({ password: event.target.value })}
                    />
                </FormControl>
                <FormControlLabel
                    control={<Switch value="remember" color="primary" />}
                    onClick={this.handleSwitch}
                    label={this.state.isAdvisor ? "Advisor" : "Student"}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={this.contactServer}
                >
                    Sign in
                </Button>
                </form>
                    <br/>
                <a
                    href="/register"
                   color="secondary"
                   >
                        New User?
                </a>

            </Paper>
            </main>
        );
    }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default connect(() => ({}), { setCurrentUser })(withStyles(styles)(SignIn))
