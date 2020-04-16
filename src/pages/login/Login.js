import React from 'react';
import { Container, Form, Button, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startLoginUser } from '../../store/actions/auth';

class Login extends React.Component {
    state = {
        email: '',
        password: '',
        loginError: '',
        isLoggingIn: false
    }
    onLoginSubmit = () => {
        console.log('its working');
        this.setState({ isLoggingIn: true });
        this.props.startLoginUser({
            email: this.state.email,
            password: this.state.password
        })
        .then(() => {
            this.setState({ isLoggingIn: false });
            this.props.history.push('/')
        })
        .catch((error) => {
            this.setState({ loginError: error.message, isLoggingIn: false })
        });
    }
    render = () => (
        <Container>
            <div className="auth-form">
            { this.state.loginError && (
                <Message negative>
                    <Message.Header>There has been a problem.</Message.Header>
                    <p>{this.state.loginError}</p>
                </Message>
            )}
                <h1 className="auth-form__form-title">Login form</h1>
                <Form onSubmit={this.onLoginSubmit}>
                    <Form.Field>
                    <label>Email address</label>
                    <input placeholder='Enter your email address.' type="email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} />
                    </Form.Field>
                    <Form.Field>
                    <label>Password</label>
                    <input placeholder='Enter your password' type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} />
                    </Form.Field>
                    <Button className="auth-form-submit" secondary type='submit' disabled={this.state.isLoggingIn} loading={this.state.isLoggingIn}>Login</Button>
                    <Link style={{ display: 'block', marginTop: 15 }} to="/register">New user? Join us.</Link>
                </Form>
            </div>
        </Container>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        startLoginUser: (credentials) => dispatch(startLoginUser(credentials))
    }
}

export default connect(undefined, mapDispatchToProps)(Login);