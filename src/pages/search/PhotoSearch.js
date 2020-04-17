import React from 'react';
import { db } from '../../config/firebaseConfig';
import Masonry from 'react-masonry-css';
import Photo from '../../components/photo/Photo';
import {
    isMobile
} from "react-device-detect";
import { Container, Input, Icon } from 'semantic-ui-react';
import { BarLoader, BeatLoader } from 'react-spinners';
import { connect } from 'react-redux';

class PhotoSearch extends React.Component {
    state = {
        photos: [],
        searchTerm: '',
        originalSearchTerm: '',
        isLoading: '',
        limit: 3,
        lastVisible: null,
        isScrollExecuted: false,
        maxReached: false
    }
    onSearch = () => {
        this.props.history.push(`/photos/${this.state.searchTerm}`)
    }
    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight + 0.5;
    }
    retrieveData = (queryText) => {
        return new Promise((resolve, reject) => {
            db.collection('photos')
                .where('keywords', 'array-contains', queryText.toLowerCase())
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
    retrieveMore = (queryText) => {
        return new Promise((resolve, reject) => {
            db.collection('photos')
                .where('keywords', 'array-contains', queryText.toLowerCase())
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
                    this.retrieveMore(this.state.originalSearchTerm)
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

                    setTimeout(() => {
                        this.setState({ isScrollExecuted: false });
                    }, 1000);
                }
            }
        }
        this.retrieveData(this.props.match.params.searchTerm)
            .then((documentSnapshot) => {
                if (documentSnapshot.docs.length > 0) {
                    let photos = documentSnapshot.docs.map(document => document.data());
                    let lastVisible = photos[photos.length - 1].id;
                    this.setState({ photos, lastVisible, searchTerm: this.props.match.params.searchTerm, isLoading: false, originalSearchTerm: this.props.match.params.searchTerm });
                } else {
                    this.setState({
                        maxReached: true,
                        isLoading: false,
                        searchTerm: this.props.match.params.searchTerm,
                        originalSearchTerm: this.props.match.params.searchTerm
                    });
                }
            });
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps != this.props) {
            if (prevProps.match.params.searchTerm == this.props.match.params.searchTerm) {
                console.log('not updating cause');
                db.collection('photos')
                    .where('keywords', 'array-contains', this.props.match.params.searchTerm)
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
            } else {
                this.retrieveData(this.props.match.params.searchTerm)
                    .then((documentSnapshot) => {
                        if (documentSnapshot.docs.length > 0) {
                            let photos = documentSnapshot.docs.map(document => document.data());
                            let lastVisible = photos[photos.length - 1].id;
                            this.setState({ photos, lastVisible, searchTerm: this.props.match.params.searchTerm, isLoading: false, originalSearchTerm: this.props.match.params.searchTerm, maxReached: false });
                        } else {
                            this.setState({
                                maxReached: true,
                                isLoading: false,
                                searchTerm: this.props.match.params.searchTerm,
                                originalSearchTerm: this.props.match.params.searchTerm
                            });
                        }
                    });
            }
        }
    }
    renderPhotos = () => {
        if (this.state.photos.length > 0) {
            return (
                <div>
                    <h1>Found {this.state.photos.length} results for '{this.state.originalSearchTerm && this.state.originalSearchTerm}'</h1>
                    <Masonry
                        id="imageContainer"
                        breakpointCols={isMobile == true ? 1 : 3}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column">
                        {this.state.photos.map((photo, index) => {
                            return (
                                <Photo photo={photo} key={index} />
                            )
                        })
                        }
                    </Masonry>
                </div>
            )
        } else {
            return (
                <div>
                    <h1>No matches have been found for '{this.state.originalSearchTerm && this.state.originalSearchTerm}'</h1>
                </div>
            )
        }
    }
    render = () => {
        if (!this.state.isLoading) {
            return (
                <Container>
                    <br />
                    <Input icon value={this.state.searchTerm} onChange={(e) => this.setState({ searchTerm: e.target.value })} placeholder='Search for the best talent and photos in Dhaka.' fluid style={{ borderRadius: '0 !important' }}>
                        <input />
                        <Icon name='search' link circular onClick={this.onSearch} />
                    </Input>
                    <br />
                    <div id="imageContainer">
                        {this.state.photos && this.renderPhotos()}
                    </div>
                    {this.state.isScrollExecuted && !this.state.maxReached && <div className="scroll-loader"><BeatLoader color="#4DAF7C" /></div>}
                    {this.state.maxReached && <h1 style={{ textAlign: 'center', marginBottom: 40 }}>No more images to load</h1>}
                </Container>
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

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PhotoSearch);