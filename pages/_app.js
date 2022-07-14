import '../styles/globals.css';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { MarketplaceProvider } from '../context/MarketplaceContext';

function Marketplace({ Component, pageProps }) {
  return (
    <MarketplaceProvider>
      <Component {...pageProps} />
    </MarketplaceProvider>
  )
}

export default Marketplace
