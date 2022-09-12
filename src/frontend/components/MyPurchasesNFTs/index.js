import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router';
import Loading from '../Loading';
import NFTsItem from './NFTsItem'
import { NftContext } from '../../NftContext/NftProvider';

const MyPurchasesNFTs = () => {
    const navigate = useNavigate();
    const { marketplace, isLoading, account } = useContext(NftContext);
    const [loading, setLoading] = useState(true)
    const [nftData, setNftData] = useState([])
    // const [searchText, setSearchText] = useState('');

    const loadMarketplaceItems = async () => {
        const data = await marketplace.fetchMyNFTs()
        const items = await Promise.all(data.map(async i => {
            const tokenUri = await marketplace.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
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
        if (isLoading) {
            loadMarketplaceItems()
        }
    }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) return (
        <Loading />
    )
    return (
        <>
            <div className="container">
                <div className="page_heading top_margin text-center">
                    <h1>My Purchases NFTs</h1>
                </div>
            </div>
            <div className="explore_boxes">
                <div className="container my_container">
                    {nftData.length > 0 ?
                        <div className="row">
                            {nftData.map((item, idx) => (
                                <NFTsItem key={idx} data={item} marketplace={marketplace} loadMarketplaceItems={loadMarketplaceItems} />
                            ))}
                        </div>
                        : (
                            <div className="col-12 col-sm-12 col-md-12">
                                <div className=" mx-1 mb-3">
                                    <div className="card-body">
                                        <p className="text-center type-6 my-0">No Purchases NFTs found...</p>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </>
    );
}
export default MyPurchasesNFTs