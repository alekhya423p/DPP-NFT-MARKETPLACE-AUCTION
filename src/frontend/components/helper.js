import axios from "axios";
import { ethers } from "ethers";
import NFTMarketplace from "../../backend/artifacts/src/backend/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { marketplaceAddress } from "./config";
import Web3Modal from "web3modal";

// export const loadAuctionNFTs = async () => {
// //     // Get deployed copies of contracts
// //     const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/")
// //    const marketplace = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
// //    //const auctionnft = new
// //   // const artauction = new ethers.Contract(ArtAuctionAddress, ArtAuction.abi, provider)
// //   const data = await marketplace.fetchMarketItems()

// //     console.log(data);
//   }
export const loadAuctionNFTs = () => {
  // const wallet = new ethers.Wallet(ethPrivkey, provider);
  //const ethPrivkey = "5843db7bdf2e39143cb86026cf92645839580f993bda0e9ef0413c627966a7a0"
  //const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/")
  // await provider.send('eth_requestAccounts', []);
  //const wallet = new ethers.Wallet(ethPrivkey, provider);

  //provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask

  //const marketplace = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  //const marketplace = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
  // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  // setAccount(accounts[0])
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc-mumbai.maticvigil.com/"
  );
  const signer = provider.getSigner(
    "0x04Df33796DEE42E975c610F2ca0a51ae95e46e90"
  );
  const marketplace = new ethers.Contract(
    marketplaceAddress,
    NFTMarketplace.abi,
    signer
  );
  console.log(marketplace);
  loadNFTs(marketplace);
};
async function loadNFTs(marketplace) {
  //const { setAccount } = useContext(NftContext);

  // const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/")
  // const signer =  provider.getSigner();
  // const marketplace = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

  // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const data = await marketplace.fetchMarketItems();
  console.log("working");
  await Promise.all(
    data.map(async (i) => {
      const tokenUri = await marketplace.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri);
      //setAccount(accounts[0])
      if (meta?.data?.status === "on_auction" && i.bidAmounts?.length > 0) {
        console.log("working");
        let date = new Date(meta?.data?.created_at).toISOString();
        let convertDate = date.substring(0, date.length - 1);
        const date1 = new Date();
        const date2 = new Date(convertDate);
        var diff = Math.round(
          Math.abs(date1.getTime() - date2.getTime()) / 3600000
        );
        var duration = meta.data.duration;
        if (54 < diff) {
            try {
              let transaction = await marketplace.executeSale(i.tokenId.toNumber())
              console.log(transaction);
            } catch (error) {
              console.log(error);
            }
        } else {
          console.log("this is not exprie");
        }
      }
    })
  );
}
