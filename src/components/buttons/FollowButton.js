import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { db } from '../../config/firebaseConfig';
import { startFollowUser, startUnfollowUser } from '../../store/actions/auth';

//Check if user is logged in, if logged in, proceed to next step. If not, show login prompt
 // Check if logged in user id == id of user trying to follow, if not so proceed to next step. If so, hide button from profile component

// Check if user has already followed or not, and conditionally render based on that.
    // If user followed (check if user id is present in following array of auth user), render unfollow button
    // If user did not follow yet, render follow button 

//Follow method: 
    //


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
                <Button icon color="blue" onClick={this.onFollow}>
                    <Icon name='plus' />
                    Follow
                </Button>
            )
        }
    }
    render = () => {
        if(this.state.isLoading) {
            return (
                <Button loading>Loading</Button>
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