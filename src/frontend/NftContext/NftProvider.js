import React, { useReducer, useEffect } from "react";
import { createContext } from "react";
import {appReducer} from './AppReducer';
import { AuthService } from "../services/AuthService";
import { toast } from "react-toastify";
import * as actionTypes from './actionTypes'
export const NftContext = createContext();


const NftProvider = ({ children }) => {
    const initialState = {
        marketplace: {},
        nft: {},
        account: '',
        balance: 0,
        categories: [],
        profile:{},
        currentUser: '',
        subscription:[],
        isLoading: false
    };
    const authService = new AuthService();
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        (async () => {
        //    await getCategories();
           const user = localStorage.getItem('user');
           await setCurrentUser(JSON.parse(user));
        })();
        
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const setAccount = (account) => {
        dispatch({ type: 'SET_ACCOUNT', payload: account })
    }
    const setCategories = (data) => {
        dispatch({ type: 'SET_CATEGORIES_SUCCESS', payload: data })
    }
    const setsubscription = (data) => {
        dispatch({ type: 'GET_SUBSCRIPTION_SUCCESS', payload: data })
    }
    const setProfile = (data) => {
        dispatch({ type: 'GET_PROFILE_SUCCESS', payload: data })
    }
    const setCurrentUser = (payload) => {
        dispatch({ type: 'SET_CURRENT_USER', payload: payload })
    }
    const setMarketplace = (account) => {
        dispatch({ type: 'SET_MARKETPLACE', payload: account })
    }
    const setNFT = (account) => {
        dispatch({ type: 'SET_NFT', payload: account })
    }
    const setBalance = (account) => {
        dispatch({ type: 'SET_BALANCE', payload: account })
    }
    const setIsLoading = (account) => {
        dispatch({ type: 'SET_LOADING', payload: account })
    }
    const login = (payload, navitage) => {
        authService.login(payload)
        .then((data) => {
            // console.log('data.token,',data.data.image);
            dispatch({ type: actionTypes.LOGIN_SUCCESS, payload: data?.data })
          
             if(data.type === 'success'){
                localStorage.setItem('token', data.data.token)
                localStorage.setItem('user', JSON.stringify(data.data))
              
                navitage('/')
            }else{
                toast.error('Please check your credentials');
            }
        })
        .catch((err) => console.log(err));
    }
    const getprofile = (payload, navitage) => {
       authService.getProfile()
        .then((data) => dispatch({ type: actionTypes.GET_PROFILE_SUCCESS, payload:  data?.data  }))
        .catch((err) => console.log(err));
    }
    const profileUpdate = (payload) => {
        console.log(payload);
        authService.updateProfile(payload)
        .then((data) =>{ 
            dispatch({ type: actionTypes.SET_PROFILE_SUCCESS, payload: data })
            if(data.type === 'success'){
                toast.success('Profile Update Successfully');
            }else{
                toast.error(data.msg);
            }
        })
        .catch((err) => console.log(err));
    }

    const updateSubscription = (payload, navitage) => {
      
        authService.updateSubscription(payload)
        .then((data) =>{ 
            dispatch({ type: actionTypes.SET_SUBSCRIPTION_SUCCESS, payload: data })
            if(data.type === 'success'){
                toast.success('Update Plan Successfully');
                navitage('/')
            }else{
                toast.error(data.msg);
            }
        })
        .catch((err) => console.log(err));
    }    

    const getsubscription = (payload, navitage) => {
        authService.getsubscription()
         .then((data) => dispatch({ type: actionTypes.GET_SUBSCRIPTION_SUCCESS, payload:  data?.data  }))
         .catch((err) => console.log(err));
     }

    const register = (payload, navitage) => {
        dispatch({ type: actionTypes.REGISTER_REQUEST})
        authService.register(payload)
        .then((data) =>{ 
            dispatch({ type: actionTypes.REGISTER_SUCCESS, payload: data?.data  })
            if(data.type === 'success'){
                toast.success('Registration has been done successfully.');
                navitage('/login')
            }else{
                toast.error(data.msg);
            }
        })
        .catch((err) => console.log(err));
    }
    const forgotPassword = (payload,navitage) => {
        dispatch({ type: actionTypes.FORGOT_PASSWORD_REQUEST})
        authService.forgotPassword(payload)
        .then((data) => {
            dispatch({ type: actionTypes.FORGOT_PASSWORD_SUCCESS, payload: data })
            if(data.type === 'success'){
                toast.success(data.msg);
                navitage('/login')
            }else{
                toast.error(data.msg);
            }
        })
        .catch((err) => console.log(err));
    }
    const getCategories = () => {
        authService.getCategories()
        .then((data) => dispatch({ type: actionTypes.GET_CATEGORIES_SUCCESS, payload: data }))
        .catch((err) => console.log(err));
    }
    return (
        <NftContext.Provider value={{
            account: state.account,
            marketplace: state.marketplace,
            nft: state.nft,
            balance: state.balance,
            isLoading: state.isLoading,
            categories: state.categories,
            currentUser: state.currentUser,
            profile: state.profile,
            subscription: state.subscription,

            setsubscription,
            setAccount,
            setCategories,
            setProfile,
            setCurrentUser,
            setMarketplace,
            setNFT,
            setBalance,
            setIsLoading,
            login,
            register,
            forgotPassword,
            getCategories,
            getprofile,
            getsubscription,
            profileUpdate,
            updateSubscription
        }}>
            {children}
        </NftContext.Provider>
    )
};

export default NftProvider;
