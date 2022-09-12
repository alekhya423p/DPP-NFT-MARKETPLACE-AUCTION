require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config();


module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: ["5843db7bdf2e39143cb86026cf92645839580f993bda0e9ef0413c627966a7a0"],
      gas: 2100000,
      gasPrice: 8000000000 // default is 'auto' which breaks chains without the london hardfork

    },
    //allowUnlimitedContractSize: true,
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_KEY,
  },
  solidity: {
    version : "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
  }
  
  },
  
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  }
  
};
