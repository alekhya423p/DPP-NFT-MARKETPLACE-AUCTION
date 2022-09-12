import React from 'react'
import { Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
const Explore = (props) => {
    return (
        <>
            <div className="col-md-4">
                <div className="explore_inside">
                    <div className="explore_banner">
                        {props?.data?.fileType === 'video/mp4' ?
                            <div className='player-wrapper'>
                                <Link to={`/buy-neft-detail/${props?.data.tokenId}`}>
                                    <ReactPlayer
                                        className='react-player'
                                        url={props?.data?.image}
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
                                <Link to={`/buy-neft-detail/${props?.data.tokenId}`}><img src={props?.data?.image} alt={props?.data.name} /></Link>
                            </>
                        }
                        <div className="explore_cirle">
                            <Link to={`/on-auction-neft-detail/${props?.data.tokenId}`}>
                                {props?.data?.fileType === 'video/mp4' ?
                                    <img src='https://redzonekickboxing.com/wp-content/uploads/2017/04/default-image.jpg' alt={props?.data.name} />
                                    :
                                    <img src={props?.data?.image} alt={props?.data.name} />
                                }
                            </Link>
                        </div>
                    </div>
                    <div className="explore_content">
                        <h6>{props?.data?.name}</h6>
                        <small>by <a href='/#'>{props?.data?.name}</a> <i className="fas fa-badge-check"></i></small>
                        <p>{props?.data?.description}</p>
                        <button type='button' className='btn btn-primary'>
                            {props?.data?.price} ETH
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Explore