import { useContext, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NftContext } from "../NftContext/NftProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Home from './Home.js'
import MyListedNFTs from './MyListedNFTs'
import MyPurchasesNFTs from './MyPurchasesNFTs'
import MySoldNFTs from './MySoldNFTs'
import Footer from './layout/Footer.js'
import { ethers } from "ethers"
import Header from "./layout/Header";
import Explores from "./Explore";
import Create from "./Explore/Create";
import AllNEFT from "./Explore/AllNEFT";
import BuyNEFTDetails from './Explore/components/BuyNeftDetails'
import AuctionDetails from './Explore/components/AuctionDetails'
import Subscribe from './Subscribe';
import NFTMarketplace from '../../backend/artifacts/src/backend/contracts/NFTMarketplace.sol/NFTMarketplace.json'
//import ArtAuction from '../../backend/artifacts/src/backend/contracts/ArtAuction.sol/ArtAuction.json'                                                                                                           ArtAuction
import {marketplaceAddress} from './config'                 
//import {ArtAuctionAddress} from './config'
import Web3Modal from 'web3modal'
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp'
import Profile from './Auth/Profile'
import ForgotPassword from './Auth/ForgotPassword'
import CreateSellNFTs from './myAuctione/CreateSellNFTs';
// import {loadAuctionNFTs} from './helper'
// import Schedule from 'react-schedule-job'
// import 'react-schedule-job/dist/index.css'
import PrivateRoute from './hook/PrivateRoute'
import ProtectedRoute from './hook/ProtectedRoute'
// const jobs = [
//   {
//     fn: loadAuctionNFTs,
//     id: '1',
//     schedule: '* * * * *',
//     // Execute every hours
//     name: 'loadNFTs'
//   }
// ] 
function App() {
  const { setAccount, setMarketplace, setNFT, setBalance, setIsLoading, account, setCategories } = useContext(NftContext);
  const [loading, setLoading] = useState(true)
  
  const loadContracts = async () => {
    // Get deployed copies of contracts
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/")
    const marketplace = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await marketplace.fetchMarketItems()
    
    setNFT(data)
    setMarketplace(marketplace)
    setLoading(false)
  }
  async function web3Handler() {
      if (!window.ethereum) {
          alert('Install metamask extention');
          window.location.href = "https://metamask.io/download/"
          return;
      }
      const web3Modal = new Web3Modal({
        network: 'mainnet',
        cacheProvider: true,
      })
      const connection = await web3Modal.connect()
      // // Get provider from Metamask
      const provider = new ethers.providers.Web3Provider(connection)
      // // Set signer
      const signer = provider.getSigner()
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0])
      const balance = await provider.getBalance(accounts[0])
      const balances = ethers.utils.formatEther(balance);
      console.log(balances);
      setBalance(balances)
      window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
      })
      window.ethereum.on('accountsChanged', async function (accounts) {
          setAccount(accounts[0])
          await web3Handler()
          window.location.reload(true)
      })
      loadContracts(signer)
      window.location.reload(true)
  };

  useEffect(() => {
    const url = "http://65.2.143.196/anadev/dpp-pro/wp-json/buddyx/v2/nft-categories";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setCategories(json.data)
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
    // loadContracts()
}, []);

  useEffect(() => {
      if (!!localStorage.getItem('account')) {
          (async () => {
              const account = localStorage.getItem('account');
              setAccount(account)
              const web3Modal = new Web3Modal({network: 'mainnet', cacheProvider: true})
              const connection = await web3Modal.connect()
              // // Get provider from Metamask
              const provider = new ethers.providers.Web3Provider(connection)
              // // Set signer
              const signer = provider.getSigner()
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              setAccount(accounts[0])
              const balance = await provider.getBalance(accounts[0])
              const balances = ethers.utils.formatEther(balance);
              setBalance(balances)
              const marketplace = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
              setMarketplace(marketplace)
              const data = await marketplace.fetchMarketItems()
              setNFT(data)
              setIsLoading(true)
          })();
      }else if (window.ethereum) {
        (async () => {
          const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/")
          const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
          setMarketplace(contract)
          const data = await contract.fetchMarketItems()
          setNFT(data)
          setIsLoading(true)
        })();
      }else {
        (async () => {
          const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/")
          const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
          setMarketplace(contract)
          const nft = await contract.fetchItemsListed()
          setNFT(nft)
          setIsLoading(true)
        })();
      }
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
      if (!!account) {
        // web3Handler()
          localStorage.setItem('account', account);
      }
  }, [account]);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* <Schedule
        jobs={jobs}
        timeZone='UTC'
        // "UTC", "local" or "YOUR PREFERRED TIMEZONE",
          dashboard={{
            hidden: true
            // if true, dashboard is hidden
          }}
      /> */}
        <div className="container-fluid shadow_header">
          <Header web3Handler={web3Handler} account={account} />
        </div>
        <div>
            <Routes>
              <Route path="/" element={<Home loading={loading} />} />
              {/*<Route path="/create" element={<CreateNft  />} />*/}
              <Route path="/" element={<Home  loading={loading} />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/explore" element={<Explores web3Handler={web3Handler} />} />
              <Route path="/all-neft" element={<AllNEFT web3Handler={web3Handler} />} />
              <Route path="/buy-neft-detail/:id" element={<BuyNEFTDetails web3Handler={web3Handler} />} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/create" element={<ProtectedRoute><Create web3Handler={web3Handler}  /></ProtectedRoute>} />
              <Route path="/on-auction-neft-detail/:id" element={<AuctionDetails />} /> 
              <Route path="/my-sold/nfts" element={<ProtectedRoute><MySoldNFTs /></ProtectedRoute>} />
              <Route path="/my-listed/nfts" element={<ProtectedRoute><MyListedNFTs /></ProtectedRoute> } />
              <Route path="/subscribe" element={<PrivateRoute><Subscribe /></PrivateRoute>} />
              <Route path="/my-purchases/nfts" element={<ProtectedRoute><MyPurchasesNFTs /></ProtectedRoute>} />
              <Route path="/my-auction/sell" element={<ProtectedRoute><CreateSellNFTs /></ProtectedRoute>} />
            </Routes>
        </div>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
