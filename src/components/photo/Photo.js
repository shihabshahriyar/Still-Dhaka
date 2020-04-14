import React from 'react';
import { Container, Button, Image, Icon, Modal, Header, Grid, Label } from 'semantic-ui-react';
import { db } from '../../config/firebaseConfig';
import FollowButton from '../buttons/FollowButton';
import LikeButton from '../buttons/LikeButton';
import DownloadButton from '../buttons/DownloadButton';


class Photo extends React.Component {
    state = {
        isPhotoViewed: false,
        user: null
    }
    componentDidMount = () => {
        const { photo } = this.props;
        db.collection('users').doc(photo.createdBy).get()
        .then((doc) => {
            if(doc.exists) {
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
            if(doc.exists) {
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
                            <Image src={this.state.user && this.state.user.photoUrl} avatar />
                            {this.state.user && <span style={{marginRight: 5}}>{this.state.user.firstName} {this.state.user.lastName}</span> }
                            <FollowButton user={this.state.user} />
                            </Grid.Column>  
                            <Grid.Column floated='right' style={{textAlign: 'right'}}>
                                <LikeButton photo={this.props.photo} />
                                <DownloadButton photo={this.props.photo}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Header>
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
            </Modal>
        </div>
    )
}

export default Photo;