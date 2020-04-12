import { auth, db } from '../../config/firebaseConfig';

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
 
export const startLoginUser = (credentials) => {
    return (dispatch) => {
        const { email, password } = credentials;
        return auth.signInWithEmailAndPassword(email, password)
            .then(({ user }) => {
                return db.collection('users').doc(user.uid).get()
                    .then((doc) => {
                        let savedUser = doc.data();
                        dispatch(loginUser({
                            id: user.uid,
                            user: savedUser
                        }));
                    })
                    .catch((error) => {
                        console.trace(error);
                    })
            })
            .catch((error) => {
                console.trace(error);
            });
    }
}

export const startRegisterUser = (credentials) => {
    return (dispatch) => {
        const { email, password, firstName, lastName, gender, username } = credentials;
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
        return auth.createUserWithEmailAndPassword(email, password)
            .then(({ user }) => {
                return db.collection('users').doc(user.uid).set(newUser)
                    .then(() => {
                        dispatch(registerUser({
                            id: user.uid,
                            user: newUser
                        }));
                    }).catch((error) => {
                        console.trace(error);
                    })
            })
            .catch((error) => {
                console.trace(error);
            })
    }
}

export const startLogoutUser = () => {
    return (dispatch) => {

    }
}

export const startGetUserDetails = (id) => {
    return (dispatch) => {
        return db.collection('users').doc(id).get()
        .then((doc) => {
            let savedUser = doc.data();
            dispatch(getUserDetails({
                id,
                user: savedUser
            }));
        })
        .catch((error) => {
            console.trace(error);
        });
    }
}