import React, {useContext} from 'react'
import { ethers } from "ethers"
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import { NftContext } from '../../../NftContext/NftProvider';
import { toast } from "react-toastify";
const Explore = (props) => {
    const { marketplace, account } = useContext(NftContext);

    const buyMarketItem = async (nft) => {
        console.log('working' , account);
        if (!account) {
            props.web3Handler();
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
            <div className="col-md-4">
                <div className="explore_inside">
                    <div className="explore_banner">
                        {props?.data?.posterFileType === 'video/mp4' ?
                            <div className='player-wrapper'>
                            <Link to={props?.data?.status === 'on_auction' ? `/on-auction-neft-detail/${props?.data.tokenId}` : `/buy-neft-detail/${props?.data.tokenId}`}>
                                <ReactPlayer
                                    className='react-player'
                                    url={props?.data?.posterFileUrl}
                                    width='100%'
                                    playing={true}
                                    controls={true}
                                    loop={true}
                                    playsinline={true}
                                    muted={true}
                                    height='100%'
                                />
                            </Link>
                            </div> :
                            <>
                              <Link to={props?.data?.status === 'on_auction' ? `/on-auction-neft-detail/${props?.data.tokenId}` : `/buy-neft-detail/${props?.data.tokenId}`}><img src={props?.data?.posterFileUrl} alt={props?.data.name} /></Link>
                            </>
                        }
                        <div className="explore_cirle">
                        {props?.data?.posterFileType === 'video/mp4' ?
                            <img src='https://redzonekickboxing.com/wp-content/uploads/2017/04/default-image.jpg' alt={props?.data.name} />
                            :
                            <img src={props?.data?.posterFileUrl} alt={props?.data.name} />
                        }
                    </div>
                    </div>
                    <div className="explore_content">
                        <h6>{props?.data?.name}</h6>
                        <small>by <a href='/#'>{props?.data?.name}</a> <i className="fas fa-badge-check"></i></small>
                        <p>{props?.data?.description}</p>
                        {props.data.status === 'on_auction'? 
                        !props?.data?.isExpired ? <Link to={`/on-auction-neft-detail/${props?.data.tokenId}`} className='btn btn-primary'>Bid Now { props?.data.bidPrice > 0 ? props?.data.bidPrice : props?.data?.price} ETH </Link> : null 
                        :
                        <button type='button' onClick={() => buyMarketItem(props?.data)} className='btn btn-primary'>Buy for {props?.data?.price} ETH</button>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
export default Explore