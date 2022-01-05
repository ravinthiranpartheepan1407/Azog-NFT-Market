require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
const privateKey = fs.readFileSync(".secrets").toString().trim() || "0123456789"
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";
module.exports = {
  defaultNetwork: "hardhat",
    networks:{
      hardhat:{
        chainId: 1337
      },
      mumbai:{
        url: "https://rpc-mumbai.maticvigil.com",
        accounts: [privateKey]
      },

    matic:{
      url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      accounts: [privateKey]
    }
  },

  solidity: {
    version: "0.8.4",
    settings:{
      optimizer:{
        enabled: true,
        runs: 200
      }
    }
  }
};
