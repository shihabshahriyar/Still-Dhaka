let initialState = {
    id: '',
    user: null
}

export default (state = initialState, action) => {
    switch(action.type) {
        case 'LOGIN_USER':
            return {
                ...state,
                id: action.payload.id,
                user: action.payload.user
            };
        case 'REGISTER_USER':
            return {
                ...state,
                id: action.payload.id,
                user: action.payload.user
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload.user
            }
        case 'LOGOUT_USER':
            return {
                ...state,
                user: null,
                id: ''
            };
        case 'GET_USER_DETAILS':
            return {
                ...state,
                id: action.payload.id,
                user: action.payload.user
            }
        case 'UPLOAD_PHOTO':
            return {
                ...state,
                user: action.payload.user
            };
        default: 
            return state;
    }
}