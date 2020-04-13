import React from 'react';
import { Container, Button, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { db } from '../../config/firebaseConfig';

class Profile extends React.Component {
    state = {
        user: null,
        isAuthenticatedUser: false,
        id: ''
    }
    componentDidMount = () => {
        const id = this.props.match.params.id;
        //Check if id matches user id in store
        //If it does, set user object to auth user
        //If not, search user in database
        if (id == this.props.auth.id) {
            console.log('This is your profile');
            this.setState({ user: this.props.auth.user, isAuthenticatedUser: true, id });
        } else {
            db.collection('users').doc(id).get()
                .then((doc) => {
                    if (doc.exists) {
                        let user = doc.data();
                        this.setState({ user, isAuthenticatedUser: false, id });
                    } else {
                        console.log('No user');
                        this.props.history.push('/404');
                    }
                })
                .catch((error) => {
                    console.log('No user');
                    this.props.history.push('/404');
                });
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.id !== prevState.id) {
            const id = nextProps.match.params.id;
            if (id == nextProps.auth.id) {
                console.log('This is your profile');
                return { user: nextProps.auth.user, isAuthenticatedUser: true, id };
            } else {
                db.collection('users').doc(id).get()
                    .then((doc) => {
                        if (doc.exists) {
                            let user = doc.data();
                            return{ user, isAuthenticatedUser: false, id };
                        } else {
                            console.log('No user');
                            nextProps.history.push('/404');
                            return null;
                        }
                    })
                    .catch((error) => {
                        nextProps.history.push('/404');
                        return null;
                    });
            }
        }
        return null;
    }
    renderProfile = () => {
        return (
            <section>
                <Container>
                    <div class="profile">
                        <div class="profile-image">
                            <Image src={this.state.user.photoUrl} alt="" size="small" />
                        </div>

                        <div class="profile-user-settings">
                            <h1 class="profile-user-name text">{this.state.user.username}</h1>
                            {this.state.isAuthenticatedUser && <Link to="/profile/settings" class="profile-edit-btn"><Button icon><Icon name='settings' /> Edit Profile</Button></Link>}
                            {!this.state.isAuthenticatedUser && <span class="profile-edit-btn"><Button icon color="blue"><Icon name='plus' /> Follow</Button></span>}
                        </div>

                        <div class="profile-stats">
                            <div className="profile-stats-list">
                                <li><span class="profile-stat-count">{this.state.user.photos.length}</span> posts</li>
                                <li><span class="profile-stat-count">{this.state.user.followers.length}</span> followers</li>
                                <li><span class="profile-stat-count">{this.state.user.following.length}</span> following</li>
                            </div>
                        </div>

                        <div class="profile-bio">
                            <span class="profile-real-name">{`${this.state.user.firstName} ${this.state.user.lastName}`}</span>
                            <span class="profile-bio-text">{`${this.state.user.bio}`}</span>
                        </div>
                    </div>
                </Container>
            </section>
        )
    }
    renderGallery = () => {
        if (this.state.user.photos.length > 0) {
            return (
                <h1 style={{ textAlign: 'center' }}>photos</h1>
            )
        } else {
            if (this.state.isAuthenticatedUser) {
                return (
                    <div style={{ textAlign: 'center' }}>
                        <h1>You have no photos to show.</h1>
                        <Link to='/upload'><Button color="green">Upload</Button></Link>
                    </div>
                )
            } else {
                return (
                    <h1 style={{ textAlign: 'center' }}>This user has no photos to show.</h1>
                )
            }
        }
    }
    render = () => (
        <div>
            {this.state.user && this.renderProfile()}
            <Container>
                {this.state.user && this.renderGallery()}
            </Container>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(Profile);