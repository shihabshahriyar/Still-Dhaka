import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

class DownloadButton extends React.Component {
    onDownload = () => {
        console.log(this.props.photo);
    }
    render = () => (
        <Button icon labelPosition='left' basic onClick={this.onDownload}>
            <Icon name='download' />
            Free download
        </Button>
    )
}

export default DownloadButton;