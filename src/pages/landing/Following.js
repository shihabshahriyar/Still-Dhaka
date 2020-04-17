import React from 'react';
import { Container } from 'semantic-ui-react';
import Masonry from 'react-masonry-css';
import Photo from '../../components/photo/Photo';
import { db } from '../../config/firebaseConfig';
import { connect } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import {
    isMobile
} from "react-device-detect";

class Following extends React.Component {
    state = {
        photos: [],
        limit: 6,
        lastVisible: null,
        isScrollExecuted: false,
        maxReached: false,
        isLoading: false
    }
    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight + 0.5;
    }
    retrieveData = () => {
        return new Promise((resolve, reject) => {
            db.collection('photos')
                .where('createdBy', 'in', [...this.props.auth.user.following])
                .orderBy('id')
                .limit(this.state.limit)
                .get()
                .then((documentSnapshot) => {
                    resolve(documentSnapshot);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    retrieveMore = () => {
        return new Promise((resolve, reject) => {
            db.collection('photos')
                .where('createdBy', 'in', [...this.props.auth.user.following])
                .orderBy('id')
                .startAfter(this.state.lastVisible)
                .limit(this.state.limit)
                .get()
                .then((documentSnapshot) => {
                    resolve(documentSnapshot);
                })
                .catch((error) => {
                    reject(error);
                });
        })
    };
    componentDidMount = () => {
        let imageContainer = document.getElementById('imageContainer');
        this.setState({ isLoading: true });
        document.onscroll = () => {
            // Inside the "if" statement the "isExecuted" variable is negated to allow initial code execution.
            if (!this.state.maxReached) {
                if (this.isBottom(imageContainer) && !this.state.isScrollExecuted) {
                    this.setState({ isScrollExecuted: true });
                    console.log('its working');
                    if(this.state.photos.length > 0) {
                    this.retrieveMore()
                        .then((documentSnapshot) => {
                            if (documentSnapshot.docs.length > 0) {
                                let photos = documentSnapshot.docs.map(document => document.data());
                                let lastVisible = photos[photos.length - 1].id;
                                this.setState({
                                    photos: [...this.state.photos, ...photos],
                                    lastVisible: lastVisible
                                });
                            } else {
                                this.setState({
                                    maxReached: true
                                });
                            }
                        });
                    }
                    setTimeout(() => {
                        this.setState({ isScrollExecuted: false });
                    }, 1000);
                }
            }
        }
        if (this.props.auth.user.following.length > 0) {
            this.retrieveData()
                .then((documentSnapshot) => {
                    if (documentSnapshot.docs.length > 0) {
                        let photos = documentSnapshot.docs.map(document => document.data());
                        let lastVisible = photos[photos.length - 1].id;
                        this.setState({ photos, lastVisible, isLoading: false });
                    } else {
                        this.setState({
                            maxReached: true,
                            isLoading: false
                        });
                    }
                });
        } else {
            this.setState({
                maxReached: true,
                isLoading: false
            });
        }
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps != this.props) {
            if(this.props.auth.user.following.length > 0) {
                db.collection('photos')
                .where('createdBy', 'in', [...this.props.auth.user.following])
                .orderBy('id')
                .endAt(this.state.lastVisible)
                .get()
                .then((documentSnapshots) => {
                    let photos = documentSnapshots.docs.map(document => document.data());
                    let lastVisible = photos[photos.length - 1].id;
                    this.setState({
                        photos: photos,
                        lastVisible: lastVisible
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
    }
    render = () => {
        if (this.state.isLoading) {
            return (
                <div style={{ position: 'relative' }}>
                    <br />
                    <div className="refresh-loader">
                        <BeatLoader color="#4DAF7C" />
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <section>
                        <Container>
                            <Masonry
                                id="imageContainer"
                                breakpointCols={isMobile == true ? 1 : 3}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column">
                                {this.state.photos &&
                                    this.state.photos.map((photo, index) => {
                                        return (
                                            <Photo photo={photo} key={index} />
                                        )
                                    })
                                }
                            </Masonry>
                            {this.state.isScrollExecuted && !this.state.maxReached && <div className="scroll-loader"><BeatLoader color="#4DAF7C" /></div>}
                            {this.state.maxReached && <h1 style={{ textAlign: 'center', marginBottom: 40 }}>No more images to load.</h1>}
                        </Container>
                    </section>
                </div>
            )
        }
    }
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Following);