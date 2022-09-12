function useMetaMaskAuth() {

    var auth =false;
    auth = (localStorage.getItem('token')) ? true : false 
    var account = (localStorage.getItem('account')) ? true : false 

    return auth && account;
}
  
export default useMetaMaskAuth;