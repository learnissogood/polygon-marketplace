import { MarketplaceContext } from '../context/MarketplaceContext';
import { useContext } from 'react';
import Link from 'next/link';
import { Layout } from 'antd';
import ConnectedComponent from '../components/ConnectedComponent';
import NotConnectedComponent from '../components/NotConnectedComponent';

const { Header, Content, Footer } = Layout;

export default function Home() {

  const { connectWallet, currentAccount } = useContext(MarketplaceContext);

  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
        }}
      >
        <div className='flex items-center justify-between'>
          <p className='text-2xl font-bold text-blue-500 mr-10 mt-4'>NFT MARKETPLACE</p>
          <div>
            <Link href='/'>
              <a className='mr-4 text-white'>
                Home
              </a>
            </Link>
            <Link href='/create-item'>
              <a className='mr-6 text-white'>
                Create NFTs
              </a>
            </Link>
            <Link href='/my-assets'>
              <a className='mr-6 text-white'>
                My NFTs
              </a>
            </Link>
            <Link href='/creator-dashboard'>
              <a className='mr-6 text-white'>
                Dashboard
              </a>
            </Link>
          </div>
          <div className='flex items-center justify-center text-blue-500 bg-white h-10 px-8 pt-3 md:px15 rounded-full w-auto'>
            {currentAccount ? <p> Wallet: {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)} </p> : <button className='mb-3' onClick={connectWallet}>Connect Wallet</button>}
          </div>
        </div>
      </Header>
      <Content
        className="site-layout"
        style={{
          padding: '0 50px',
          height: '100%',
        }}
      >
        <div className='flex justify-center items-center container mx-auto my-80 text-center'>
          {currentAccount ? (
            <ConnectedComponent />
          ) : (
            <NotConnectedComponent />
          )}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          position: 'flex'
        }}
      >
        MarketPlace ©2022 Created by Juanchi
      </Footer>
    </Layout>
  )
}
