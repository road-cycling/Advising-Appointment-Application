import React, { Component } from 'react';

import axios from 'axios'

import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
import AccountCircleTwoTone from '@material-ui/icons/AccountCircleTwoTone';

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

class Register extends Component {

    state = {
        isAdvisor: false,
        h_password: "",
        confirm_password: "",
        id: "",
        confirm_id: "",
        first_name: "",
        last_name: "",
        email: "",
        advisor_id: "",
        student_id: ""
    };

    handleSwitch = (event) => {
        console.log(event)
        let { isAdvisor } = this.state
        this.setState({ isAdvisor: !isAdvisor })
        event.stopPropagation()

        console.log(this.state)
    };

    contactServer = async (event) => {

        let { id, password, isAdvisor } = this.state

        if (id === "" || password === "")
            return

        let config = {
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:8000',
                'Access-Control-Allow-Credentials': 'true'
            }
        }


        axios.post(`http://.cs..edu:60000/v1/${isAdvisor ? 'createAdvisor' : 'createAdvisee'}`, {
            student_id: parseInt(id),
            advisor_id: parseInt(id),
            h_password: this.state.h_password,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email
        }, config).then(result => console.log(result))

        event.preventDefault()

    }

    render () {
        const { classes } = this.props;

        return (
            <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
            <AccountCircleTwoTone />
            </Avatar>
            <Typography component="h1" variant="h5">
            {this.state.isAdvisor ? "Advisor": "AdviseeView"} Register
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
        value = {this.state.ID}
        onChange={event => this.setState({ID: event.target.value})}
        />
        <Input
        placeholder="EMAIL"
        id="email"
        name="email"
        autoFocus
        value = {this.state.email}
        onChange={event => this.setState({email: event.target.value})}
        />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
        <InputLabel htmlFor="password">
            Password
            </InputLabel>
            <Input
        name="password"
        type="password"
        id="password"
        onChange={event => this.setState({ h_password: event.target.value })}
        />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
        <Input
        placeholder="CONFIRM PASSWORD"
        name="confirm_password"
        type="password"
        id="confirm_password"
        value={this.state.confirm_password}
        onChange={event => this.setState({ confirm_password: event.target.value })}

        />
            <FormControl
                margin="normal"
                >
                <InputLabel>First Name</InputLabel>
                <Input
                    margin="normal"
                    name="first_name"
                    id="first_name"
                    value={this.state.first_name}
                    placeholder="First Name"
                    >
                </Input>
            </FormControl>
            <FormControl>
                <InputLabel >Last Name</InputLabel>
                <Input
                    margin="normal"
                    name="last_name"
                    id="last_name"
                    value={this.state.last_name}
                    placeholder="Last Name"
                >
                </Input>
            </FormControl>
        </FormControl>
        <FormControlLabel
        control={<Switch value="remember" color="primary" disabled_color="secondary"/>}
        onClick={this.handleSwitch}
        label={this.state.isAdvisor ? "Student":"Advisor"}
        />
        <Button
        disabled={this.state.h_password !== this.state.confirm_password}
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={this.contactServer}
            >
            Register
            </Button>
            </form>
                <br/>
                <a
                    href="/"
                    color="secondary"
                >
                    Back to Login
                </a>

            </Paper>
            </main>
    );
    }
}

Register.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);

