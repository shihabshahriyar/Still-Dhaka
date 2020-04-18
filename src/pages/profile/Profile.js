import React from 'react';
import { Container, Button, Image, Icon, Modal, Header, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { db } from '../../config/firebaseConfig';
import Masonry from 'react-masonry-css';
import Photo from '../../components/photo/Photo';
import FollowButton from '../../components/buttons/FollowButton';
import { BarLoader } from 'react-spinners';
import {
    isMobile
} from "react-device-detect";

class Profile extends React.Component {
    state = {
        user: null,
        isAuthenticatedUser: false,
        id: '',
        photos: [],
        isLoading: false,
        showLoginModal: false,
        followers: [],
        following: [],
        openFollowersModal: false,
        openFollowingModal: false
    }
    componentDidMount = () => {
        this.setState({ isLoading: true });
        const id = this.props.match.params.id;
        if (id == this.props.auth.id) {
            let user = this.props.auth.user;
            let photosToFetch = user.photos;
            let photoPromises = photosToFetch.map((id) => {
                return db.collection('photos').doc(id).get();
            });
            Promise.all(photoPromises)
                .then((docs) => {
                    let photos = docs.map((photo) => photo.data());
                    this.setState({ user, isAuthenticatedUser: true, id, photos, isLoading: false });
                })
                .catch((error) => {
                    this.setState({ isLoading: false });
                });
        } else {
            db.collection('users').doc(id).get()
                .then((doc) => {
                    if (doc.exists) {
                        let user = doc.data();
                        let photosToFetch = user.photos;
                        let photoPromises = photosToFetch.map((id) => {
                            return db.collection('photos').doc(id).get();
                        });
                        Promise.all(photoPromises)
                            .then((docs) => {
                                let photos = docs.map((photo) => photo.data());
                                this.setState({ user, isAuthenticatedUser: false, id, photos, isLoading: false });
                            })
                            .catch((error) => {
                                this.setState({ isLoading: false });
                            });
                    } else {
                        this.setState({ isLoading: false });
                        this.props.history.push('/404');
                    }
                })
                .catch((error) => {
                    this.setState({ isLoading: false });
                    this.props.history.push('/404');
                });
        }
    }
    componentDidUpdate = (prevProps, prevState) => {
        //Check if update stems from route parameter change or button click
        // If it stems from route parameter change, only then change isloading to true
        // Else, dont
        if (prevProps != this.props) {
            const id = this.props.match.params.id;
            if (prevProps.match.params.id != id) {
                this.setState({ isLoading: true });
            }
            if (id == this.props.auth.id) {
                let user = this.props.auth.user;
                let photosToFetch = user.photos;
                let photoPromises = photosToFetch.map((id) => {
                    return db.collection('photos').doc(id).get();
                });
                Promise.all(photoPromises)
                    .then((docs) => {
                        let photos = docs.map((photo) => photo.data());
                        this.setState({ user, isAuthenticatedUser: true, id, photos, isLoading: false });
                    })
                    .catch((error) => {
                        this.setState({ isLoading: false });
                    });
            } else {
                db.collection('users').doc(id).get()
                    .then((doc) => {
                        if (doc.exists) {
                            let user = doc.data();
                            let photosToFetch = user.photos;
                            let photoPromises = photosToFetch.map((id) => {
                                return db.collection('photos').doc(id).get();
                            });
                            Promise.all(photoPromises)
                                .then((docs) => {
                                    let photos = docs.map((photo) => photo.data());
                                    this.setState({ user, isAuthenticatedUser: false, id, photos, isLoading: false });
                                })
                                .catch((error) => {
                                });
                        } else {
                            this.setState({ isLoading: false });
                            this.props.history.push('/404');
                        }
                    })
                    .catch((error) => {
                        this.setState({ isLoading: false });
                        this.props.history.push('/404');
                    });
            }
        }
    }
    renderFollowButton = (user) => {
        if (this.props.auth.id) {
            if (user.id != this.props.auth.id) {
                return (
                    <FollowButton user={user} />
                )
            }
        } else {
            return (
                <Button icon basic onClick={() => this.setState({ showLoginModal: true })}>
                    <Icon name='plus' />
                    Follow
                </Button>
            )
        }
    }
    onFollowersOpen = () => {
        if (this.state.user.followers.length > 0) {
            db.collection('users')
                .where('following', 'array-contains', this.state.user.id)
                .orderBy('id')
                .get()
                .then((snapshot) => {
                    let followers = snapshot.docs.map((doc) => doc.data());
                    this.setState({
                        openFollowersModal: true,
                        followers
                    })
                })
        } else {
            this.setState({
                openFollowersModal: true
            });
        }
    }
    onFollowingOpen = () => {
        if (this.state.user.following.length > 0) {
            db.collection('users')
                .where('followers', 'array-contains', this.state.user.id)
                .orderBy('id')
                .get()
                .then((snapshot) => {
                    let following = snapshot.docs.map((doc) => doc.data());
                    this.setState({
                        openFollowingModal: true,
                        following
                    })
                })
        } else {
            this.setState({
                openFollowersModal: true
            });
        }
    }
    renderProfile = () => {
        return (
            <section>
                <Container>
                    <div className="profile">
                        <div className="profile-image">
                            <Image src={this.state.user.photoUrl} alt="" size="small" />
                        </div>

                        <div className="profile-user-settings">
                            <h1 className="profile-user-name text">{this.state.user.username} {this.state.user.isVerified == true && <Icon name="check" size="small"></Icon>}</h1>
                            {this.state.isAuthenticatedUser && <Link to="/profile/settings" className="profile-edit-btn"><Button basic icon><Icon name='settings' /> Edit Profile</Button></Link>}
                            <span className="profile-edit-btn">{this.state.user && this.renderFollowButton(this.state.user)}</span>
                        </div>

                        <div className="profile-stats">
                            <div className="profile-stats-list">
                                <li><span className="profile-stat-count">{this.state.user.photos.length}</span> posts</li>
                                <li onClick={this.onFollowersOpen}><span className="profile-stat-count">{this.state.user.followers.length}</span> followers</li>
                                <li onClick={this.onFollowingOpen}><span className="profile-stat-count">{this.state.user.following.length}</span> following</li>
                        </div>
                        </div>

                        <div className="profile-bio">
                            <span className="profile-real-name">{`${this.state.user.firstName} ${this.state.user.lastName}`}</span>
                            <span className="profile-bio-text">{`${this.state.user.bio}`}</span>
                        </div>
                    </div>
                </Container>
            </section>
        )
    }
    renderGallery = () => {
        if (this.state.user.photos.length > 0) {
            return (
                <Masonry
                    breakpointCols={isMobile == true ? 1 : 3}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column">
                    {
                        this.state.photos.map((photo, index) => {
                            return (
                                <Photo photo={photo} key={index} />
                            )
                        })
                    }
                </Masonry>
            )
        } else {
            if (this.state.isAuthenticatedUser) {
                return (
                    <div style={{ textAlign: 'center' }}>
                        <h1>You have no photos to show.</h1>
                        <Link to='/upload'><Button basic>Upload</Button></Link>
                    </div>
                )
            } else {
                return (
                    <h1 style={{ textAlign: 'center' }}>This user has no photos to show.</h1>
                )
            }
        }
    }
    onFollowingClose = () => {
        this.setState({
            openFollowingModal: false,
            following: []
        })
    }
    onFollowersClose = () => {
        this.setState({
            openFollowersModal: false,
            followers: []
        })
    }
    render = () => {
        if (!this.state.isLoading) {
            return (
                <div>
                    {this.state.user && this.renderProfile()}
                    <Container>
                        {this.state.user && !!this.state.photos && this.renderGallery()}
                        <Modal
                            open={this.state.showLoginModal}
                            onClose={() => this.setState({ showLoginModal: false })}
                            size='tiny'
                            centered
                        >
                            <Header icon='browser' content='Hello there' />
                            <Modal.Content>
                                <h3>This action requires you to be logged in.</h3>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button basic onClick={() => this.setState({ showLoginModal: false })}>
                                    <Icon name='remove' /> Cancel
                                 </Button>
                                <Link to="/login">
                                    <Button secondary>
                                        <Icon name='checkmark' /> Login
                                    </Button>
                                </Link>
                            </Modal.Actions>
                        </Modal>
                    </Container>
                    <Modal size='tiny' open={this.state.openFollowingModal} onClose={this.onFollowingClose}>
                        <Modal.Header>Following</Modal.Header>
                        <Modal.Content>
                            <Item.Group>
                            {
                                this.state.following && this.state.following.map((user) => {
                                    return (
                                        <Item key={user.id} onClick={() => { this.onFollowingClose(); this.props.history.push(`/users/${user.id}`); }} style={{cursor: 'pointer'}}>
                                        <Item.Image size='tiny' src={user.photoUrl} />
                                        <Item.Content verticalAlign='middle'>
                                            <Item.Header>
                                                {user.username}
                                            </Item.Header>
                                        </Item.Content>
                                        </Item>
                                    )
                                })
                            }
                            {this.state.following.length <= 0 && <h1>No following</h1>}
                            </Item.Group>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={this.onFollowingClose} basic>Close</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' open={this.state.openFollowersModal} onClose={this.onFollowersClose}>
                        <Modal.Header>Followers</Modal.Header>
                        <Modal.Content>
                            <Item.Group>
                            {
                                this.state.followers && this.state.followers.map((user) => {
                                    return (
                                        <Item key={user.id} onClick={() => { this.onFollowersClose(); this.props.history.push(`/users/${user.id}`); }} style={{cursor: 'pointer'}}>
                                        <Item.Image size='tiny' src={user.photoUrl} />
                                        <Item.Content verticalAlign='middle'>
                                            <Item.Header>
                                                {user.username}
                                            </Item.Header>
                                        </Item.Content>
                                        </Item>
                                    )
                                })
                            }
                            {this.state.followers.length <= 0 && <h1>No followers</h1>}
                            </Item.Group>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button onClick={this.onFollowersClose} basic>Close</Button>
                        </Modal.Actions>
                    </Modal>
                </div>
            )
        } else {
            return (
                <div className="refresh-loader">
                    <BarLoader color="#4DAF7C" />
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(Profile);