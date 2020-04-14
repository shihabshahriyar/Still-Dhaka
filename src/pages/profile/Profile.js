import React from 'react';
import { Container, Button, Image, Icon, Modal, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { db } from '../../config/firebaseConfig';
import Masonry from 'react-masonry-css';
import Photo from '../../components/photo/Photo';
import FollowButton from '../../components/buttons/FollowButton';


class Profile extends React.Component {
    state = {
        user: null,
        isAuthenticatedUser: false,
        id: '',
        photos: []
    }
    componentDidMount = () => {
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
                    this.setState({ user, isAuthenticatedUser: true, id, photos });
                })
                .catch((error) => {
                    console.log(error)
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
                                this.setState({ user, isAuthenticatedUser: false, id, photos });
                            })
                            .catch((error) => {
                                console.log(error)
                            });
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
    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (nextProps.match.params.id !== prevState.id) {
    //         const id = nextProps.match.params.id;
    //         if (id == nextProps.auth.id) {
    //             console.log('This is your profile');
    //             return { user: nextProps.auth.user, isAuthenticatedUser: true, id };
    //         } else {
    //             db.collection('users').doc(id).get()
    //                 .then((doc) => {
    //                     if (doc.exists) {
    //                         let user = doc.data();
    //                         return { user, isAuthenticatedUser: false, id };
    //                     } else {
    //                         console.log('No user');
    //                         nextProps.history.push('/404');
    //                         return null;
    //                     }
    //                 })
    //                 .catch((error) => {
    //                     nextProps.history.push('/404');
    //                     return null;
    //                 });
    //         }
    //     }
    //     return null;
    // }
    componentDidUpdate = (prevProps, prevState) => {
        const id = this.props.match.params.id;
        if (prevProps.match.params.id !== id) {
            if (id == this.props.auth.id) {
                console.log(id);
                let user = this.props.auth.user;
                let photosToFetch = user.photos;
                let photoPromises = photosToFetch.map((id) => {
                    return db.collection('photos').doc(id).get();
                });
                Promise.all(photoPromises)
                    .then((docs) => {
                        let photos = docs.map((photo) => photo.data());
                        this.setState({ photos, user, isAuthenticatedUser: true, id });
                    })
                    .catch((error) => {
                        console.log(error)
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
                                this.setState({ photos, user, isAuthenticatedUser: false, id });
                            })
                            .catch((error) => {
                                console.log(error)
                            });
                        } else {
                            console.log('No user');
                            prevProps.history.push('/404');
                        }
                    })
                    .catch((error) => {
                        prevProps.history.push('/404');
                    });
            }
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
                            {this.state.isAuthenticatedUser && <Link to="/profile/settings" className="profile-edit-btn"><Button icon><Icon name='settings' /> Edit Profile</Button></Link>}
                            <FollowButton user={this.state.user}/>
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
                    breakpointCols={3}
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
                {this.state.user && !!this.state.photos && this.renderGallery()}
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