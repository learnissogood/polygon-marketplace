import React, { useState, useContext, useEffect } from 'react';
import { MarketplaceContext } from '../context/MarketplaceContext';
import axios from 'axios';
import { ethers } from 'ethers';

import { marketContractAddress, nftContractAddress } from '../utils/contract-addresses';
import NFT from '../utils/NFT.json';
import Market from '../utils/Market.json';

const MyDashboard = () => {

  const { switchNetwork, network } = useContext(MarketplaceContext);
  const [nft, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  const fetchNFTs = async () => {
    try {

      const { ethereum } = window;

      if (ethereum) {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const marketContract = new ethers.Contract(marketContractAddress, Market.abi, signer);
        const nftContract = new ethers.Contract(nftContractAddress, NFT.abi, signer);

        const data = await marketContract.fetchItemsCreated();

        const items = await Promise.all(data.map(async i => {

          const tokenUri = await nftContract.tokenURI(i.tokenId);

          const meta = await axios.get(tokenUri);

          let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

          let item = {
            price,
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.owner,
            sold: i.sold,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          }

          return item
        }));

        const soldItems = items.filter(i => i.sold);

        setSold(soldItems);
        setNfts(items);
        setLoadingState('loaded');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  if (network !== 'Polygon Mumbai Testnet') {
    return (
      <div>
        <p className='text-xl pb-2'>Please switch to Polygon Mumbai Testnet</p>
        <button onClick={switchNetwork} className='text-white bg-black h-10 px-8 rounded-full'>Switch</button>
      </div>
    )
  }

  return (
    <div>
      {!nft.length && loadingState === 'loaded' ? (
        <h1 className="py-10 text-3xl text-black">No NFTs Created</h1>
      ) : (
        <>
          {nft.length && (
            <div>
              <h1 className='text-bold text-3xl mt-[-200px] mb-[20px]'>My Creations</h1>
              <div style={{ maxWidth: '1500px' }}>
                <div className='grid lg:grid-cols-4 gap-4 pt-4'>
                  {
                    nft.map((nft, i) => (
                      <div key={i} className='border shadow rounded-xl overflow-hidden'>
                        <div>
                          <img src={nft.image} style={{ height: '300px', width: '300px', objectFit: 'cover' }} />
                        </div>
                        <div className='p-4 bg-black text-white'>
                          <p style={{ height: '10px' }} className='text-2xl font-semibold'>
                            {nft.name}
                          </p>
                          <div style={{ height: '50px', overflow: 'hidden', paddingTop: '10px' }}>
                            <p className='text-gray-400'>{nft.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}
          {sold.length > 0 && (
            <div className='mt-80'>
              <h1 className='text-bold text-3xl mt-[-200px] mb-[20px]'>Sold Items</h1>
              <div style={{ maxWidth: '1500px' }}>
                <div className='grid lg:grid-cols-4 gap-4 pt-4'>
                  {
                    sold.map((nft, i) => (
                      <div key={i} className='border shadow rounded-xl overflow-hidden'>
                        <div>
                          <img src={nft.image} style={{ height: '300px', width: '300px', objectFit: 'cover' }} />
                        </div>
                        <div className='p-4 bg-black text-white'>
                          <p style={{ height: '10px' }} className='text-2xl font-semibold'>
                            {nft.name}
                          </p>
                          <div style={{ height: '50px', overflow: 'hidden', paddingTop: '10px' }}>
                            <p className='text-gray-400'>{nft.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MyDashboard