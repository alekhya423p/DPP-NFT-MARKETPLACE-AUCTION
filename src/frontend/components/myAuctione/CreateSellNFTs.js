import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NftContext } from '../../NftContext/NftProvider'
import { ethers } from "ethers"
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Web3Storage } from 'web3.storage'
import { toast } from 'react-toastify'
import { Buffer } from "buffer";

import { NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID, NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET } from '../secret'
//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const projectIdAndSecret = `${NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID}:${NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET}`
const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
      'base64'
    )}`,
  },
})

const CreateSellNFTs = ({web3Handler}) => {
    const { account, marketplace, categories } = useContext(NftContext);
    const navigate = useNavigate()
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [posterProgress, setPosterProgress] = useState(0);
    const [image, setImage] = useState('')
    const [fileType, setFileType] = useState('')
    const [posterFileType, setPosterFileType] = useState('')
    const [posterFileUrl, setPosterFileUrl] = useState(null)
    const [errors, setError] = useState('')
    const [mediaPosterError, setPosterMediaError] = useState('')
    const [mediaError, setMediaError] = useState('')
    const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', category: '', duration: '' })
    const [filePath, setFile] = useState('https://redzonekickboxing.com/wp-content/uploads/2017/04/default-image.jpg')
    const [posterUrl, setPosterFile] = useState('https://redzonekickboxing.com/wp-content/uploads/2017/04/default-image.jpg')

    function getAccessToken() {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGEwOTNjM0RCZjEzN0VjMTc1MmFCZDc4OEI3N2MyN0ZjM0NhQTczQ0QiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc2MzYwNzcwODAsIm5hbWUiOiJkcHBtYXJrZXRwbGFjZSJ9.MFu4Y8131bMFx5ZgiAFbbMgsL7-WFnGljxYBRsXO_mg"
    }
    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() })
    }

    async function storeFilesPoster (e) {
        const file = e.target.files[0]
        try {
            var numb = file.size / 1024 / 1024;
            numb = numb.toFixed(2);
            if (numb >= 500) {
                setPosterMediaError("File is too big!.Maximum file size 500 MB");
            } else { 
                setPosterMediaError('')
                setPosterFileType(file.type)
                setPosterFile(URL.createObjectURL(file))
                const totalSize = file.size
                let uploaded = 0
                const onStoredChunk = size => {
                    uploaded += size
                    const pct = totalSize / uploaded
                    var percent = (Math.floor(uploaded / totalSize)) * 100;
                    var progress = Math.round(percent);
                    setPosterProgress(progress);
                    console.log(`Uploading... ${pct.toFixed(2)}% complete`)
                }
                const client = makeStorageClient()
                const onRootCidReady = cid => {
                    setPosterFileUrl(`https://diversity-production.infura-ipfs.io/ipfs/${cid}/${file.name}`)
                }
                return client.put(e.target.files, { onRootCidReady, onStoredChunk })
            }
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
      }
    async function onChange(e) {
        const file = e.target.files[0]
        try {
            var numb = file.size / 1024 / 1024;
            numb = numb.toFixed(2);
            if (numb >= 3072) {
                setMediaError("File is too big!.Maximum file size 3 GB");
            } else {
                setMediaError("");
                if (typeof file !== 'undefined') {
                    setFile(URL.createObjectURL(file))
                    setFileType(file.type)
                    setCurrentFile(file);
                    const totalSize = file.size
                    let uploaded = 0
                    const onStoredChunk = size => {
                        uploaded += size
                        const pct = totalSize / uploaded
                        var percent = (Math.floor(uploaded / totalSize)) * 100;
                        var progress = Math.round(percent);
                        setProgress(progress);
                        console.log(`Uploading... ${pct.toFixed(2)}% complete`)
                    }
                    const client = makeStorageClient()
                    const onRootCidReady = cid => {
                      setImage(`https://diversity-production.infura-ipfs.io/ipfs/${cid}/${file.name}`)
                    }
                    return client.put(e.target.files, { onRootCidReady, onStoredChunk })
                }
            }
          
        } catch (error) {
          console.log('Error uploading file: ', error)
        }  
    }
    async function uploadToIPFS() {
        const { name, description, price, category, duration } = formInput
        if (validate()) {
            if (!name || !description || !price || !image || !category || !duration || !fileType) return
            /* first, upload to IPFS */
            const data = JSON.stringify({
                name, 
                description, 
                category ,
                image,
                fileType,
                duration,
                posterFileType,
                posterFileUrl,
                status: 'on_auction',
                created_at: new Date()
            })
            try {
            const added = await client.add(data)
            const url = `https://diversity-production.infura-ipfs.io/ipfs/${added.path}`
            /* after file is uploaded to IPFS, return the URL to use it in the transaction */
            return url
            } catch (error) {
            console.log('Error uploading file: ', error)
            }
        }
    }
    const validate = () => {
        const { name, description, price, category , duration } = formInput
        let errors = {};
        let isValid = true;
        if (!name) {
            isValid = false;
            errors["name"] = "Please enter nfts name.";
        }
        if (!description) {
            isValid = false;
            errors["description"] = "Please enter your description.";
        }
        // if (!increment) {
        //     isValid = false;
        //     errors["increment"] = "Please enter your increment.";
        // }
        if (!duration) {
            isValid = false;
            errors["duration"] = "Please enter your duration.";
        }
        if (!category) {
            isValid = false;
            errors["category"] = "Please enter your category.";
        }
        if (!price) {
            isValid = false;
            errors["price"] = "Please enter your price.";
        }
        setError(errors);
        return isValid;
    }
    async function listNFTForSale() {

        const url = await uploadToIPFS()
        if (!account) {
            web3Handler();
        }
        // /* next, create the item */
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        const { duration } = formInput
        let transaction = await marketplace.createAuctionToken(url, price,duration)
        await transaction.wait()
        toast.success("NFTs has been create successfuly")
        navigate('/explore')
    }
    return (
        <div className="container box_container">
            {account ?
            <form>
                <div className="page_heading_left top_margin">
                    <h1>Create New Auction Item</h1>
                </div>
                <div className='row mt-4'>
                   <div className='col-md-6'> 
                <div className="uploading_inside">
                    <h3 className="card_font_style">NFTs Video or Image<b className="required">*</b></h3>
                    
                    <p className="file_text">File types supported: JPG, PNG, GIF, SVG and MP4</p>
                    <span>
                        {fileType === 'video/mp4' ?
                            <video id="nft-video" canplaythrough="true" muted controls autoPlay width="100%" height='100%'>
                                <source src={filePath} />
                            </video>
                            :
                            <img src={filePath} alt='filePath' width={'200px'} height={'170px'} />
                        }
                    </span>
                    <input type="file" accept=".mp4, .jpeg, .jpg, .png" required name="file" onChange={onChange} />
                    <p className='text-danger'>{mediaError}</p>
                    {currentFile && (
                    <div className="progress">
                        <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" style={{ width: progress + "%" }}>
                            {progress}%
                        </div>
                    </div>
                    )}
                </div> 
                </div>

                <div className='col-md-6'>
                <div className="uploading_inside">
                    <h3 className="card_font_style">NFTs Poster or Banner<b className="required">*</b></h3>
                    <p className="file_text">File types supported: JPG, PNG, GIF, SVG and MP4</p>
                    <span>
                        {posterFileType === 'video/mp4' ?
                            <video id="nft-video" canplaythrough="true" muted controls autoPlay width="100%" height='100%'>
                                <source src={posterUrl} />
                            </video>
                            :
                            <img src={posterUrl} alt='posterUrl' width={'200px'} height={'170px'} />
                        }
                    </span>
                    <input type="file" accept=".mp4, .jpeg, .jpg, .png" required name="file" onChange={storeFilesPoster} />
                    <p className='text-danger'>{mediaPosterError}</p>
                    {posterFileType && (
                    <div className="progress">
                        <div className="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow={posterProgress} aria-valuemin="0" aria-valuemax="100" style={{ width: posterProgress + "%" }}>
                            {posterProgress}%
                        </div>
                    </div>
                    )}
                </div> 
                </div> 
                </div>
                <div className="filed_detail label_design">
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Name <b className="required">*</b></label>
                        <input type="text" className="form-control" onChange={e => updateFormInput({ ...formInput, name: e.target.value })} placeholder="Item name" />
                        {errors && errors.name && <p className='text-danger mt-2'>{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Description</label>
                        <p>The description will be included on the item's detail page underneath its image. Markdown syntax is supported.</p>
                        <textarea 
                         className="form-control"
                         onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                         name="description" 
                         placeholder="Provide a detailed description of your item." 
                         rows="4"></textarea>
                         {errors && errors.description && <p className='text-danger mt-2'>{errors.description}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Category <b className="required">*</b></label>
                        <select className="form-control" onChange={e => updateFormInput({ ...formInput, category: e.target.value })}>
                            <option value={''}>Select Category</option>
                            {categories && categories.map((item, index) => (
                                <option key={index} value={item.slug}>{item.name}</option>
                            ))}
                        </select>
                        {errors && errors.category && <p className='text-danger mt-2'>{errors.category}</p>}
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="exampleInputEmail1"> Minimum Bid Increment <b className="required">*</b></label>
                        <input type="number" 
                            min={0}
                            className="form-control" 
                            onChange={e => updateFormInput({ ...formInput, increment: e.target.value })}
                            placeholder="Increment" />
                        {errors && errors.increment && <p className='text-danger mt-2'>{errors.increment}</p>}
                    </div> */}
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Duration <b className="required">*</b></label>
                        <input type="number" 
                            className="form-control" 
                            onChange={e => updateFormInput({ ...formInput, duration: e.target.value })}
                            placeholder="Duration in hours" />
                            {errors && errors.duration && <p className='text-danger mt-2'>{errors.duration}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Price in ETH <b className="required">*</b></label>
                        <input type="number" 
                            className="form-control" 
                            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                            placeholder="Price in ETH" />
                            {errors && errors.price && <p className='text-danger mt-2'>{errors.price}</p>}
                    </div>
                    
                </div> 
               
                <div className="form-group mt-4 pb-3">
                    <button type="button" onClick={listNFTForSale} className="btn btn-primary">Create</button>
                </div>
            </form>
            : 
            <>
                <div className="page_heading_left top_margin p-4">
                    <h3>Connect your wallet.</h3>
                    <h6>Connect with one of our available wallet providers or create a new one.</h6>
                    <div className="other_fields mt-4">

                        <div className="inside_other_fileds">

                        <div className="main_icons">
                            <img src='https://opensea.io/static/images/logos/metamask-alternative.png' height={'20px'} width={'20px'} alt='alternative' />
                        </div>
                            <div className="propti_box">
                                <p>MetaMask</p>
                            </div>
                        </div>
                            <div className="added_more">
                                <button type="button" className="btn btn-primary" onClick={web3Handler}>Connect wallet</button>
                            </div> 
                        
                        </div>
                </div>
            </> }
        </div>
    );
}

export default CreateSellNFTs