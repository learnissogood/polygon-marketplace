import { createContext, useState, useEffect } from "react";
import { networks } from '../utils/networks';

export const MarketplaceContext = createContext();

export const MarketplaceProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [network, setNetwork] = useState('');

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert('Get Metamask -> https://metamask.io/')
                return;
            }

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            console.log('Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error)
        }
    };

    const switchNetwork = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x13881' }]
                });
            } catch (error) {
                /*
                ** This error code means that the chain we want has not been added to Metamask
                ** In this case we ask the user to add it to their Metamask
                */
                if (error.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: '0x13881',
                                    chainName: 'Polygon Mumbai Testnet',
                                    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                                    nativeCurrency: {
                                        name: "Mumbai Matic",
                                        symbol: "MATIC",
                                        decimals: 18
                                    },
                                    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
                                },
                            ],
                        });
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        } else {
            alert('Metamask is not installed. Please install it to use this Dapp');
        }
    };

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log('Make sure you have Metamask');
            return;
        } else {
            console.log('We have the Ethereum object!', ethereum);
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account: ', account);
            setCurrentAccount(account);
        } else {
            console.log('No Authorized Account Found')
        }

        const chainId = await ethereum.request({ method: 'eth_chainId' });
        setNetwork(networks[chainId]);

        ethereum.on('chainChanged', handleChainChanged);

        function handleChainChanged(_chainId) {
            window.location.reload();
        }

    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <MarketplaceContext.Provider
            value={{
                connectWallet,
                checkIfWalletIsConnected,
                currentAccount,
                setCurrentAccount,
                network,
                setNetwork,
                switchNetwork,
            }}
        >
            {children}
        </MarketplaceContext.Provider>
    )
}