import * as actionTypes from './actionTypes'
export const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ACCOUNT':
            return { ...state, account: action.payload };
        case 'SET_CURRENT_USER':
            return { ...state, currentUser: action.payload };
        case 'SET_MARKETPLACE':
            return { ...state, marketplace: action.payload };
        case 'SET_NFT':
            return { ...state, nft: action.payload };
        case 'SET_BALANCE':
            return { ...state, balance: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_CATEGORIES_SUCCESS':
            return { ...state, categories: action.payload };
        case 'SET_PROFILE_SUCCESS':
                return { ...state, balance: action.payload };
        case actionTypes.LOGIN_SUCCESS:
            return {...state, currentUser: action.payload }
        case actionTypes.LOGOUT_SUCCESS:
            return { ...state, currentUser: null }
        case actionTypes.GET_CATEGORIES_SUCCESS:
            return { ...state, categories: action?.payload?.data }
        case actionTypes.GET_PROFILE_SUCCESS:
            return { ...state, profile: action?.payload }
            case actionTypes.GET_SUBSCRIPTION_SUCCESS:
                return { ...state, subscription: action?.payload }
        default:
            return state;
    }
}