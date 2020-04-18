import React from 'react';
import { Container, Button, Image, Icon, Modal, Header, Grid, Label, ModalContent } from 'semantic-ui-react';
import { db } from '../../config/firebaseConfig';
import FollowButton from '../buttons/FollowButton';
import LikeButton from '../buttons/LikeButton';
import DownloadButton from '../buttons/DownloadButton';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { history } from '../../App';
import { MobileView, BrowserView } from 'react-device-detect';


class Photo extends React.Component {
    state = {
        isPhotoViewed: false,
        user: null,
        showLoginModal: false
    }
    renderEditButton = () => {
        if (this.props.photo.createdBy == this.props.auth.id) {
            return (
                <Modal.Actions>
                    <Button basic onClick={() => this.setState({ isPhotoViewed: false })}>Close</Button>
                    <Button secondary onClick={() => history.push({
                        pathname: '/photos/edit',
                        state: {
                            photo: this.props.photo
                        }
                    })}>
                        Edit photo <Icon name='right chevron' />
                    </Button>
                </Modal.Actions>
            )
        } else {
            return (
                <Modal.Actions>
                    <Button basic onClick={() => this.setState({ isPhotoViewed: false })}>Close</Button>
                </Modal.Actions>
            )
        }
    }
    componentDidMount = () => {
        const { photo } = this.props;
        db.collection('users').doc(photo.createdBy).get()
            .then((doc) => {
                if (doc.exists) {
                    let user = doc.data();
                    this.setState({
                        user
                    });
                }
            })
    }
    componentDidUpdate = () => {
        const { photo } = this.props;
        db.collection('users').doc(photo.createdBy).get()
            .then((doc) => {
                if (doc.exists) {
                    let user = doc.data();
                    this.setState({
                        user
                    });
                }
            })
    }
    onImageClick = (e) => {
        this.setState({
            isPhotoViewed: true,
        });
    }
    onPhotoViewClose = () => {
        this.setState({
            isPhotoViewed: false
        });
    }
    handlePhotoViewClose = () => {
        this.setState({
            isPhotoViewed: false,
        });
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
    renderLikeButton = () => {
        if (this.props.auth.id) {
            return (
                <LikeButton photo={this.props.photo} />
            )
        } else {
            return (
                <Button as='div' basic labelPosition='right' onClick={() => this.setState({ showLoginModal: true })}>
                    <Button basic>
                        <Icon name='heart' />
                        Like
                    </Button>
                    <Label as='a' basic pointing='left'>
                        {this.props.photo.likes.length}
                    </Label>
                </Button>
            )
        }
    }
    render = () => (
        <div>
            <div className="photo-container" data-identifier={this.props.photo.id} onClick={this.onImageClick}>
                <Image src={this.props.photo.url} style={{ margin: '30px auto' }} fluid className="photo" />
                <div className="photo-content">
                    <Button>View photo</Button>
                </div>
            </div>
            <Modal open={this.state.isPhotoViewed} onClose={this.onPhotoViewClose}>
                <Modal.Header>
                    <BrowserView>
                        <Grid>
                            <Grid.Row columns={2}>
                                <Grid.Column floated='left'>
                                    {this.state.user && <Link to={`/users/${this.state.user.id}`}><Image src={this.state.user.photoUrl} avatar />
                                        <span style={{ marginRight: 5 }}>{this.state.user.username}</span></Link>}
                                    {this.state.user && this.renderFollowButton(this.state.user)}
                                </Grid.Column>
                                <Grid.Column floated='right' style={{ textAlign: 'right' }}>
                                    {this.renderLikeButton(this.props.photo)}
                                    {/* <DownloadButton photo={this.props.photo} /> */}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </BrowserView>
                    <MobileView>
                        {this.state.user && <Link to={`/users/${this.state.user.id}`}><Image src={this.state.user.photoUrl} avatar />
                            <span style={{ marginRight: 5 }}>{this.state.user.firstName} {this.state.user.lastName}</span></Link>}
                        <div style={{ margin: 'auto', textAlign: 'center' }}>
                            <div>
                                {this.state.user && this.renderFollowButton(this.state.user)}
                            </div>
                            <br />
                            <div>
                                {this.renderLikeButton(this.props.photo)}
                            </div>
                        </div>
                    </MobileView>
                </Modal.Header>
                <ModalContent>
                    <section className="view-image-modal">
                        {/* <Container> */}
                        <Image src={this.props.photo && this.props.photo.url} fluid />
                        <div className="view-image-modal-content">
                            <Header>{this.props.photo && this.props.photo.title}</Header>
                            <p>
                                {this.props.photo && this.props.photo.description}
                            </p>
                        </div>
                        {/* </Container> */}
                    </section>
                </ModalContent>
                {this.renderEditButton()}
            </Modal>
            <Modal
                open={this.state.showLoginModal}
                onClose={() => this.setState({ showLoginModal: false })}
                size='mini'
                centered
            >
                <Header icon='browser' content="We're sorry" />
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
        </div>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps)(Photo);