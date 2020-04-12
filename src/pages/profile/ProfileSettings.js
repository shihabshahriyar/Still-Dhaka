import React from 'react';
import { Container, Form, Button, Input, Image, Modal, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'; 
import ReactCrop from 'react-image-crop';

class ProfileSettings extends React.Component {
    state = {
        bio: '',
        firstName: '',
        lastName: '',
        username: '',
        gender: '',
        photoUrl: '',
        crop: {
            unit: '%',
            width: 30,
            aspect: 1 / 1
        },
        croppedImageUrl: '',
        showCropModal: false,
        initialPhotoUrl: '',
        croppedImage: null
    }
    componentDidMount = () => {
        const {user} = this.props.auth;
        this.setState({
            bio: user.bio,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            gender: user.gender,
            photoUrl: user.photoUrl,
            initialPhotoUrl: user.photoUrl
        });
    }
    //Initialize photo upload
    onPhotoUpload = () => {
        document.getElementById('fileUpload').click();
    }
    //Uploading file
    onPhotoChange = (e) => {
        const reader = new FileReader();
        const photo = e.target.files[0];
        console.log(photo);
        reader.readAsDataURL(photo);
        reader.onload = () => {
            this.setState({ photoUrl: reader.result, showCropModal: true });
            document.getElementById("fileUpload").value = "";
        }
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

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        // this.fileUrl = window.URL.createObjectURL(blob);
        resolve(blob);
      }, 'image/jpeg');
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
  onRegisterSubmit = () => {
      console.log(this.state);
  }
    render = () => (
        <Container>
            <div className="auth-form">
                <h1 className="auth-form__form-title">Edit profile</h1>
                <input id="myInput" type="file" style={{ visibility: 'hidden' }} id="fileUpload" onChange={this.onPhotoChange} />
                <Image src={this.state.photoUrl} circular size="small" className="display-photo-settings" onClick={this.onPhotoUpload}/>
                <Button style={{ margin: 'auto', display: 'block', marginBottom: '2rem' }} onClick={this.onPhotoUpload}>Change photo</Button>
                <Form onSubmit={this.onRegisterSubmit}>
                    <Form.Group widths='equal'>
                        <Form.Field
                            control={Input}
                            label='First name'
                            placeholder='First name'
                            value={this.state.firstName}
                            onChange={(e) => this.setState({firstName: e.target.value})}
                        />
                        <Form.Field
                            control={Input}
                            label='Last name'
                            placeholder='Last name'
                            value={this.state.lastName}
                            onChange={(e) => this.setState({lastName: e.target.value})}
                        />
                        </Form.Group>
                    <Form.Field>
                    <Form.Field>
                    <label>Short bio</label>
                    <input placeholder='Say something about yourself.' type="text" value={this.state.bio} onChange={(e) => this.setState({bio: e.target.value})} />
                    </Form.Field>
                    <Form.Field>
                    <label>Gender</label>
                    <select label='Select gender' control='select' className="ui selection dropdown" value={this.state.gender} onChange={(e) => this.setState({gender:e.target.value})}>
                        <option value='male'   className="item">Male</option>
                        <option value='female' className="item">Female</option>
                        <option value='other'  className="item">Other</option>
                    </select>
                    </Form.Field>
                    </Form.Field>
                    <Button className="auth-form-submit" color="green" type='submit'>Update</Button>
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
                            circularCrop="true"
                        />
                    )}
                </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.onCropCancel}  negative>
                    Cancel
                    </Button>
                    <Button
                    onClick={this.onCrop}
                    positive
                    >Crop</Button>
                </Modal.Actions>
            </Modal>
        </Container>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps)(ProfileSettings);