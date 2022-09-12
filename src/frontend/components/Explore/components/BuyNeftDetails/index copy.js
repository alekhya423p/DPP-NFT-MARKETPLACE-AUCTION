import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { NftContext } from '../../../../NftContext/NftProvider';
import axios from 'axios';
import { ethers } from "ethers"
import Loading from '../../../Loading';
import ReactPlayer from 'react-player'
import { toast } from 'react-toastify';
const BuyNEFTDetails = ({web3Handler}) => {
    const { marketplace, isLoading, account } = useContext(NftContext);
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const [nftData, setNftData] = useState({ });

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
            loadMarketplaceItems()
        }
    }, [isLoading, params]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return <Loading />;
    }


    const buyMarketItem = async (nft) => {
        if (!account) {
            web3Handler();
        }else {
            /* user will be prompted to pay the asking proces to complete the transaction */
            const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
            const transaction = await marketplace.createMarketSale(nft.tokenId, {
            value: price
            })
            await transaction.wait()
            toast.success('NFTs has been buy successfully');
        }
    }
    return (
        <>
            <div className="container margin_top py-3">
                <div className="row">
                    <div className="col-md-5">
                        <div className="item_detail">
                            <div className="item_header flex-headers">
                                <p className='mb-0'><i className="fab fa-ethereum text-grey"></i> 0.05</p>
                                <span><i className="far fa-heart"></i> 13</span>
                            </div>
                            <div className="item_image explore_banner h_100">
                                {nftData.posterFileType === 'video/mp4' ?
                                    <div className='player-wrapper'>
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
                                        {/* <video id="nft-video" canplaythrough="true" muted controls autoPlay width="100%" height='100%'>
                                            <source src={nftData.image} />
                                        </video> */}
                                    </div> :
                                    <>
                                        <img src={nftData.posterFileUrl} alt={nftData.name} className="img-fluid" />
                                    </>
                                }
                            </div>
                        </div>
                        <div className="discrp_main">
                            <div className="discp_inside">
                                <span><p><i className="far fa-stream"></i> Description</p></span>
                            </div>
                            <div className="discp_inside">
                                <label>Created by <a href="/#">BC19FF</a></label>
                                <p>{nftData.description}</p>
                            </div>



                            <div className="accordion" >
                                <div className="answer-group">


                                    <h2 className="collapsed" data-toggle="collapse" data-target="#collapse-1" aria-expanded="true" aria-controls="collapse-1">


                                        <i className="fas fa-list-alt"></i> Details <i className="fa arrow-expand" aria-hidden="true"></i>

                                    </h2>


                                    <div id="collapse-1" className="collapse border-top" aria-labelledby="headingOne" data-parent="#accordionExample">
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
                                <ul className='p-0'>
                                    <li>Owned by <a href="/#">TestAccount_2 <i className="fas fa-badge-check"></i></a></li>
                                    <li><span><i className="fas fa-eye"></i> 17 views</span></li>


                                </ul>


                            </div>
                            <div className="sale_price">
                                <div className="sale_inside">
                                    <span>Sale ends May 27, 2022 at 5:53am GMT+5:30 </span>
                                    <p id="demo"></p>
                                </div>
                                <div className="current_price">
                                    <span className='text-grey'>Current price</span>
                                    <h4><i className="fab fa-ethereum "></i> <b>{nftData.price}</b></h4>

                                    <div>
                                        <button type='button' onClick={() => buyMarketItem(nftData)} className="btn btn-lg mt-2 p-2 custom-color-bttn text-white px-5"><i className="fas fa-wallet"></i> Buy Now</button>
                                    </div>
                                </div>
                            </div>

                            <div className="listbx_detail mt-4">

                                <div className="accordion" id="accordionExample">
                                    <div className="card myacco answer-group border-radius-10 mt-4 ">
                                        <div className="accordian p-2" id="headingOne">
                                            <h2 className="mb-0" data-toggle="collapse" data-target="#collapseOne2" aria-expanded="true" aria-controls="collapseOne">

                                                <i className="fas fa-tag"></i> Listing <i className="fa arrow-expand" aria-hidden="true"></i>

                                            </h2>
                                        </div>
                                        <div id="collapseOne2" className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Price</th>
                                                            <th>USD Price</th>
                                                            <th>Expiration</th>
                                                            <th>From</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><i className="fab fa-ethereum"></i> 0.1 ETH</td>
                                                            <td>$40.56</td>
                                                            <td>about 11 hours</td>
                                                            <td><a href="/#">TestAccount_2 <i className="fas fa-badge-check"></i></a></td>
                                                            <td>

                                                                <button type="button" className="btn custom-color-bttn text-white btn-outline-primary px-3" data-toggle="modal" data-target="#exampleModal">Buy
                                                                </button>
                                                                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                    <div className="modal-dialog lst_modal" role="document">
                                                                        <div className="modal-content">
                                                                            <div className="modal-header">
                                                                                <h5 className="modal-title" id="exampleModalLabel">Please switch to Rinkeby network</h5>
                                                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                                    <span aria-hidden="true">&times;</span>
                                                                                </button>
                                                                            </div>
                                                                            <div className="modal-body">
                                                                                <p>In order to trade items, please switch to Rinkeby network within your MetaMask wallet.</p>
                                                                                <div className="text-center m-4">
                                                                                    <button className="btn btn-outline-primary cancel_btn">Cancel</button>
                                                                                    <button className="btn btn-primary switch_btn">Switch Network</button>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
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
export default BuyNEFTDetails