import React, { useState, useContext } from 'react';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { ethers } from 'ethers';
import { create as IPFS } from 'ipfs-http-client';
import { useRouter } from 'next/router';

const client = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

import { marketContractAddress, nftContractAddress } from '../utils/contract-addresses';
import NFT from '../utils/NFT.json';
import Market from '../utils/Market.json';

const ConnectedComponet2 = () => {

    const { switchNetwork, network } = useContext(MarketplaceContext);

    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({ price: '', name: '', descriptio: '' });
    const router = useRouter();

    const onChange = async (e) => {

        const file = e.target.files[0];

        try {

            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            );
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setFileUrl(url);

        } catch (e) {
            console.log(e);
        }
    }

    const createItem = async () => {

        const { name, description, price } = formInput;

        if (!name || !description || !price || !fileUrl) return;

        const data = JSON.stringify({
            name, description, image: fileUrl
        });

        try {

            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            createSale(url);

        } catch (e) {
            console.log(e);
        }
    };

    const createSale = async (url) => {
        try {

            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const nftContract = new ethers.Contract(nftContractAddress, NFT.abi, signer);
                const marketContract = new ethers.Contract(marketContractAddress, Market.abi, signer);

                let transaction = await nftContract.createToken(url);
                let tx = await transaction.wait();

                let event = tx.events[0];
                let value = event.args[2];
                let tokenId = value.toNumber();

                const price = ethers.utils.parseUnits(formInput.price, 'ether');

                let listingPrice = await marketContract.listingPrice();
                listingPrice = listingPrice.toString();

                transaction = await marketContract.createMarketItem(nftContractAddress, tokenId, price, { value: listingPrice });
                await transaction.wait();
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        }
    };

    if (network !== 'Polygon Mumbai Testnet') {
        return (
            <div>
                <p className='text-xl pb-2'>Please switch to Polygon Mumbai Testnet</p>
                <button onClick={switchNetwork} className='text-white bg-black h-10 px-8 rounded-full ml-[120px]'>Switch</button>
            </div>
        );
    }

    return (
        <div className='w-1/2 flex flex-col pb-12 text-center mt-[-80px]'>
            <h1 className='text-bold text-xl pb-5'>CREATE YOUR OWN NFT</h1>
            <input
                placeholder='NFT Name'
                className='mt-2 border rounded p-4'
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
            />
            <textarea
                placeholder='NFT Description'
                className='mt-2 border rounded p-4'
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
            />
            <input
                placeholder='NFT Price in Eth'
                className='mt-2 border rounded p-4'
                onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
            />
            <input
                type='file'
                name='Asset'
                className='my-4'
                onChange={onChange}
            />
            {
                fileUrl && (
                    <img className='rounded mt-4 ml-40' width='300' src={fileUrl} />
                )
            }
            <button
                onClick={createItem}
                className='font-bold mt-4 bg-yellow-500 text-white rounded p-4 shadow-lg'
            >
                Create NFT
            </button>
        </div>
    )
}

export default ConnectedComponet2