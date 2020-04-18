import React from 'react';
import { Container, Form, Button, Input, Image, Modal, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ReactCrop from 'react-image-crop';
import { connect } from 'react-redux';
import { startUploadPhoto } from '../../store/actions/auth';


class Upload extends React.Component {
    state = {
        title: '',
        description: '',
        location: '',
        tags: '',
        photo: null,
        photoUrl: 'https://react.semantic-ui.com/images/wireframe/image.png',
        initialPhotoUrl: '',
        crop: {
            unit: '%',
            width: 100,
            height: 100
        },
        showCropModal: false,
        croppedImage: null,
        croppedImageUrl: '',
        uploadError: '',
        isUploading: false
    }
    componentDidMount = () => {
        this.setState({
            initialPhotoUrl: this.state.photoUrl
        });
    }
    onUploadPost = () => {
        const tags = this.state.tags.split(',');
        const filteredTags = tags.filter((tag) => tag.trim() !== '');
        const trimmedTags = filteredTags.map((tag) => tag.trim());
        const payload = {
            title: this.state.title,
            description: this.state.description,
            tags: trimmedTags,
            location: this.state.location,
            photo: this.state.croppedImage
        }
        this.setState({
            isUploading: true
        });
        this.props.startUploadPhoto(payload)
        .then(() => {
            this.props.history.push(`/users/${this.props.auth.id}`);
            this.setState({
                isUploading: false
            });
        })
        .catch((error) => {
            console.log(error);
            this.setState({ uploadError: error.message, isUploading: false })
        });
    }
    onPhotoChange = (e) => {
        const reader = new FileReader();
        const photo = e.target.files[0];
        reader.readAsDataURL(photo);
        reader.onload = () => {
            this.setState({ photoUrl: reader.result, photo, showCropModal: true });
            document.getElementById("fileUpload").value = "";
        }
    }
    onPhotoUpload = () => {
        document.getElementById('fileUpload').click();
    }
    onUnloadImage = () => {
        this.setState({
            photo: null,
            photoUrl: this.state.initialPhotoUrl
        });
    }
    //On react crop load
    onImageLoaded = image => {
        this.imageRef = image;
    };

    //On crop complete
    onCropComplete = crop => {
        this.makeClientCrop(crop);
    };

    onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        this.setState({ crop });
    };

    async makeClientCrop(crop) {
        if (this.imageRef && crop.width && crop.height) {
            const croppedImage = await this.getCroppedImg(
                this.imageRef,
                crop,
                'newFile.jpeg'
            );
            const croppedImageUrl = window.URL.createObjectURL(croppedImage)
            this.setState({ croppedImageUrl, croppedImage });
        }
    }

    async getCroppedImg(image, crop, fileName) {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        let originWidth = crop.width * scaleX;
        let originHeight = crop.height * scaleY;
        // maximum width/height
        let maxWidth = 1200, maxHeight = 1200 / (16 / 9);
        let targetWidth = originWidth;
        let targetHeight = originHeight;
        if (originWidth > maxWidth || originHeight > maxHeight) {
            if (originWidth / originHeight > maxWidth / maxHeight) {
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
            } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
            }
        }
        // set canvas size
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            targetWidth,
            targetHeight
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                blob => {
                    if (!blob) {
                        console.error("Canvas is empty");
                        return;
                    }
                    blob.name = fileName;
                    resolve(blob);
                },
                "image/png",
                1
            );
        });
    }
    onCrop = () => {
        this.setState((prevState) => ({
            photoUrl: this.state.croppedImageUrl,
            showCropModal: false
        }));
    }
    onCropCancel = () => {
        this.setState({
            photoUrl: this.state.initialPhotoUrl,
            showCropModal: false,
            croppedImage: null,
            croppedImageUrl: ''
        });
    }
    render = () => (
        <div>
            <Container>
                <div className="auth-form">
                    { this.state.uploadError && (
                        <Message negative>
                            <Message.Header>There has been a problem.</Message.Header>
                            <p>{this.state.uploadError}</p>
                        </Message>
                    )}
                    <h1 className="auth-form__form-title">Upload photo</h1>
                    <Form onSubmit={this.onUploadPost}>
                        <Image src={this.state.photoUrl} fluid />
                        <input id="myInput" type="file" style={{ visibility: 'hidden' }} id="fileUpload" onChange={this.onPhotoChange} accept="image/*" />
                        <Button style={{ margin: 'auto', display: 'block', marginBottom: '2rem' }} basic onClick={this.onPhotoUpload} type="button">Upload photo</Button>
                        <Form.Field
                            control={Input}
                            label='Title'
                            placeholder='Enter the name of this photo.'
                            value={this.state.title}
                            onChange={(e) => this.setState({ title: e.target.value })}
                            required
                        />
                        <Form.Field
                            control={Input}
                            label='Description'
                            placeholder='Describe the photo.'
                            value={this.state.description}
                            onChange={(e) => this.setState({ description: e.target.value })}
                            required
                        />
                        <Form.Field
                            control={Input}
                            label='Tags (Separate by commas)'
                            placeholder='Additional information about the snap.'
                            value={this.state.tags}
                            onChange={(e) => this.setState({ tags: e.target.value })}
                        />
                        <Form.Field
                            control={Input}
                            label='Location'
                            placeholder='Where was this snap taken?.'
                            value={this.state.location}
                            onChange={(e) => this.setState({ location: e.target.value })}
                            required
                        />
                        <Button className="auth-form-submit" secondary type='submit' disabled={!this.state.croppedImage || this.state.isUploading} loading={this.state.isUploading}>Post</Button>
                        <Link to={`/users/${this.props.auth.id}`}>Go back</Link>
                    </Form>
                </div>

                <Modal open={this.state.showCropModal} closeOnDimmerClick={false}>
                    <Modal.Header>Crop photo</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            {this.state.photoUrl && (
                                <ReactCrop
                                    src={this.state.photoUrl}
                                    crop={this.state.crop}
                                    ruleOfThirds
                                    onImageLoaded={this.onImageLoaded}
                                    onComplete={this.onCropComplete}
                                    onChange={this.onCropChange}
                                />
                            )}
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.onCropCancel} basic>
                            Cancel
                    </Button>
                        <Button
                            onClick={this.onCrop}
                            secondary
                        >Crop</Button>
                    </Modal.Actions>
                </Modal>
            </Container>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => ({
    startUploadPhoto: (photoDetails) => dispatch(startUploadPhoto(photoDetails))
});

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, mapDispatchToProps)(Upload);