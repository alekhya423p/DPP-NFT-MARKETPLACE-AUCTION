import React, { useContext, useState, useEffect } from 'react'
import { ethers } from "ethers"
import { NftContext } from '../../NftContext/NftProvider';
import Explore from './components/Explore'
import Loading from '../Loading';
import axios from 'axios';

const Explores = ({ web3Handler }) => {

    const { marketplace, isLoading, categories } = useContext(NftContext);
    const [loading, setLoading] = useState(true)
    const [nftData, setNftData] = useState([]);
    const [items, setItems] = useState([]);
    // const [items, setItems] = useState([]);
    // const [searchText, setSearchText] = useState('');

    const loadMarketplaceItems = async () => {
        // Load all unsold items
        const data = await marketplace.fetchMarketItems()
        const items = await Promise.all(data.map(async i => {
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
                // const hours = parseInt(Math.abs(date1 - date2) / (1000 * 60 * 60) % 24);
                var duration = meta.data.duration;

                const oldDate = new Date(date)
                const newDate = new Date()
                const msToTime = (ms) => ({
                    hours: Math.trunc(ms/3600000),
                    minutes: Math.trunc((ms/3600000 - Math.trunc(ms/3600000))*60) + ((ms/3600000 - Math.trunc(ms/3600000))*60 % 1 != 0 ? 1 : 0)
                })
                const { hours } = msToTime(Math.abs(newDate-oldDate));
                // console.log(i.tokenId.toNumber(),date1, date2,duration,hours);
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
    const handleFilterCategory = (category) => {
        if (category) {
            setNftData([])
            const data = items.filter(val => val?.category === category);
            setNftData(data);
        } else {
            setNftData(items);
        }
    };
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


    // useEffect(() => {
    // //    getCategories()
    //     authService.getCategories().then((data) => setCategories(data));
    // }, []);
    
    // const sortFilterHandler = (e) => {
    //     const sortFlag = e.target.value === 'true';
    //     const items1 = items.sort((a, b) => {
    //         if ((sortFlag && a.price < b.price) || (!sortFlag && a.price > b.price)) {
    //             return -1;
    //         }
    //         if ((sortFlag && a.price > b.price) || (!sortFlag && a.price < b.price)) {
    //             return 1;
    //         }
    //         return 0;
    //     })
    //     setItems(items1.map(val => val));
    // };


// console.log(nftData);

    if (loading) {
        return <Loading />
    }
    return (
        <>
            <>
                <div className="container">
                    <div className="page_heading top_margin text-center">
                        <h1>Explore Collections</h1>
                    </div>
                </div>

                <div className="container-fluid">

                    <div className="explore_tabs">
                        <ul>
                            <li><button className='btn btn-sm active_tab' onClick={() => handleFilterCategory('')} >ALL</button></li>
                            {categories && categories.map((item, index) => (
                               <li key={index}><button className='btn btn-sm active_tab' onClick={() => handleFilterCategory(item.slug)} >{item.name}</button></li>
                            ))}
                        </ul>
                    </div>

                </div>


                <div className="explore_boxes">

                    <div className="container my_container">
                        {nftData.length > 0 ?
                            <div className="row">
                                {nftData.map((item, idx) => (
                                    <Explore key={idx} data={item} web3Handler={web3Handler} marketplace={marketplace} loadMarketplaceItems={loadMarketplaceItems} />
                                ))}

                            </div>
                            : (
                                <div className="col-12 col-sm-12 col-md-12">
                                    <div className=" mx-1 mb-3">
                                        <div className="card-body">
                                            <p className="text-center type-6 my-0">No NFTs collections found...</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                    </div>

                </div>
            </>

        </>
    );
}
export default Explores