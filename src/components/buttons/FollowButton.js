import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { startFollowUser, startUnfollowUser } from '../../store/actions/auth';


class FollowButton extends React.Component {
    state = { isLoading: false }
    onFollow = () => {
        let { user } = this.props;
        this.setState({
            isLoading: true
        });
        this.props.startFollowUser(user.id)
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
    onUnfollow = () => {
        let { user } = this.props;
        this.setState({
            isLoading: true
        });
        this.props.startUnfollowUser(user.id)
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
    renderButton = () => {
        let { user } = this.props;
        let isAlreadyFollowing = this.props.auth.user.following.includes(user.id);
        if(isAlreadyFollowing) {
            return (
                <Button onClick={this.onUnfollow}>
                    Unfollow
                </Button>
            )
        } else {
            return (
                <Button icon basic onClick={this.onFollow}>
                    <Icon name='plus' />
                    Follow
                </Button>
            )
        }
    }
    render = () => {
        if(this.state.isLoading) {
            return (
                <Button basic loading>Loading</Button>
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
    startFollowUser: (userId) => dispatch(startFollowUser(userId)),
    startUnfollowUser: (userId) => dispatch(startUnfollowUser(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton);