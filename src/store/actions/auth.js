import { auth, db, storage } from '../../config/firebaseConfig';
import firebase from 'firebase';

const createKeywords = (name) => {
    const arrName = [];
    let curName = '';
    name.toLowerCase().split('').forEach(letter => {
        curName += letter;
        arrName.push(curName);
    });
    return arrName;
}

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

export const startDeletePhoto = (id) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            let authUserId = getState().auth.id;
            db.collection('photos').doc(id).delete()
            .then(() => {
                db.collection('users').doc(authUserId).update({
                    photos: firebase.firestore.FieldValue.arrayRemove(id)
                })
                .then(() => {
                    dispatch(updateUser({
                        user: {
                            ...getState().auth.user,
                            photos: getState().auth.user.photos.filter((photoId) => photoId != id)
                        }
                    }));
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
            })
            .catch((error) => {
                reject(error);
            })
        });
    }
}

export const startUnlikePhoto = (photoId) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            let authUserId = getState().auth.id;
            let isAlreadyLiked = getState().auth.user.likes.includes(photoId);
            if (isAlreadyLiked) {
                db.collection('photos').doc(photoId).update({
                    likes: firebase.firestore.FieldValue.arrayRemove(authUserId)
                })
                    .then(() => {
                        db.collection('users').doc(authUserId).update({
                            likes: firebase.firestore.FieldValue.arrayRemove(photoId)
                        })
                            .then(() => {
                                dispatch(updateUser({
                                    user: {
                                        ...getState().auth.user,
                                        likes: getState().auth.user.likes.filter((id) => id != photoId)
                                    }
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
            } else {
                let error = { message: 'User has already unliked' }
                reject(error);
            }
        });
    }
}

export const startLikePhoto = (photoId) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            let authUserId = getState().auth.id;
            let isAlreadyLiked = getState().auth.user.likes.includes(photoId);
            if (!isAlreadyLiked) {
                db.collection('photos').doc(photoId).update({
                    likes: firebase.firestore.FieldValue.arrayUnion(authUserId)
                })
                    .then(() => {
                        db.collection('users').doc(authUserId).update({
                            likes: firebase.firestore.FieldValue.arrayUnion(photoId)
                        })
                            .then(() => {
                                dispatch(updateUser({
                                    user: {
                                        ...getState().auth.user,
                                        likes: [
                                            ...getState().auth.user.likes,
                                            photoId
                                        ]
                                    }
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
            } else {
                let error = { message: 'User has already liked' }
                reject(error);
            }
        });
    }
}

export const startFollowUser = (userId) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            let authUserId = getState().auth.id;
            //First check if user has already followed or not
            let isAlreadyFollowing = getState().auth.user.following.includes(userId);
            if (!isAlreadyFollowing) {
                db.collection('users').doc(userId).update({
                    followers: firebase.firestore.FieldValue.arrayUnion(authUserId)
                })
                    .then(() => {
                        db.collection('users').doc(authUserId).update({
                            following: firebase.firestore.FieldValue.arrayUnion(userId)
                        })
                            .then(() => {
                                dispatch(updateUser({
                                    user: {
                                        ...getState().auth.user,
                                        following: [
                                            ...getState().auth.user.following,
                                            userId
                                        ]
                                    }
                                }));
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            })
                    })
                    .catch((error) => {
                        reject(error);
                    })
            } else {
                const error = {
                    message: 'User is already following'
                }
                reject(error);
            }
        });
    }
}

export const startUnfollowUser = (userId) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            let authUserId = getState().auth.id;
            let isAlreadyFollowing = getState().auth.user.following.includes(userId);
            if (isAlreadyFollowing) {
                db.collection('users').doc(userId).update({
                    followers: firebase.firestore.FieldValue.arrayRemove(authUserId)
                })
                    .then(() => {
                        db.collection('users').doc(authUserId).update({
                            following: firebase.firestore.FieldValue.arrayRemove(userId)
                        })
                            .then(() => {
                                dispatch(updateUser({
                                    user: {
                                        ...getState().auth.user,
                                        following: getState().auth.user.following.filter((id) => id != userId)
                                    }
                                }));
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            })
                    })
                    .catch((error) => {
                        reject(error);
                    })
            } else {
                let error = {
                    message: "User already does not follow the user"
                }
                reject(error);
            }
        })
    }
}

export const startEditPhoto = (photoDetails) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            let { title, description, tags, location } = photoDetails;
            db.collection('photos').doc(photoDetails.id).update({
                ...photoDetails,
                keywords: [...createKeywords(title), ...createKeywords(description), ...tags, ...createKeywords(location)]
            })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

//Can only upload photo if user is authenticated
export const startUploadPhoto = (photoDetails) => {
    return (dispatch, getState) => {
        return new Promise((resolve, reject) => {
            const { title, description, tags, photo, location } = photoDetails;
            db.collection('photos').add({ title, description, tags, location, createdBy: getState().auth.id, downloads: 0, likes: [], keywords: [...createKeywords(title), ...createKeywords(description), ...tags, ...createKeywords(location)] })
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
                                                url,
                                                id: photoId
                                            })
                                                .then(() => {
                                                    dispatch(updateUser({
                                                        user: {
                                                            ...getState().auth.user,
                                                            photos: [
                                                                ...getState().auth.user.photos,
                                                                photoId
                                                            ]
                                                        }
                                                    }));
                                                    resolve();
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
                            //Saved user also has an id property
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
                    isVerified: false,
                    bio: `Download free, beautiful high-quality photos curated by ${firstName} ${lastName}`,
                    keywords: [...createKeywords(firstName), ...createKeywords(lastName), ...createKeywords(username)]
                }
                db.collection('users').where('username', '==', newUser.username).get()
                    .then((snapshot) => {
                        if (snapshot.docs.length > 0) {
                            const error = {
                                message: 'Your username has already been taken, please try something else.'
                            }
                            reject(error);
                        } else {
                            auth.createUserWithEmailAndPassword(email, password)
                                .then(({ user }) => {
                                    db.collection('users').doc(user.uid).set({ ...newUser, id: user.uid })
                                        .then(() => {
                                            dispatch(registerUser({
                                                id: user.uid,
                                                user: {
                                                    ...newUser,
                                                    id: user.uid
                                                }
                                            }));
                                            resolve();
                                        }).catch((error) => {
                                            reject(error);
                                        })
                                })
                                .catch((error) => {
                                    reject(error);
                                })
                        }
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
                    firstName, lastName, gender, bio, keywords: [...createKeywords(firstName), ...createKeywords(lastName), ...createKeywords(getState().auth.user.username)]
                })
                    .then(() => {
                        dispatch(updateUser({
                            user: {
                                ...getState().auth.user,
                                firstName,
                                lastName,
                                gender,
                                bio
                            }
                        }));
                        resolve();
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
                                        dispatch(updateUser({
                                            user: {
                                                ...getState().auth.user,
                                                firstName,
                                                lastName,
                                                gender,
                                                bio,
                                                photoUrl: url
                                            }
                                        }));
                                        resolve();
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