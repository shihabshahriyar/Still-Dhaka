import React from 'react';
import { Menu, Dropdown, Button, Container, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startLogoutUser } from '../../store/actions/auth';
import { history } from '../../App'


class Navbar extends React.Component {
    onLogout = () => {
        this.props.startLogoutUser()
            .then(() => {
                history.push('/login');
            });
    }
    renderAuthenticatedDropdowns = () => (
            <Dropdown item text={<Image src={this.props.auth.user.photoUrl} style={{ marginRight: 0 }} avatar></Image>}>
                <Dropdown.Menu>
                <Link to={`/upload`}><Dropdown.Item>Upload</Dropdown.Item></Link>
                <Link to={`/users/${this.props.auth.id}`}><Dropdown.Item>Profile</Dropdown.Item></Link>
                <Dropdown.Item onClick={this.onLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
    )
    renderUnauthenticatedDropdowns = () => (
            <Dropdown item text="Join">
                <Dropdown.Menu>
                <Link to={`/login`}><Dropdown.Item>Login</Dropdown.Item></Link>
                <Link to={'/register'}><Dropdown.Item>Register</Dropdown.Item></Link>
                </Dropdown.Menu>
            </Dropdown>
    )
    render = () => (
        <Menu size='large' pointing secondary className="navbar">
            <Menu.Item><Link to="/">Still Dhaka</Link></Menu.Item>

            <Menu.Menu position='right'>
            <Menu.Item><Link to="/">Explore</Link></Menu.Item>
                {!this.props.auth.id  && this.renderUnauthenticatedDropdowns()}
                {!!this.props.auth.id && this.renderAuthenticatedDropdowns()}
            </Menu.Menu>
        </Menu>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        startLogoutUser: () => dispatch(startLogoutUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);