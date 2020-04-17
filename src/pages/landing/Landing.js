import React from 'react';
import { Input, Icon, Container, Menu } from 'semantic-ui-react';
import { Router, Switch, Route, Link } from 'react-router-dom';
import { history } from '../../App';
import { connect } from 'react-redux';
import Explore from './Explore';
import Following from './Following';
import ProtectedRoute from '../../components/protected-route/ProtectedRoute';

class Landing extends React.Component {
    state = {
        searchTerm: ''
    }
    onSearch = () => {
        this.props.history.push(`/photos/${this.state.searchTerm}`)
    }
    render = () => (
        <div>
            <section className="hero-banner">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-text-header">Wherever you are, its Still Dhaka.</h1>
                    </div>
                    <div className="hero-input">
                        <Input icon value={this.setState.searchTerm} onChange={(e) => this.setState({ searchTerm: e.target.value })} placeholder='Search for the best talent and photos in Dhaka.' fluid style={{ borderRadius: '0 !important' }}>
                            <input />
                            <Icon name='search' link circular onClick={this.onSearch} />
                        </Input>
                    </div>
                </div>
            </section>
            <br />
            <Container>
                <section style={{ margin: 'auto' }}>
                    <Menu secondary>
                        <Link to="/">
                            <Menu.Item
                                name='Explore'
                                active={this.props.location.pathname == '/'}
                            />
                        </Link>
                        {this.props.auth.id && <Link to="/following">
                            <Menu.Item
                                name='Following'
                                active={this.props.location.pathname == '/following'}
                            />
                        </Link>}
                    </Menu>
                </section>
            </Container>
            <Router history={history}>
                <Switch>
                    <Route path={`/`} exact component={Explore} />
                    <ProtectedRoute path={`/following`} component={Following} />
                </Switch>
            </Router>
        </div>
    )
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Landing);