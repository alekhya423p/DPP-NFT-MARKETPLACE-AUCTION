
import React, { useContext, useState, useEffect } from 'react'
import { ethers } from "ethers"
import { NftContext } from '../../NftContext/NftProvider';
import Filter from './components/Filter';
import Loading from '../Loading';
import axios from 'axios';
import ItemNFT from './components/ItemNFT'
const AllNEFT = ({ web3Handler }) => {
    const { marketplace, isLoading } = useContext(NftContext);
    // const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    const [nftData, setNftData] = useState([]);
    const [loader, setLoader] = useState(false);

    const loadMarketplaceItems = async () => {
        // Load all unsold items
        const data = await marketplace.fetchMarketItems()
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await marketplace.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            var bidPrice = 0;
            var isExpireStatus = false;
            if ( meta?.data?.status === 'on_auction' && i.bidAmounts?.length >= 0) {
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
                const oldDate = new Date(date)
                const newDate = new Date()
                const msToTime = (ms) => ({
                    hours: Math.trunc(ms/3600000),
                    minutes: Math.trunc((ms/3600000 - Math.trunc(ms/3600000))*60) + ((ms/3600000 - Math.trunc(ms/3600000))*60 % 1 != 0 ? 1 : 0)
                })
                const { hours } = msToTime(Math.abs(newDate-oldDate))
                var duration = meta.data.duration;
                if (duration <= hours) isExpireStatus = true;
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
        setItems(items)
    }

    // const handleSearch = () => {
    //     if (searchText) {
    //         const data = nftData.filter(val => val.name.includes(searchText) || val.description.includes(searchText) || searchText.includes(val.name) || searchText.includes(val.description));
    //         setItems(data);
    //     } else {
    //         setItems(nftData);
    //     }
    // };

    useEffect(() => {
        if (isLoading) {
            loadMarketplaceItems()
        }
    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps
   
    const sortFilterHandler = (e) => {
        const sortFlag = e.target.value === 'true';
        const result = nftData.sort((a, b) => {
            if ((sortFlag && a.price < b.price) || (!sortFlag && a.price > b.price)) {
                return -1;
            }
            if ((sortFlag && a.price > b.price) || (!sortFlag && a.price < b.price)) {
                return 1;
            }
            return 0;
        })
        setNftData(result.map(val => val));
    };
    const handleFilterCategory = (category) => {
        if (category) {
            const data = items.filter(val => val?.category === category);
            setNftData(data);
        } else {
            setNftData(items);
        }
    };
    const handleFilterStatus = (status) => {
        if (status) {
            const data = items.filter(val => val?.status === status);
            setNftData(data);
        } else {
            setNftData(items);
        }
    };
    const handleFilterPrice = (minPrice, maxPrice) => {
        setLoader(true)
        if(minPrice && maxPrice) {
            const data = items.filter(item =>  item.price >= minPrice && item.price <= maxPrice);
            setNftData(data);
            setLoader(false)
        } else {
            setNftData(items);
            setLoader(false)
        }
    };
    if (loading) {
        return <Loading />
    }
    return (
        <>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2 pr-0">
                     <div className='left_side_nfts'>
                        <Filter loader={loader} handleFilterPrice={handleFilterPrice} handleFilterCategory={handleFilterCategory} handleFilterStatus={handleFilterStatus} />
                        </div>
                    </div>
                    <div className="col-md-10 right_side_nfts">
                        <div className="explore_boxes">
                            <div className="container-fluid">
                                <div className="top_filter_section">
                                    <div className="total_items">
                                        <p><i className="far fa-undo"></i> {nftData.length} items</p>
                                    </div>
                                    <div className="top_filter_right">
                                        {/* <div className="single_items">
                                                    <select className="form-control">
                                                        <option>Sinfle items</option>
                                                    </select>
                                                </div> */}
                                        <div className="sort_by">
                                            <select className="form-control" onChange={sortFilterHandler}>
                                                <option value={''}>Sort by</option>
                                                <option value={true}>Low to High</option>
                                                <option value={false}>High to Low</option>
                                            </select>
                                        </div>
                                        {/* <div className="grid_style">
                                                    <span><i className="fas fa-th-large"></i></span>
                                                    <span><i className="fas fa-th"></i></span>
                                                </div> */}
                                    </div>
                                </div>
                                <div className="row">
                                    {nftData.length > 0 && nftData.map((item, idx) => (
                                        <ItemNFT key={idx} data={item} web3Handler={web3Handler} marketplace={marketplace} loadMarketplaceItems={loadMarketplaceItems} />
                                    ))}
                                    {nftData.length <= 0 && (
                                        <div className="col-12 col-sm-12 col-md-12">
                                            <div className="card mx-1 mb-3">
                                                <div className="card-body">
                                                    <p className="text-center type-6 my-0">No NFTs collections found...</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AllNEFT;