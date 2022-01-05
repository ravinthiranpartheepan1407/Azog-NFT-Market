const { expect } = require("chai");
const { ethers } = require("hardhat");

//Decalre a group for testing the contract
describe("NFTMarket", function(){

//decalre a single unit in a group test by initializing "it" command
  it("It should create and execute market sales", async function(){

    //Decalre a variable to for fetching the NFT market contract
    const Market = await ethers.getContractFactory("NFTMarket");

    //Declare variable for deploying our stored contract variable "NFT Market"
    const market = await Market.deploy()

    //Call the deployed for deployed market contract
    await market.deployed()

    //Decalre a variable to store the amrket addres
    const marketAddress = market.address


//****************************************************************************************************************************************************//


    //Decalre a variable to for fetching the NFT  contract
    const NFT = await ethers.getContractFactory("NFT")

    //Declare variable for deploying our stored contract variable "NFT"
    const nft = await NFT.deploy(marketAddress)

    //Call the deployed for deployed market contract
    await nft.deployed()

    //Declare variable for deploying our stored contract variable "NFT"
    const nftContractAddress = nft.address



//**********************************************************************************************************************************************************//

    //Declare a variable for storing the lisiting price from market contract
    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

//**********************************************************************************************************************************************************//

    //Declare a variable for storing ethere amount auction price
    const auctionPrice = ethers.utils.parseUnits('1', 'ether')


//**********************************************************************************************************************************************************//

    //Get createToken function from NFT and assign a URL
    await nft.createToken("https://ravinthiranpartheepan.com")
    await nft.createToken("https://ravinthiranpartheepan.com")

//**********************************************************************************************************************************************************//

    //Get createMarketItem function from market contract and assign the tokenized contract into it as a parameters
    //Parameters: nftContractAddress, listNumber (Defined by own (For ex: 1, 2, 3..)),  Acutiion Price, set "value" as listingPrice
    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice})
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice})

//**********************************************************************************************************************************************************//

    //Declare an array variable to get Signer from ethers lib
    const[_, buyerAddress] = await ethers.getSigners();

//**********************************************************************************************************************************************************//

    //Connect market contract with buyerAddress the chain by createMarketSale b y passing properties by tokenized nftContractAddress, list number, and set values as auction pric
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice})

//**********************************************************************************************************************************************************//

    //Declare a variable for getting the fetchMarketItems from market contract
    items = await market.fetchMarketItems()

    //Use the fetched MarketItems variable to promise all the items and map it to the variable "i"
    items = await Promise.all(items.map(async i=>{

    //Declare a tokenUri for storing the tokenUri from nft contract and pass the mapped variable "i" with tokenId
      const tokenUri = await nft.tokenURI(i.tokenId)

    //Use the fetched marketItem variable "items" to structurize the item properties
    //Properties: price, tokenId, price, owner, tokenUri
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items:', items)
  })
})

//**********************************************************************************************************************************************************//
