import React from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { startLikePhoto, startUnlikePhoto } from '../../store/actions/auth';

class LikeButton extends React.Component {
    state = { isLoading: false }
    onLike = () => {
        let { photo } = this.props;
        this.setState({
            isLoading: true
        });
        this.props.startLikePhoto(photo.id)
            .then(() => {
                this.setState({
                    isLoading: false
                });
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                });
            });
    }
    onUnlike = () => {
        let { photo } = this.props;
        this.setState({
            isLoading: true
        });
        this.props.startUnlikePhoto(photo.id)
            .then(() => {
                console.log('unliking')
                this.setState({
                    isLoading: false
                });
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                });
            });
    }
    renderButton = () => {
        let { photo } = this.props;
        //TODO: Implement button render when the user is not logged in
        if (this.props.auth.id) {
            let isAlreadyLiked = this.props.auth.user.likes.includes(photo.id);
            if (isAlreadyLiked) {
                return (
                    <Button as='div' labelPosition='right' onClick={this.onUnlike}>
                        <Button>
                            <Icon name='heart' />
                            Unlike
                        </Button>
                        <Label as='a' basic pointing='left'>
                            {this.props.photo.likes.length}
                        </Label>
                    </Button>
                )
            } else {
                return (
                    <Button as='div' labelPosition='right' onClick={this.onLike}>
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
        } else {
            alert('You are not logged in to perform this action');
        }
    }
    render = () => {
        if (this.state.isLoading) {
            return (
                <Button as='div' labelPosition='right' onClick={this.onLike}>
                <Button loading>Loading</Button>
                    <Label as='a' basic pointing='left'>
                        {this.props.photo.likes.length}
                    </Label>
                </Button>
            )
        } else {
            return (
                <span>
                    {this.renderButton()}
                </span>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    startLikePhoto: (photoId) => dispatch(startLikePhoto(photoId)),
    startUnlikePhoto: (photoId) => dispatch(startUnlikePhoto(photoId))
});

export default connect(mapStateToProps, mapDispatchToProps)(LikeButton);