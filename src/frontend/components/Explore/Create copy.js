import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NftContext } from '../../NftContext/NftProvider'
import { Web3Storage } from 'web3.storage'
import { ethers } from "ethers"
import { toast } from "react-toastify";
import { withSwal } from 'react-sweetalert2';
// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { create as ipfsHttpClient } from 'ipfs-http-client'
//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID
const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET
const projectIdAndSecret = `${projectId}:${projectSecret}`

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

export default withSwal((props, ref, web3Handler) => {
    const { swal } = props;
    // const Create = ({ web3Handler }) => {
    const { account, nft, marketplace } = useContext(NftContext);
    const navigate = useNavigate()

    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState('')
    const [fileType, setFileType] = useState('')
    const [price, setPrice] = useState(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setcategory] = useState('')
    const [errors, setError] = useState({})
    const [mediaError, setMediaError] = useState('')
    const [filePath, setFile] = useState('https://redzonekickboxing.com/wp-content/uploads/2017/04/default-image.jpg')

    function getAccessToken() {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGEwOTNjM0RCZjEzN0VjMTc1MmFCZDc4OEI3N2MyN0ZjM0NhQTczQ0QiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc2MzYwNzcwODAsIm5hbWUiOiJkcHBtYXJrZXRwbGFjZSJ9.MFu4Y8131bMFx5ZgiAFbbMgsL7-WFnGljxYBRsXO_mg"
    }
    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() })
    }

    async function uploadToIPFS(event) {
        // show the root cid as soon as it's ready
        const file = event.target.files[0];
        var numb = file.size / 1024 / 1024;
        numb = numb.toFixed(2);
        if (numb >= 3072) {
            setMediaError("File is too big!.Maximum file size 3 GB");
        } else {
            setMediaError("");
            if (typeof file !== 'undefined') {
                setFile(URL.createObjectURL(file))
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
                    setFileType(file.type)
                }
                return client.put(event.target.files, { onRootCidReady, onStoredChunk })
            }
        }
    }

    const createNFT = async () => {
        if (validate()) {
            if (!image || !price || !name || !category || !description || !fileType) return
            try {
                const result = await client.add(JSON.stringify({ image, price, category, name, description, fileType }))
                mintThenList(result)
            } catch (error) {
                console.log("ipfs uri upload error: ", error)
            }
        }
    }
    const validate = () => {
        // let input = this.state.input;
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
    const mintThenList = async (result) => {
        const uri = `https://ipfs.infura.io/ipfs/${result.path}`
        // mint nft 
        await (await nft.mint(uri)).wait()
        // get tokenId of new nft 
        const id = await nft.tokenCount()
        // approve marketplace to spend nft
        await (await nft.setApprovalForAll(marketplace.address, true)).wait()
        // add nft to marketplace
        const listingPrice = ethers.utils.parseEther(price.toString())
        await (await marketplace.makeItem(nft.address, id, listingPrice)).wait()
        toast.success('NFTs has been create successfully');
        navigate('/explore')
    }
    
    return (
        <div className="container box_container">
            {account ?
                <form>
                    <div className="page_heading_left top_margin">
                        <h1>Create New Item</h1>
                    </div>

                    <div className="uploading_inside">
                        <small><b className="required">*</b> Required fields</small>
                        <p>Image, Video <b className="required">*</b></p>
                        <p className="file_text">File types supported: JPG, PNG, GIF, SVG and MP4</p>
                        <span>
                            <img src={filePath} alt='filePath' width={'200px'} height={'170px'} />
                        </span>
                        <input type="file"
                            accept=".mp4, .jpeg, .png" required name="file" onChange={uploadToIPFS} />
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
                            <label htmlFor="exampleInputEmail1">Name <b className="required">*</b></label>
                            <input type="text" name="name" className="form-control" onChange={(e) => setName(e.target.value)} placeholder="Item name" />
                            {errors && errors.name && <p className='text-danger mt-2'>{errors.name}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">External link</label>
                            <p>Dpp will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.</p>
                            <input type="text" className="form-control" placeholder="https://yoursite.io/item/123" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Description</label>
                            <p>The description will be included on the item's detail page underneath its image. Markdown syntax is supported.</p>
                            <textarea className="form-control" onChange={(e) => setDescription(e.target.value)} name="description" placeholder="Provide a detailed description of your item." rows="4"></textarea>
                            {errors && errors.description && <p className='text-danger mt-2'>{errors.description}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Category <b className="required">*</b></label>
                            <select className="form-control" name='category' onChange={(e) => setcategory(e.target.value)}>
                                <option>Select Category</option>
                                <option value={'hurror'}>Hurror</option>
                                <option value={'entertainment'}>Entertainment</option>
                                <option value={'romantic'}>Romantic</option>
                                <option value={'fiction'}>Fiction</option>
                                <option value={'suspence '}>Suspence </option>
                                <option value={'thriller  '}>Thriller  </option>
                                <option value={'comedy '}>Comedy </option>
                            </select>
                            {errors && errors.category && <p className='text-danger mt-2'>{errors.category}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Price in ETH <b className="required">*</b></label>
                            <input type="number" name='price' className="form-control" onChange={(e) => setPrice(e.target.value)} placeholder="Price in ETH" />
                            {errors && errors.price && <p className='text-danger mt-2'>{errors.price}</p>}
                        </div>

                    </div>

                    <div className="form-group mt-4 pb-3">
                        <button type="button" onClick={e => {
                            swal.fire({
                                // title: 'Example',
                                icon: 'info',
                                text: 'Please give three confirmations in your meta mask in order to create and list the NFT in to our marketplace',
                            }).then(result => {
                                if (result.isConfirmed === true) {
                                    createNFT()
                                }
                            }).catch(error => {
                                // when promise rejected...
                            });
                        }}
                            className="btn btn-primary">Create</button>
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
                </>}
        </div>
    );
});

// export default withSwal(Create);