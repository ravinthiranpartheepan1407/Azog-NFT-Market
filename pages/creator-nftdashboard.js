import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3Modal'

import { nftaddress, nftmarketaddress } from './config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

function Dashboard(){
  const[nfts, setNfts] = useState([])
  const[sold, setSold] = useState([])
  const[loadingState, setLoadingState] = useState('Not Loaded')

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

    const marketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()

    const items = Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))
    const soldItems = items.filter(i=>i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('Loaded')
  }
  if(loadingState === 'loaded' && !nfts.length) return(<h1> No asset Created </h1>)
  return(
    <div>
      <div>
        <h2>Items Created</h2>
        <div>
        {
          nfts.map((nft, i)=>(
            <div key={i}>
              <img src={nft.image} />
                <div>
                  <p>Price: {nft.price} ETH </p>
                </div>
            </div>
          ))
        }
        </div>
      </div>
      <div>
        {
          Boolean(sold.length) && (
            <div>
              <h2> Items Sold </h2>
                <div>
                {
                  sold.map((nft, i)=>(
                    <div key={i}>
                      <img src={nft.image} />
                      <div>
                        <p> Price: {nft.price} ETH </p>
                      </div>
                    </div>
                  ))
                }
                    </div>
                </div>

          )

        }
      </div>
    </div>
  )
}

export default Dashboard;
