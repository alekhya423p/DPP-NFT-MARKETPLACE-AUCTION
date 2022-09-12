import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { NftContext } from '../../../../NftContext/NftProvider';
import axios from 'axios';
import { ethers } from "ethers"
import ReactPlayer from 'react-player'
import Loading from '../../../Loading';
import { toast } from 'react-toastify';
const AuctionNEFTDetails = () => {
    const { marketplace, account, isLoading } = useContext(NftContext);

    const [loading, setLoading] = useState(false)
    const params = useParams()
    const [nftData, setNftData] = useState({});
    const [bidAmount, setBidAmmount] = useState('')

    
    const loadMarketplaceItems = async () => {
        // Load all unsold items
        const data = await marketplace.fetchMarketItems()
            await Promise.all(data.map(async i => {
            const tokenUri = await marketplace.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            if (i.tokenId.toNumber() === parseInt(params.id)) {
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
                    bannerFileType: meta?.data?.bannerFileType,
                    bannerFileUrl: meta?.data?.bannerFileUrl,
                }
                setNftData(item)
                setLoading(false)
            }
        }))
    }
    useEffect(() => {
        if (isLoading) {
            // loadMarketplaceItems()
        }
    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    const placeBid = async (nft) => {
        // if (!account) {
        //     props.web3Handler();
        // }else {
            /* user will be prompted to pay the asking proces to complete the transaction */
            // let response = contract.methods.placeBid(itemId).send({from: account, value: bidAmount});
            const price = ethers.utils.parseUnits(bidAmount.toString(), 'ether')   
            const transaction = await marketplace.placeBid(nft.tokenId, {from: account, value: price })
            await transaction.wait()
            toast.success('NFTs has been buy successfully');
        // }
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
                                <label>Created by <a href="/#">BC19FF</a></label>
                                <p>A test NFT dispensed from faucet.paradigm.xyz.</p>
                            </div>
                            <div className="accordion" id="accordionExample1">
                                <div className="card myacco answer-group bg-transparent border-radius-10 border-0 ">
                                    <div className="" id="headingtwo">
                                    <h2 className="collapsed " data-toggle="collapse" data-target="#collapse-2" aria-expanded="true" aria-controls="collapse-2"><i className="fas fa-list-alt"></i> Details <i className="fa arrow-expand" aria-hidden="true"></i></h2>
                                    </div>
                                    <div id="collapse-2" className="collapse border-top" aria-labelledby="headingtwo" data-parent="#accordionExample1">
                                        <div className="detail_item card-body">
                                            <div>Contract Address <span><a href="/#">0xf5de...3a2b</a></span></div>
                                            <div>Token ID <span><a href="/#">823770</a></span></div>
                                            <div>Token Standard <span>ERC-721</span></div>
                                            <div>Blockchain <span>Rinkeby</span></div>
                                            <div>Creator Fees <span>0.1%</span></div>
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
                                    <button><i className="far fa-redo-alt"></i></button>
                                    <button><i className="fas fa-share-alt"></i></button>
                                    <button><i className="fas fa-ellipsis-v"></i></button>
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
                                    {/* <span><i className="far fa-clock"></i> Sale ends May 27, 2022 at 5:53am GMT+5:30 </span> */}
                                    {/* <label className="float-right"><span><i className="far fa-question-circle"></i></span></label> */}
                                </div>
                                <div className="current_price">
                                    <span>Top bid</span>
                                    <p><i className="fab fa-ethereum text-grey"></i> <b>{nftData.price}</b><i className="fas fa-arrow-alt-circle-right"></i></p>
                                    <div>
                                        <input type="number" min={0} value={bidAmount} onChange={(e) => setBidAmmount(e.target.value)} id="bidAmount" name="bidAmount" className="form-control" />
                                        
                                        <button onClick={() => placeBid(nftData)} className="btn btn-lg mt-3 p-3 custom-color-bttn text-white px-5"><i className="fas fa-wallet"></i> Place bid</button>
                                    </div>
                                </div>
                            </div>
                            <div className="listbx_detail">
                                <div className="accordion" id="accordionExampleone2">
                                    <div className="card myacco answer-group border-radius-10 ">
                                        <div className="p-2" id="headingOne2">
                                        <h2 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapseOne2" aria-expanded="false" aria-controls="collapseOne2"><i className="fas fa-tag"></i> Listing <i className="fa arrow-expand" aria-hidden="true"></i></h2>
                                        </div>
                                        <div id="collapseOne2" className="collapse" aria-labelledby="headingOne2" data-parent="#accordionExampleone2">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Price</th>
                                                            <th>USD Price</th>
                                                            <th>Expiration</th>
                                                            <th>From</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><i className="fab fa-ethereum text-grey"></i> 0.1 ETH</td>
                                                            <td>$40.56</td>
                                                            <td>about 11 hours</td>
                                                            <td><a href="/#">SepLord </a></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
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