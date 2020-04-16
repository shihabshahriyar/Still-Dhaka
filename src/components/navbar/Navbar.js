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
                    <Dropdown.Item><Link to={`/upload`}>Upload</Link></Dropdown.Item>
                    <Dropdown.Item><Link to={`/users/${this.props.auth.id}`}>Profile</Link></Dropdown.Item>
                    <Dropdown.Item onClick={this.onLogout}><Link>Logout</Link></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
    )
    renderUnauthenticatedDropdowns = () => (
            <Dropdown item text="Join">
                <Dropdown.Menu>
                    <Dropdown.Item><Link to={`/login`}>Login</Link></Dropdown.Item>
                    <Dropdown.Item><Link to={'/register'}>Register</Link></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
    )
    render = () => (
        <Menu size='large' pointing secondary className="navbar">
            <Menu.Item><Link to="/">Still Dhaka</Link></Menu.Item>

            <Menu.Menu position='right'>
                <Menu.Item
                    name='Explore'
                />
                {!this.props.auth.id && this.renderUnauthenticatedDropdowns()}
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