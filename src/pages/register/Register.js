import React from 'react';
import { Container, Form, Button, Input, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startRegisterUser } from '../../store/actions/auth';

class Register extends React.Component {
    state = {
        email: '',
        firstName: '',
        lastName: '',
        username: '',
        gender: 'male',
        password: '',
        confirmPassword: '',
        registrationError: '',
        isRegistering: false
    }
    onRegisterSubmit = () => {
        this.setState({ isRegistering: true });
        this.props.startRegisterUser({
            email: this.state.email.trim(),
            firstName: this.state.firstName.trim(),
            lastName: this.state.lastName.trim(),
            username: this.state.username.trim(),
            gender: this.state.gender.trim(),
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        })
        .then(() => {
            this.setState({ isRegistering: false });
            this.props.history.push('/')
        })
        .catch((error) => {
            this.setState({
                registrationError: error.message,
                isRegistering: false
            });
        });
    }
    render = () => (
        <Container>
            <div className="auth-form">
                { this.state.registrationError && (
                    <Message negative>
                        <Message.Header>There has been a problem.</Message.Header>
                        <p>{this.state.registrationError}</p>
                    </Message>
                )}
                <h1 className="auth-form__form-title">Register form</h1>
                <Form onSubmit={this.onRegisterSubmit}>
                    <Form.Field>
                    <label>Email address</label>
                    <input placeholder='Enter your email address.' type="email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} />
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Field
                            control={Input}
                            label='First name'
                            placeholder='First name'
                            value={this.state.firstName}
                            onChange={(e) => this.setState({firstName: e.target.value})}
                        />
                        <Form.Field
                            control={Input}
                            label='Last name'
                            placeholder='Last name'
                            value={this.state.lastName}
                            onChange={(e) => this.setState({lastName: e.target.value})}
                        />
                        </Form.Group>
                    <Form.Field>
                    <Form.Field>
                        <label>Username</label>
                        <input placeholder='Enter your username' type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value.toLowerCase()})} maxlength="16" />
                        </Form.Field>
                    <Form.Field>
                    <label>Gender</label>
                    <select label='Select gender' control='select' className="ui selection dropdown" value={this.state.gender} onChange={(e) => this.setState({gender:e.target.value})}>
                        <option value='male'   className="item">Male</option>
                        <option value='female' className="item">Female</option>
                        <option value='other'  className="item">Other</option>
                    </select>
                    </Form.Field>
                    <label>Password</label>
                    <input placeholder='Enter your password' type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} />
                    </Form.Field>
                    <Form.Field>
                    <label>Confirmation password</label>
                    <input placeholder='Enter confirmation password' type="password" value={this.state.confirmPassword} onChange={(e) => this.setState({confirmPassword: e.target.value})} />
                    </Form.Field>
                    <Button className="auth-form-submit" secondary type='submit' disabled={this.state.isRegistering} loading={this.state.isRegistering}>Register</Button>
                    <Link style={{ display: 'block', marginTop: 15 }} to="/login">Already user? Sign in.</Link>
                </Form>
            </div>
        </Container>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        startRegisterUser: (credentials) => dispatch(startRegisterUser(credentials))
    }
}

export default connect(undefined, mapDispatchToProps)(Register);