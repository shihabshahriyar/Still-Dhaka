import React from 'react';
import { Container, Button, Image, Icon, Modal, Header, Grid, Label, ModalContent } from 'semantic-ui-react';
import { db } from '../../config/firebaseConfig';
import FollowButton from '../buttons/FollowButton';
import LikeButton from '../buttons/LikeButton';
import DownloadButton from '../buttons/DownloadButton';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


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
                    <Link to={{
                        pathname: '/photos/edit',
                        state: {
                            photo: this.props.photo
                        }
                    }}>
                        <Button secondary>
                            Edit photo <Icon name='right chevron' />
                        </Button>
                    </Link>
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
                <div class="photo-content">
                    <Button>View photo</Button>
                </div>
            </div>
            <Modal open={this.state.isPhotoViewed} onClose={this.onPhotoViewClose}>
                <Modal.Header>
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column floated='left'>
                                {this.state.user && <Link to={`/users/${this.state.user.id}`}><Image src={this.state.user.photoUrl} avatar />
                                    <span style={{ marginRight: 5 }}>{this.state.user.firstName} {this.state.user.lastName}</span></Link>}
                                {this.state.user && this.renderFollowButton(this.state.user)}
                            </Grid.Column>
                            <Grid.Column floated='right' style={{ textAlign: 'right' }}>
                                {this.renderLikeButton(this.props.photo)}
                                <DownloadButton photo={this.props.photo} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Header>
                <ModalContent>
                    <section className="view-image-modal">
                        <Container>
                            <Image src={this.props.photo && this.props.photo.url} fluid />
                            <div className="view-image-modal-content">
                                <Header>{this.props.photo && this.props.photo.title}</Header>
                                <p>
                                    {this.props.photo && this.props.photo.description}
                                </p>
                            </div>
                        </Container>
                    </section>
                </ModalContent>
                {this.renderEditButton()}
            </Modal>
            <Modal
                open={this.state.showLoginModal}
                onClose={() => this.setState({ showLoginModal: false })}
                basic
                size='small'
                centered
            >
                <Header icon='browser' content='Hold on there buddy' />
                <Modal.Content>
                    <h3>This action requires you to be logged in.</h3>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' onClick={() => this.setState({ showLoginModal: false })} inverted>
                        <Icon name='remove' /> Cancel
                    </Button>
                    <Link to="/login">
                        <Button color='green' inverted>
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