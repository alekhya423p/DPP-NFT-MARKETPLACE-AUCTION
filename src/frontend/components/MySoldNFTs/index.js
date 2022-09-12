import React, { useContext, useState, useEffect } from 'react'
// import { ethers } from "ethers"
import { NftContext } from '../../NftContext/NftProvider';
import NFTsItem from './NFTsItem'
import Loading from '../Loading';
import axios from 'axios';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
const MySoldNFTs = () => {
    const navigate = useNavigate()
    const { marketplace, isLoading, account } = useContext(NftContext);
    // const [listedItems, setListedItems] = useState([])
    // const [soldItems, setSoldItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [nftData, setNftData] = useState([])
    
    async function loadNFTs() {
        /* create a generic provider and query for unsold market items */
        const data = await marketplace.fetchsoldItems()
        /*
        *  map over items returned from smart marketplace and format 
        *  them as well as fetch their token metadata
        */
        const items = await Promise.all(data.map(async i => {
          const tokenUri = await marketplace.tokenURI(i.tokenId)
            console.log(tokenUri);

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
          }
          return item
        }))
        setNftData(items)
        setLoading(false) 
      }
    useEffect(() => {
        if (!account) {
            navigate('/')
        }
        if (isLoading) {
            loadNFTs()
        }
    }, [isLoading,account]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return <Loading />;
    }
    return (
        <>
            <div className="container">
                <div className="page_heading top_margin text-center">
                    <h1>My Sold NFTs</h1>
                </div>
            </div>
            <div className="explore_boxes">

                <div className="container my_container">
                    {nftData.length > 0 ?
                        <div className="row">
                            {nftData.map((item, idx) => (
                                <NFTsItem key={idx} data={item} marketplace={marketplace} loadSoldItems={loadNFTs} />
                            ))}

                        </div>
                        : (
                            <div className="col-12 col-sm-12 col-md-12">
                                <div className=" mx-1 mb-3">
                                    <div className="card-body">
                                        <p className="text-center type-6 my-0">No Sold NFTs found...</p>
                                    </div>
                                </div>
                            </div>
                        )}

                </div>

            </div>

        </>
    );
}
export default MySoldNFTs