import React from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';

class LikeButton extends React.Component {
    onLike = () => {
        console.log(this.props.photo);
    }
    render = () => (
        <Button as='div' labelPosition='right' onClick={this.onLike}>
            <Button color='red'>
                <Icon name='heart' />
                Like
            </Button>
            <Label as='a' basic color='red' pointing='left'>
                2,048
            </Label>
        </Button>
    )
}

export default LikeButton;