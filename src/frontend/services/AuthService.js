import axios from "axios";

export class AuthService {

    // baseUrl = "http://localhost:8080/api/products/";
    baseUrl = "http://65.2.143.196/anadev/dpp-pro/wp-json/buddyx/v2/";
    // baseUrl = "https://diversityproduction.pro/wp-json/buddyx/v2/";

    login(payload){
        return axios.post(this.baseUrl+"user-login", payload).then(res => res.data);
    }

    register(payload){
        return axios.post(this.baseUrl+"user-registration", payload).then(res => res.data);
    }

    forgotPassword(email){
        return axios.post(this.baseUrl+"forgot-password", email).then(res => res.data);
    }
    getCategories(){
        return axios.get(this.baseUrl+"nft-categories").then(res => res.data);
    }
    
    getProfile(payload){
        return axios.post(this.baseUrl+"nft-profile", payload,{
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => res.data);
    }
    updateProfile(payload){
        return axios.post(this.baseUrl+"nft-profile", payload,{
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => res.data);
    }

    getsubscription(payload){
        return axios.get(this.baseUrl+"nft-subscription-plans").then(res => res.data);
    }
    
    updateSubscription(payload){
        return axios.post(this.baseUrl+"nft-users-subscription", payload,{
            headers: {
              Authorization: localStorage.getItem('token')
            }
          }).then(res => res.data);
    }

    

}