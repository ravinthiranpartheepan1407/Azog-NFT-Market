import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Web3Modal from 'web3Modal'

import { nftaddress, nftmarketaddress } from './config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

function OwnAssets(){
  const[nfts, setNfts] = useState([])
  const[loadingState, setLoadingState] = useState('not Loaded')

  useEffect(()=>{
    loadNFTs()
  }, [])

  async function loadNFTs(){
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
  })

  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()

  const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)
  const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, provider)
  const data = await marketContract.fetchNFTs()

  const items = await Promise.all(data.map(async i=>{
    const tokenUri = await tokenContract.tokenUri(i.tokenId)
    const meta = await axios.get(tokenUri)
    let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
    let item = {
      price,
      tokenId: i.tokenId.toNumber(),
      seller: i.seller,
      owner: i.owner,
      image: meta.data.image,
    }
    return item
  }))
  setNfts(items)
  setLoadingState('loaded')
 }
 if(loadingState === 'loaded' && !nfts.length) return(<h1> No Asset Owned </h1>)
 return(
   <div>
    <div>
      <div>
        {
          nfts.map((nft, i) => (
            <div key={i}>
              <img src={nft.image} />
              <div>
                <p>Price: {nft.price} ETH</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
   </div>
 )
}

export default OwnAssets;
