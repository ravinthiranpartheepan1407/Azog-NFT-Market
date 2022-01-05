
const hre = require("hardhat");

async function main() {

  const Market = await hre.ethers.getContractFactory("NFTMarket");
  const market = await Market.deploy();
  await market.deployed();
  console.log("NFT Market Deployed To:", market.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(market.address);
  await nft.deployed();
  console.log("NFT Deployed To:", nft.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
