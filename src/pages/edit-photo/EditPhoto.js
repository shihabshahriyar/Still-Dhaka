import React from 'react';
import { Message, Form, Button, Image, Input, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startEditPhoto, startDeletePhoto } from '../../store/actions/auth';

class EditPhoto extends React.Component {
    state = {
        title: '',
        description: '',
        id: '',
        url: '',
        tags: null,
        location: '',
        createdBy: null,
        likes: null,
        downloads: '',
        isUpdating: false,
        updateError: null,
        showDeleteModal: false
    }
    onDelete = () => {
        this.setState({ isUpdating: true })
        this.props.startDeletePhoto(this.state.id).then(() => {
            this.props.history.push(`/users/${this.props.auth.id}`);
            this.setState({ showDeleteModal: false, updateError: null, isUpdating: false });
        })
        .catch((error) => {
            this.setState({ showDeleteModal: false, updateError: error.message, isUpdating: false });
        })
    }
    onUpdate = () => {
        const tags = this.state.tags.split(',');
        const filteredTags = tags.filter((tag) => tag.trim() !== '');
        const trimmedTags = filteredTags.map((tag) => tag.trim());
        const payload = {
            id: this.state.id,
            title: this.state.title,
            description: this.state.description,
            tags: trimmedTags,
            location: this.state.location
        }
        this.setState({
            isUpdating: true
        });
        this.props.startEditPhoto(payload)
            .then(() => {
                this.props.history.push(`/users/${this.props.auth.id}`);
                this.setState({
                    isUpdating: false
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ updateError: error.message, isUpdating: false })
            });
    }
    componentDidMount = () => {
        if (this.props.location.state && this.props.location.state.photo) {
            let { photo } = this.props.location.state;
            let tags = photo.tags.toString();
            console.log(tags);
            this.setState({ ...photo, tags });
        } else {
            this.props.history.push('/404');
        }
    }
    render = () => (
        <div>
            <div className="auth-form">
                <Form onSubmit={this.onUpdate}>
                    {this.state.updateError && (
                        <Message negative>
                            <Message.Header>There has been a problem.</Message.Header>
                            <p>{this.state.updateError}</p>
                        </Message>
                    )}
                    <h1 className="auth-form__form-title">Edit picture</h1>
                    <Image src={this.state.url} fluid />
                    <Button onClick={() => this.setState({ showDeleteModal: true })} type="button" style={{ margin: '1.5rem auto', display: 'inline-block' }}>Delete Photo</Button>
                    <Form.Field
                        control={Input}
                        label='Title'
                        placeholder='Enter title'
                        value={this.state.title}
                        onChange={(e) => this.setState({ title: e.target.value })}
                    />
                    <Form.Field
                        control={Input}
                        label='Description'
                        placeholder='Enter description'
                        value={this.state.description}
                        onChange={(e) => this.setState({ description: e.target.value })}
                    />
                    <Form.Field
                        control={Input}
                        label='Tag (Separate by commas)'
                        placeholder='Enter tags'
                        value={this.state.tags}
                        onChange={(e) => this.setState({ tags: e.target.value })}
                    />
                    <Form.Field
                        control={Input}
                        label='Location'
                        placeholder='Enter location'
                        value={this.state.location}
                        onChange={(e) => this.setState({ location: e.target.value })}
                    />
                    <Button className="auth-form-submit" secondary type='submit' disabled={this.state.isUpdating} loading={this.state.isUpdating}>Update</Button>
                    <Link to={`/users/${this.props.auth.id}`}>Go back</Link>
                </Form>
            </div>
            <Modal size='tiny' open={this.state.showDeleteModal} onClose={() => this.setState({ showDeleteModal: false})}>
                <Modal.Header>Delete This Photo</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this photo?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic onClick={() => this.setState({ showDeleteModal: false })}>No</Button>
                    <Button
                        secondary
                        content='Yes'
                        onClick={this.onDelete}
                        disabled={this.state.isUpdating} 
                        loading={this.state.isUpdating}
                    />
                </Modal.Actions>
            </Modal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        startEditPhoto: (updates) => dispatch(startEditPhoto(updates)),
        startDeletePhoto: (id) => dispatch(startDeletePhoto(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPhoto);