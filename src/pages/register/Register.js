import React from 'react';
import { Container, Form, Button, Input } from 'semantic-ui-react';
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
        confirmPassword: ''
    }
    onRegisterSubmit = () => {
        this.props.startRegisterUser(this.state);
    }
    render = () => (
        <Container>
            <div className="auth-form">
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
                    <Button className="auth-form-submit" color="green" type='submit'>Register</Button>
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