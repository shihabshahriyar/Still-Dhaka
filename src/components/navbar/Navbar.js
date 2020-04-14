import React from 'react';
import { Menu, Dropdown, Button, Container } from 'semantic-ui-react';
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
        <div>
            <Dropdown.Item><Link to={`/upload`}>Upload</Link></Dropdown.Item>
            <Dropdown.Item><Link to={`/users/${this.props.auth.id}`}>Profile</Link></Dropdown.Item>
            <Dropdown.Item onClick={this.onLogout}><Link>Logout</Link></Dropdown.Item>
        </div>
    )
    render = () => (
        <Menu size='large' pointing secondary>
            <Menu.Item><Link to="/">Still Dhaka</Link></Menu.Item>

            <Menu.Menu position='right'>
                <Menu.Item
                    name='Explore'
                />
                <Menu.Item
                    name='License'
                />
                <Dropdown item text='More'>
                    <Dropdown.Menu>
                        <Dropdown.Item>Filler</Dropdown.Item>
                        { !!this.props.auth.id && this.renderAuthenticatedDropdowns() }
                    </Dropdown.Menu>
                </Dropdown>
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