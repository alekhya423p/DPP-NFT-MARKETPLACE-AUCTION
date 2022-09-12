
import React, { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import market from '../market.png'
import { NftContext } from '../../NftContext/NftProvider';
import axios from 'axios';
import { ethers } from "ethers"
const Header = ({ web3Handler }) => {
    const { account, currentUser,isLoading, marketplace, setAccount, setCurrentUser } = useContext(NftContext);
    const [items, setItems] = useState([]);
    const [isSearch, setSearch] = useState(false);
    const [nftData, setNftData] = useState([]);
    const [inputSearch, setInputSearch] = useState('');


     const loadMarketplaceItems = async () => {
        // Load all unsold items
        const data = await marketplace.fetchMarketItems()
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await marketplace.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            var bidPrice = 0;
            var isExpireStatus = false;
            if (meta?.data?.status === 'on_auction' && i.bidAmounts?.length > 0) {
                let lastBid =  i.bidAmounts?.length
                let getLateastBid = i.bidAmounts[lastBid - 1];
                bidPrice = ethers.utils.formatUnits(getLateastBid?.toString(), 'ether')
                let date = new Date(meta?.data?.created_at).toISOString();
                const date1 = new Date();
                const date2 = new Date(date);
                var diff = Math.round(Math.abs(date1.getTime() - date2.getTime()) / 3600000);
                var duration = meta.data.duration;
                if (duration < diff) isExpireStatus = true;
            }
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
                fileType: meta?.data.fileType,
                category: meta?.data.category,
                posterFileType: meta?.data?.posterFileType,
                posterFileUrl: meta?.data?.posterFileUrl,
                bidPrice: bidPrice,
                status: meta?.data?.status,
                duration: meta?.data?.duration || 0,
                isExpired: isExpireStatus,
            }
            return item
        }))
        setNftData(items)
        setItems(items)
    }
   

    useEffect(() => {

        if (isLoading) {
            loadMarketplaceItems()
        }
    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    const logout = () => {
        setAccount('')
        // localStorage.clear()
        localStorage.removeItem('account')
        window.location.reload(true)
    }
    const logoutHandler = () => {
        setAccount('')
        setCurrentUser('');
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.reload(true)
    }

    const handleSearch = (searchText) => {
        setInputSearch(searchText)
        if (searchText) {
            const data = nftData.filter(function(item){
                if(item.name) {
                    return item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
                } else {
                    return '';
                }
            });
            console.log(nftData);
            setSearch(true)
            setItems(data);
        } else {
            setItems([]);
        }
    };

    const makeActive = () => {
        setInputSearch('')
        setSearch(false)       
    }
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand logo_box" to="/"><img src={market} alt='logo' /></Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="form-group tp_search">
                    <span><i className="fas fa-search"></i></span>
                    <input type="text" value={inputSearch} className="form-control" onChange={(e) => handleSearch(e.target.value)} placeholder="Search..." />
                    {isSearch && items.length > 0 ?
                    <ul id="myUL" className='dropdown_lists'>
                        {items && items.map((item, index) => (
                        <li key={index} onClick={() => makeActive()}>
                            <Link to={item?.status === 'on_auction' ? `/on-auction-neft-detail/${item.tokenId}` : `/buy-neft-detail/${item.tokenId}`}>
                                <div className='image_users'>
                                {item?.fileType === 'video/mp4' ?
                                    <video id="nft-video" canplaythrough="true" muted controls autoPlay width="100px" height='50px'>
                                        <source src={item?.image} />
                                    </video>
                                :
                                    <img src={item?.image} alt={item.name} />
                                }
                                 </div>
                                <div className='name_user'><p className='mb-0'>{item.name} <i className="fas fa-badge-check blue-colors" ></i></p>
                                    <small>{items?.length} items</small>
                                </div>
                                <div className='name_tooltip'>
                                    <i className="fab fa-ethereum" data-toggle="edit an item" title="Edit an item"></i>
                                </div>
                            </Link>
                        </li>
                        ))}
                        
                    </ul>
                    : '' }

                </div>

                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ml-md-auto  d-md-flex">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://diversityproduction.pro/about/">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://diversityproduction.pro/course/">Courses</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://diversityproduction.pro/careers/">Job Board</a>
                        </li>
                        <li className="nav-item dropdown">  
                            <a className="nav-link dropdown-toggle" href="https://diversityproduction.pro/shop-categories/" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Shop
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                               
                                <a className="dropdown-item" href="https://diversityproduction.pro/product-category/crew/">Crew</a>
                                <a className="dropdown-item" href="https://diversityproduction.pro/product-category/film-nerd/">Film Nerd</a>
                                <a className="dropdown-item" href="https://diversityproduction.pro/product-category/customizable/">Customizable</a>
                            </div>
                        </li>
                        <li className="nav-item"><a className="nav-link" href="https://diversityproduction.pro/the-diversity-production-pro-reports/">Report</a></li>
                        <li className="nav-item"><a className="nav-link" href="https://diversityproduction.pro/the-diversity-production-pro-reports/">Contact</a></li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Explore
                            </Link>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                <Link className="dropdown-item" to="/explore">Explore</Link>
                                <Link className="dropdown-item" to="/all-neft">All NFTs</Link>
                                {/* <!--  <Link className="dropdown-item" to="#">Film Nerd</Link> --> */}
                            </div>
                        </li>
                        {currentUser ? <></>: <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li> }
                   
                        {currentUser ?
                            <li className="nav-item dropdown profile_top user-link-wrap">
                        
                                <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src={currentUser.image} className='user_avtar' width={30} height={30}></img>
                                &nbsp; <span className="bp-user">{currentUser.first_name}</span>
                                </Link>
          
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                                    <Link className="dropdown-item" to="/profile"><i className="fas fa-user"></i> Profile</Link>
                                     {account ? (
                                     <>
                                     <span className="dropdown-item"><a href={`https://etherscan.io/address/${account}`} target="_blank" rel="noopener noreferrer" className='text-dark' ><i className="fa fa-link" aria-hidden="true"></i> {account.slice(0, 5) + '...' + account.slice(38, 42)}</a></span>
                                     <a onClick={logout} className="dropdown-item"  href='#'><i className="fa fa-sign-out-alt fa-fw"></i> Disconnect </a>
                                     </>) : (
                                    <span className="nav-item"> <a onClick={web3Handler} className="dropdown-item" href='#'><i className="fa fa-user-plus fa-fw"></i> Connect Wallet </a></span>)}
                                    {account ? <>
                                    <Link className="dropdown-item" to="/create"><i className="fas fa-plus-circle"></i> Create NFTs</Link>
                                    <Link className="dropdown-item" to="/my-purchases/nfts"><i className="far fa-heart"></i> My Purchases NFTs</Link>
                                    <Link className="dropdown-item" to="/my-auction/sell"><i className="far fa-heart"></i> Create Auction NFTs</Link>
                                    <Link className="dropdown-item" to="/my-listed/nfts"><i className="fas fa-eye"></i> My Listed NFTs</Link>
                                    {/* <Link className="dropdown-item" to="/my-sold/nfts"><i className="fas fa-th"></i> My Sold NFTs</Link> */}
                                    </> : <></>}
                                    <Link className="dropdown-item" to="/subscribe"><i className="fa fa-rocket" ></i> Subscribe </Link>
                                    <Link className="dropdown-item" onClick={logoutHandler} to="/#"> <i className="fa fa-sign-out"></i> Logout</Link>
                                </div>
                            </li>
                            : ''}
                    </ul>
                </div>
            </nav>
        </>
    )

}

export default Header;