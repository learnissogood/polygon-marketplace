import React, { useContext} from 'react'
import { MarketplaceContext } from '../context/MarketplaceContext'

const NotConnectedComponent = () => {

    const { connectWallet } = useContext(MarketplaceContext);
    return (
        <div>
            <p className='text-xl pb-2'>Please Connect Your Wallet To Use The Dapp</p>
            <button onClick={connectWallet} className='text-white bg-black h-10 px-8 rounded-full'>Connect Wallet</button>
        </div>
    )
}

export default NotConnectedComponent