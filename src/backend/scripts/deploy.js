
const hre = require("hardhat");
const fs = require('fs');

async function main() {
 const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
 const nftMarketplace = await NFTMarketplace.deploy();
 await nftMarketplace.deployed();
 console.log("nftMarketplace deployed to:", nftMarketplace.address);

//  const ArtAuction = await hre.ethers.getContractFactory("ArtAuction");
//  const artauction = await ArtAuction.deploy();
//  await artauction.deployed();
//  console.log("artauction deployed to:", artauction.address);

 fs.writeFileSync('./config.js', `
 export const marketplaceAddress = "${nftMarketplace.address}" `)
}

main()
 .then(() => process.exit(0))
 .catch((error) => {
 console.error(error);
  process.exit(1);
 });

