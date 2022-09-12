import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { NftContext } from '../../../../NftContext/NftProvider';
import axios from 'axios';
import { ethers } from "ethers"
import ReactPlayer from 'react-player'
import Loading from '../../../Loading';
import { toast } from 'react-toastify';
import moment from 'moment';
const AuctionNEFTDetails = () => {
    const { marketplace, account, isLoading } = useContext(NftContext);

    const [loading, setLoading] = useState(true)
    const params = useParams()
    const [nftData, setNftData] = useState({});
    const [bidAmount, setBidAmmount] = useState('')
    const [error, setError] = useState('')
    const [date, setDate] = useState(new Date())
    const [expiredDate, setExpiredDate] = useState('')
    const [duration, setDuration] = useState('')

    
    const loadMarketplaceItems = async () => {
        // Load all unsold items
        const data = await marketplace.fetchMarketItems()
            await Promise.all(data.map(async i => {
            const tokenUri = await marketplace.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

            var bidPrice = 0;
            var isExpireStatus = false;
            if (meta?.data?.status === 'on_auction' && i.bidAmounts?.length >= 0) {
                if (i.bidAmounts?.length > 0) {
                    let lastBid =  i.bidAmounts?.length
                    let getLateastBid = i.bidAmounts[lastBid - 1];
                    bidPrice = ethers.utils.formatUnits(getLateastBid?.toString(), 'ether')
                }
                let date = new Date(meta?.data?.created_at).toISOString();
                // let convertDate = date.substring(0, date.length - 1);
                // const date1 = new Date();
                // const date2 = new Date(date);
                // var diff = Math.round(Math.abs(date1.getTime() - date2.getTime()) / 3600000);
                var oldDate = new Date(date)
                const newDate = new Date()
                const msToTime = (ms) => ({
                    hours: Math.trunc(ms/3600000),
                    minutes: Math.trunc((ms/3600000 - Math.trunc(ms/3600000))*60) + ((ms/3600000 - Math.trunc(ms/3600000))*60 % 1 != 0 ? 1 : 0)
                })
                const { hours } = msToTime(Math.abs(newDate-oldDate))
                var duration = meta.data.duration;
                if (duration <= hours) isExpireStatus = true;
            }
            
            if (i.tokenId.toNumber() === parseInt(params.id)) {
                setDuration(duration)
                setDate(oldDate)
                let bidList = [];
                let biderList = [];
                if (i.bidAmounts?.length > 0) {
                    bidList.push(i.bidAmounts)
                    biderList.push(i[10])
                }
                console.log(biderList);
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
                    created_at: meta?.data?.created_at,
                    bids: bidList,
                    biders: biderList,
                }
                setNftData(item)
                setLoading(false)
            }
        }))
    }
    useEffect(() => {
        if (isLoading) {
            loadMarketplaceItems()
        }
    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {
        if (nftData) {
           // Set the date we're counting down to
           // var countDownDate = date.setHours(duration);
           // var currentHour = date.getHours()
           let canvertDate = date.toISOString();
           var momentDateConvert = moment(canvertDate).add(duration, 'hours').toLocaleString();
           // let date = ne
           var countDownDate = new Date(momentDateConvert).getTime();
            // Update the count down every 1 second
            var x = setInterval(function() {
                var now = new Date().getTime();
                var distance = countDownDate - now;
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setExpiredDate(days + "d " + hours + "h " + minutes + "m " + seconds + "s ")
                if (distance < 0) {
                    clearInterval(x);
                }
            }, 1000); 
        }
        
    },[nftData])

    const placeBid = async (nft) => {
        if (nft.bidPrice < bidAmount && nft.price < bidAmount) {
          // if (!account) {
            //     props.web3Handler();
            // }else {
                /* user will be prompted to pay the asking proces to complete the transaction */
                setError('')
                const price = ethers.utils.parseUnits(bidAmount.toString())   
                const transaction = await marketplace.bid(nft.tokenId,{
                    value: price
                })
                await transaction.wait()
                toast.success('bidding has been done successfully');
                window.location.reload(true)
            // }
        }else {
            setError('Please Enter high bid ammount')
        }
       
    }

    if (loading) {
        return <Loading />;
    }
    return (
        <>
            <div className="container container margin_top py-3">
                <div className="row">
                    <div className="col-md-5">
                        <div className="item_detail">
                            <div className="item_header flex-headers pb-0">
                                <p><i className="fab fa-ethereum text-grey"></i> </p>
                                <span><i className="far fa-heart"></i> 0</span>
                            </div>
                            <div className="item_image explore_banner h_100">
                                {nftData.posterFileType === 'video/mp4' ?
                                     <div className='player-wrapper'>
                                    {/* <video id="nft-video" canplaythrough="true" muted controls autoPlay width="100%" height='100%'>
                                        <source src={nftData.image} />
                                    </video> */}
                                        <ReactPlayer
                                            className='react-player'
                                            url={nftData?.posterFileUrl}
                                            width='100%'
                                            playing={true}
                                            controls={true}
                                            loop={true}
                                            playsinline={true}
                                            muted={true}
                                            height='100%'
                                        />
                                    </div>
                                     :
                                    <>
                                    <img src={nftData.posterFileUrl}  alt={nftData.name} className="img-fluid" />
                                    </> 
                                } 
                            </div>
                        </div>
                        <div className="discrp_main">
                            <div className="discp_inside">
                                <span><p><i className="far fa-stream"></i> {nftData.description}</p></span>
                            </div>
                            <div className="discp_inside">
                                <label>Created by <a href="/#">{nftData.seller}</a></label>
                            </div>
                            <div className="accordion" id="accordionExample1">
                                <div className="card myacco answer-group bg-transparent border-radius-10 border-0 ">
                                    <div className="" id="headingtwo">
                                    <h2 className="collapsed " data-toggle="collapse" data-target="#collapse-2" aria-expanded="true" aria-controls="collapse-2"><i className="fas fa-list-alt"></i> Details <i className="fa arrow-expand" aria-hidden="true"></i></h2>
                                    </div>
                                    <div id="collapse-2" className="collapse border-top" aria-labelledby="headingtwo" data-parent="#accordionExample1">
                                        <div className="detail_item card-body">
                                            <div>Contract Address <span><a href="/#">0xf5de...3a2b</a></span></div>
                                            <div>Token ID <span><a href="/#">{nftData.tokenId}</a></span></div>
                                            <div>Token Standard <span>ERC-721</span></div>
                                            <div>Blockchain <span>Polygon</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <form>
                            <div className="top_multifact">
                                <p><a href="/#">{nftData.name} - q55YxxItOz</a></p>
                                <div className="top_share_btn">
                                    <button type='button'>{expiredDate}</button>
                                </div>
                            </div>
                            <div className="page_heading_left">
                                <h2>{nftData.name}</h2>
                            </div>
                            <div className="owned_box">
                                {/* <ul className='p-0'>
                                <li>Owned by <a href="/#">SepLord</a></li>
                                <li><span><i className="fas fa-eye"></i> 17 views</span>
                                </li>
                                </ul> */}
                            </div>
                            <div className="sale_price">
                                <div className="sale_inside d-flex pb-4">
                                    <span>Top bid</span>
                                    <p><i className="fab fa-ethereum text-grey"></i> <b>{ nftData.bidPrice > 0 ? nftData.bidPrice : nftData.price}</b><i className="fas fa-arrow-alt-circle-right"></i></p>
                                </div>
                                <div className="current_price">
                                    {!nftData?.isExpired ? 
                                    <div className='row'>
                                        <div className='col-md-4'>
                                        <input type="number" min={0} value={bidAmount} onChange={(e) => setBidAmmount(e.target.value)} placeholder='Bid Amount' id="bidAmount" name="bidAmount" className="form-control" />
                                        <p className="text-danger">{error}</p>
                                        </div>
                                        <div className='col-md-6'>
                                        <button type='button' onClick={() => placeBid(nftData)} className="btn btn-lg p-1 custom-color-bttn text-white px-5"><i className="fas fa-wallet"></i> Place bid</button>

                                        </div>
                                        <div className='col-md-2'></div>
                                        
                                    </div>
                                    : null }
                                </div>
                            </div>
                            <div className="listbx_detail">
                                <div className="accordion" id="accordionExampleone2">
                                    <div className="card myacco answer-group border-radius-10 mt-2">
                                        <div className="p-2" id="headingOne2">
                                        <h2 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapseOne2" aria-expanded="false" aria-controls="collapseOne2"><i className="fas fa-tag"></i> Listing <i className="fa arrow-expand" aria-hidden="true"></i></h2>
                                        </div>
                                        <div id="collapseOne2" className="collapse" aria-labelledby="headingOne2" data-parent="#accordionExampleone2">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Price</th>
                                                            <th>Expiration</th>
                                                            <th>From</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                          nftData.bids[0] && nftData.bids[0].length > 0 &&  nftData?.bids[0].map((item, index) => (
                                                            <tr key={index}>
                                                                {/* <td><i className="fab fa-ethereum text-grey"></i> {console.log(item)} ETH</td> */}
                                                                <td><i className="fab fa-ethereum text-grey"></i> {ethers.utils.formatUnits(item.toString(), 'ether')} ETH</td>
                                                                <td>{moment(nftData.created_at).add(duration, 'hours').format('DD-MM-yyyy hh:mm:ss A')}</td>
                                                                <td><a href="#">{ nftData?.biders && nftData?.biders[0] && nftData?.biders[0][index] ? nftData?.biders[0][index].slice(0,7) +'...'+ nftData?.biders[0][index].slice(-4) : null} </a></td>
                                                            </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                </table>
                                                        {nftData.bids.length <= 0 && (
                                                            <div className="col-12 col-sm-12 col-md-12">
                                                                 <p className="text-center type-6 my-0">No Bids collections found...</p>
                                                            </div>
                                                        )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AuctionNEFTDetails