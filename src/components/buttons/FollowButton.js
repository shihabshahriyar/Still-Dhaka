import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { db } from '../../config/firebaseConfig';

//Check if user is logged in, if logged in, proceed to next step. If not, show login prompt
 // Check if logged in user id == id of user trying to follow, if not so proceed to next step. If so, hide button from profile component

// Check if user has already followed or not, and conditionally render based on that.
    // If user followed (check if user id is present in following array of auth user), render unfollow button
    // If user did not follow yet, render follow button 

//Follow method: 
    //


class FollowButton extends React.Component {
    onFollow = () => {
        console.log(this.props.user);
        let { user } = this.props;
        let authUser = this.props.auth.user;
        if(user.id == authUser.id) {
            console.log('You are trying to follow yourself');
        } else {
            console.log(`You are trying to follow ${user.firstName} ${user.lastName}`);

        }
    }
    renderButton = () => {

    }
    render = () => (
        <Button icon color="blue" onClick={this.onFollow}>
            <Icon name='plus' />
            Follow
        </Button>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(FollowButton);