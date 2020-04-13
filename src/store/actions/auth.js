import { auth, db, storage } from '../../config/firebaseConfig';
import firebase from 'firebase';

export const loginUser = (payload) => ({
    type: 'LOGIN_USER',
    payload
});

export const registerUser = (payload) => ({
    type: 'REGISTER_USER',
    payload
});

export const getUserDetails = (payload) => ({
    type: 'GET_USER_DETAILS',
    payload
});

export const logoutUser = () => ({
    type: 'LOGOUT_USER'
});

export const updateUser = (payload) => ({
    type: 'UPDATE_USER',
    payload
});

export const uploadPhoto = (payload) => ({
    type: 'UPLOAD_PHOTO',
    payload
});

export const startUploadPhoto = (photoDetails) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const { title, description, tags, photo, location }  = photoDetails;
            db.collection('photos').add({ title, description, tags, location, createdBy: getState().auth.id })
                .then((doc) => {
                    const photoId = doc.id;
                        db.collection('users').doc(getState().auth.id).update({
                            photos: firebase.firestore.FieldValue.arrayUnion(photoId)
                        })
                        .then(() => {
                            const uploadTask = storage.ref(`photos/${getState().auth.id}/${photoId}`).put(photo);
                            uploadTask.on('state_changed',
                                null,
                                (error) => console.trace(error),
                                () => {
                                    storage.ref(`photos/${getState().auth.id}/${photoId}`).getDownloadURL()
                                        .then((url) => {
                                            db.collection('photos').doc(photoId).update({
                                                url
                                            }).then(() => {
                                                db.collection('users').doc(getState().auth.id).get()
                                                .then((user) => {
                                                    dispatch(uploadPhoto({
                                                        user: user.data()
                                                    }));
                                                    resolve();
                                                })
                                                .catch((error) => {
                                                    reject(error);
                                                });
                                            })
                                            .catch((error) => {
                                                reject(error);
                                            });
                                        });
                                });
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    
                })
                .catch((error) => {
                    reject(error);
                });
            // const uploadTask = storage.ref(`photos/${getState().auth.id}/`).put(photo);
            //After creating entry in photo database, and updating the user, dispatch new user obj to reducer
        });
    }
}

export const startLoginUser = (credentials) => {
    return (dispatch) => {
        const { email, password } = credentials;
        return new Promise((resolve, reject) => {
            auth.signInWithEmailAndPassword(email, password)
                .then(({ user }) => {
                    db.collection('users').doc(user.uid).get()
                        .then((doc) => {
                            let savedUser = doc.data();
                            dispatch(loginUser({
                                id: user.uid,
                                user: savedUser
                            }));
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        })
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }
}

export const startRegisterUser = (credentials) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            const { email, password, firstName, lastName, gender, username, confirmPassword } = credentials;
            if (password == confirmPassword) {
                const newUser = {
                    photoUrl: gender === 'female' ? 'https://react.semantic-ui.com/images/avatar/large/molly.png' : 'https://react.semantic-ui.com/images/avatar/large/matthew.png',
                    email,
                    firstName,
                    lastName,
                    gender,
                    username: username.toLowerCase(),
                    followers: [],
                    photos: [],
                    following: [],
                    comments: [],
                    likes: [],
                    bio: `Download free, beautiful high-quality photos curated by ${firstName} ${lastName}`
                }
                auth.createUserWithEmailAndPassword(email, password)
                    .then(({ user }) => {
                        db.collection('users').doc(user.uid).set(newUser)
                            .then(() => {
                                dispatch(registerUser({
                                    id: user.uid,
                                    user: newUser
                                }));
                                resolve();
                            }).catch((error) => {
                                reject(error);
                            })
                    })
                    .catch((error) => {
                        reject(error);
                    })
            } else {
                const error = {
                    message: 'Passwords do not match'
                }
                reject(error);
            }
        });
    }
}

export const startLogoutUser = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            auth.signOut()
                .then(() => {
                    dispatch(logoutUser());
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
        });
    }
}

export const startGetUserDetails = (id) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            db.collection('users').doc(id).get()
                .then((doc) => {
                    let savedUser = doc.data();
                    dispatch(getUserDetails({
                        id,
                        user: savedUser
                    }));
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }
}

export const startUpdateUser = (updates) => {
    return (dispatch, getState) => {
        const { firstName, lastName, gender, bio, photo = null } = updates;
        //If there is no photo update, directly update user details and set state
        //Else, update the photo first, get photoUrl and then update user details
        return new Promise((resolve, reject) => {
            if (photo == null) {
                db.collection('users').doc(getState().auth.id).update({
                    firstName, lastName, gender, bio
                })
                    .then(() => {
                        db.collection('users').doc(getState().auth.id).get()
                            .then((doc) => {
                                const updatedUser = doc.data();
                                console.log(updatedUser);
                                dispatch(updateUser({
                                    user: updatedUser
                                }));
                                resolve();
                            }).catch((error) => {
                                reject(error);
                            })
                    })
                    .catch((error) => {
                        reject(error);
                    })
            } else {
                const uploadTask = storage.ref(`displayPhotos/${getState().auth.id}`).put(photo);
                uploadTask.on('state_changed',
                    null,
                    (error) => console.trace(error),
                    () => {
                        storage.ref(`displayPhotos/${getState().auth.id}`).getDownloadURL()
                            .then((url) => {
                                db.collection('users').doc(getState().auth.id).update({
                                    firstName, lastName, gender, bio, photoUrl: url
                                })
                                    .then(() => {
                                        db.collection('users').doc(getState().auth.id).get()
                                            .then((doc) => {
                                                const updatedUser = doc.data();
                                                dispatch(updateUser({
                                                    user: updatedUser
                                                }));
                                                resolve();
                                            }).catch((error) => {
                                                reject(error);
                                            })
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    })
                            });
                    });
            }
        })
    }
}