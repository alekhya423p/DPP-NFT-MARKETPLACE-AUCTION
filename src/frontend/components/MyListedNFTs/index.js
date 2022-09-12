import React, { useContext, useState, useEffect } from 'react'
import { NftContext } from '../../NftContext/NftProvider';
import NFTsItem from './NFTsItem'
import Loading from '../Loading/index'
import { ethers } from 'ethers';
import axios from 'axios';
import { useNavigate } from 'react-router';

const MyListedNFTs = () => {
    const navigate = useNavigate();
    const [nftData, setNftData] = useState([])
    const { marketplace, isLoading, account } = useContext(NftContext);
    const [loading, setLoading] = useState(true)

    const loadListedItems = async () => {
        // Load all sold items that the user listed
        const data = await marketplace.fetchItemsListed()
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await marketplace.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            var bidPrice = 0;
            var isExpireStatus = false;
            if ( meta?.data?.status === 'on_auction' && i.bidAmounts?.length > 0) {
                let lastBid =  i.bidAmounts?.length
                let getLateastBid = i.bidAmounts[lastBid - 1];
                bidPrice = ethers.utils.formatUnits(getLateastBid?.toString(), 'ether')
                let date = new Date(meta?.data?.created_at).toISOString();
                // let convertDate = date.substring(0, date.length - 1);
                const date1 = new Date();
                const date2 = new Date(date);
                var diff = Math.round(Math.abs(date1.getTime() - date2.getTime()) / 3600000);
                var duration = meta.data.duration;
                if (duration < diff) isExpireStatus = false;
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
            setNftData([...nftData, item])
            return item
        }))
        setLoading(false)
        setNftData(items)
    }
 
    useEffect(() => {
        if (!account) {
            navigate('/')
        }
        if(isLoading){
            loadListedItems()            
        }
    }, [isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return  <Loading />;
    }
    return (
        <>
            <div className="container">
                <div className="page_heading top_margin text-center">
                    <h1>My Listed NFTs</h1>
                </div>
            </div>
            <div className="explore_boxes">
                <div className="container my_container">
                    {nftData.length > 0 ? 
                    <div className="row">
                    {nftData.map((item, idx) => (
                        <NFTsItem key={idx} data={item} marketplace={marketplace}  />
                    ))}
                    </div>
                    : (
                        <div className="col-12 col-sm-12 col-md-12">
                            <div className=" mx-1 mb-3">
                                <div className="card-body">
                                    <p className="text-center type-6 my-0">No Listed NFTs found...</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
export default MyListedNFTs