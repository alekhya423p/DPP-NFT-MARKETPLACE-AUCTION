import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NftContext } from '../../NftContext/NftProvider'
import { useFormik } from 'formik';
import * as Yup from "yup";
import { ethers } from "ethers"
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { Web3Storage } from 'web3.storage'
import { toast } from 'react-toastify'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

const CreateSellNFTs = ({web3Handler}) => {
    const { account, marketplace } = useContext(NftContext);
    const navigate = useNavigate()
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState('')
    const [fileType, setFileType] = useState('')
    const [mediaError, setMediaError] = useState('')
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', duration: '', increment: '', name: '' })

    const [filePath, setFile] = useState('https://redzonekickboxing.com/wp-content/uploads/2017/04/default-image.jpg')

    function getAccessToken() {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGEwOTNjM0RCZjEzN0VjMTc1MmFCZDc4OEI3N2MyN0ZjM0NhQTczQ0QiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc2MzYwNzcwODAsIm5hbWUiOiJkcHBtYXJrZXRwbGFjZSJ9.MFu4Y8131bMFx5ZgiAFbbMgsL7-WFnGljxYBRsXO_mg"
    }
    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() })
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
                    // when each chunk is stored, update the percentage complete and display
                    const totalSize = file.size
                    let uploaded = 0
                    const onStoredChunk = size => {
                        uploaded += size
                        const pct = totalSize / uploaded
                        setProgress(Math.round((100 * uploaded) / totalSize));
                        console.log(`Uploading... ${pct.toFixed(2)}% complete`)
                    }
                    // makeStorageClient returns an authorized Web3.Storage client instance
                    const client = makeStorageClient()
                    // client.put will invoke our callbacks during the upload
                    // and return the root cid when the upload completes
                    const onRootCidReady = cid => {
                        console.log('uploading files with cid:', cid)
                        setImage(`https://ipfs.infura.io/ipfs/${cid}/${file.name}`)
                        setFileUrl(`https://ipfs.infura.io/ipfs/${cid}/${file.name}`)
                    }
                    return client.put(e.target.files, { onRootCidReady, onStoredChunk })
                }
            }
        } catch (error) {
          console.log('Error uploading file: ', error)
        }  
    }
    const convertHoursToSeconds =(hours) => {
        if(!isNaN(hours)){
            return hours * 60 * 60;
        }else{
            return null;
        }
    }

    async function uploadToIPFS() {
        const { name, description, price, category } = formInput
        if (validate()) {
            if (!name || !description || !price || !fileUrl || !category || !fileType) return
            /* first, upload to IPFS */
            const data = JSON.stringify({
            name, description, category ,image,fileType, created_at: Date.now 
            })
            try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            /* after file is uploaded to IPFS, return the URL to use it in the transaction */
            return url
            } catch (error) {
            console.log('Error uploading file: ', error)
            }
        }
    }
    const validate = () => {
        const { name, duration, price, increment } = formInput
        let errors = {};
        let isValid = true;
        if (!name) {
            isValid = false;
            errors["name"] = "Please enter nfts name.";
        }
        if (!price) {
            isValid = false;
            errors["price"] = "Please enter your price.";
        }
        if (!increment) {
            isValid = false;
            errors["increment"] = "Please enter your increment.";
        }
        if (!duration) {
            isValid = false;
            errors["duration"] = "Please enter your duration.";
        }
        setError(errors);
        return isValid;
    }

    // const formik = useFormik({
    //     initialValues: {
    //       name: "",
    //       duration: "",
    //       increment: "",
    //       price: "",
    //     },
    //     validationSchema: Yup.object({
    //       name: Yup.string().required('First name is required'),
    //       duration: Yup.string().required('Last Name is required'),
    //       increment: Yup.string().required('Last Name is required'),
    //       price: Yup.string().required('Last Name is required'),
    //     }),
    //     onSubmit: async (value, { resetForm }) => {
    //         // value.fileType = fileType;
    //         // value.image = image;
    //         // value.duration = convertHoursToSeconds(value.duration);
    //         // value.created_at = Date.now;
    //         // const added = await client.add(value)
    //         // console.log(added);
    //         // const IPFShash = `https://ipfs.infura.io/ipfs/${added.path}`
    //         // if (!account) {
    //         //     web3Handler();
    //         // }
    //         // /* next, create the item */
    //         // const price = ethers.utils.parseUnits(value.price, 'ether')
    //         // let listingPrice = await marketplace.getListingPrice()
    //         // listingPrice = listingPrice.toString()
    //         // let response = marketplace.addArtItem(price, IPFShash, value.increment, value.duration, value.name).send({from: account});
    //         // console.log(response);
    //         // let transaction = await marketplace.addArtItem(url, price, { value: listingPrice })
    //         // await transaction.wait()
    //         // toast.success("NFTs has been create successfuly")
    //         // navigate('/explore')
    //     },
    //   });
   
    return (
        <div className="container box_container">
            {account ?
            <form onSubmit={formik.handleSubmit}>
                <div className="page_heading_left top_margin">
                    <h1>Create New Item</h1>
                </div>
                <div className="uploading_inside">
                    <small><b className="required">*</b> Required fields</small>
                    <p>Image, Video <b className="required">*</b></p>
                    <p className="file_text">File types supported: JPG, PNG, GIF, SVG and MP4</p>
                    <span>
                        {fileType === 'video/mp4' ?
                            <>
                                <video id="nft-video" canplaythrough="true" muted controls autoPlay width="100%" height='100%'>
                                    <source src={filePath} />
                                </video>
                            </> :
                            <>
                                <img src={filePath} alt='filePath' width={'200px'} height={'170px'} />
                            </>
                        }
                        
                    </span>
                    <input type="file" 
                     accept=".mp4, .jpeg, .jpg, .png" required name="file" onChange={onChange} />
                    <p className='text-danger'>{mediaError}</p>
                    {currentFile && (
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-info progress-bar-striped"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: progress + "%" }}
                        >
                            {progress}%
                        </div>
                    </div>
                    )}
                </div> 
                <div className="filed_detail">
                    <div className="form-group">
                        <label htmlFor="name">Name <b className="required">*</b></label>
                        <input type="text" className="form-control"   {...formik.getFieldProps('name')} placeholder="Item name" />
                        {formik.touched.name && formik.errors.name ? (
                        <div className="text-danger pt-1">{formik.errors.name}</div>
                      ) : null}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="price">Min. Price in ETH <b className="required">*</b></label>
                        <input type="number" 
                            // min={0}
                            className="form-control" 
                            {...formik.getFieldProps('price')}
                            placeholder="Price in ETH" />
                            {formik.touched.price && formik.errors.price ? (
                        <div className="text-danger pt-1">{formik.errors.price}</div>
                      ) : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="increment">Increment (1-100) <b className="required">*</b></label>
                        <input type="number" 
                            min={0}
                            className="form-control" 
                            {...formik.getFieldProps('increment')}
                            placeholder="Increment" />
                            {formik.touched.increment && formik.errors.increment ? (
                        <div className="text-danger pt-1">{formik.errors.increment}</div>
                      ) : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="duration"> Auction Duration (in hours:: 0-168) <b className="required">*</b></label>
                        <input type="number" 
                            min={0}
                            className="form-control" 
                            {...formik.getFieldProps('duration')}
                            placeholder="Price in ETH" />
                           {formik.touched.duration && formik.errors.duration ? (
                        <div className="text-danger pt-1">{formik.errors.duration}</div>
                      ) : null}
                    </div>
                    
                </div> 
                <div className="form-group mt-4 pb-3">
                    <button type="submit" className="btn btn-primary">Create</button>
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