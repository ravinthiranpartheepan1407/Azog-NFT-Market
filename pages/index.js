import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"



import { nftaddress, nftmarketaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'




function Home() {

    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(()=>{
      loadNFTs()
    }, [])

    async function loadNFTs(){
      const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today/")
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, provider)
      const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i =>{
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
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
    setNfts(items)
    setLoadingState('loaded')
    }

    async function buyNft(nft){
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)

      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
      const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {value: price})

      await transaction.wait()
      loadNFTs()
    }

    if (loadingState === 'loaded' && !nfts.length) return (<h1> No Items listed in the market </h1>)
    return (
      <div>
        <div>
          <div>
          {
            nfts.map((nft, i)=>(
              <div key={i}>
                <img src={nft.image} />
                  <div>
                    <p> {nft.name} </p>
                      <div>
                        <p> {nft.description} </p>
                      </div>
                  </div>
                <div>
                  <p> {nft.price} </p>
                  <button onclick={()=> buyNft(nft)}> Buy </button>
                </div>
              </div>
            ))
          }
          </div>
        </div>
      </div>
  )
}

export default Home;
