import React from 'react';
import { Container, Button, Image, Icon, Modal, Header } from 'semantic-ui-react';
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
        showLoginModal: false
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
                    console.log(error)
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
                                console.log(error)
                                this.setState({ isLoading: false });
                            });
                    } else {
                        console.log('No user');
                        this.setState({ isLoading: false });
                        this.props.history.push('/404');
                    }
                })
                .catch((error) => {
                    console.log('No user');
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
            if(prevProps.match.params.id != id) {
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
                        console.log(error)
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
                                    console.log(error)
                                });
                        } else {
                            console.log('No user');
                            this.setState({ isLoading: false });
                            this.props.history.push('/404');
                        }
                    })
                    .catch((error) => {
                        console.log('No user');
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
                <Button icon basic onClick={() => this.setState({showLoginModal: true})}>
                    <Icon name='plus' />
                    Follow
                </Button>
            )
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
                            <h1 className="profile-user-name text">{this.state.user.username}</h1>
                            {this.state.isAuthenticatedUser && <Link to="/profile/settings" className="profile-edit-btn"><Button basic icon><Icon name='settings'/> Edit Profile</Button></Link>}
                            <span className="profile-edit-btn">{this.state.user && this.renderFollowButton(this.state.user)}</span>
                        </div>

                        <div className="profile-stats">
                            <div className="profile-stats-list">
                                <li><span className="profile-stat-count">{this.state.user.photos.length}</span> posts</li>
                                <li><span className="profile-stat-count">{this.state.user.followers.length}</span> followers</li>
                                <li><span className="profile-stat-count">{this.state.user.following.length}</span> following</li>
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
    render = () => {
        if (!this.state.isLoading) {
            return (
                <div>
                    {this.state.user && this.renderProfile()}
                    <Container>
                        {this.state.user && !!this.state.photos && this.renderGallery()}
                        <Modal
                            open={this.state.showLoginModal}
                            onClose={() => this.setState({showLoginModal: false})}
                            basic
                            size='small'
                            centered
                        >
                            <Header icon='browser' content='Hello there' />
                            <Modal.Content>
                                <h3>This action requires you to be logged in.</h3>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='red' onClick={() => this.setState({showLoginModal: false})} inverted>
                                    <Icon name='remove' /> Cancel
                                 </Button>
                                 <Link to="/login">
                                    <Button color='green' inverted>
                                        <Icon name='checkmark' /> Login
                                    </Button>                   
                                </Link>
                            </Modal.Actions>
                        </Modal>
                    </Container>
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