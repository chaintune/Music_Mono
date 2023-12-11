'use client'
import arrow from '@assets/arrow.svg'
import Link from 'next/link'
import Image from 'next/image'
import search from '@assets/search.svg'
import search_white from '@assets/search-white.svg'
import { Nav, Left, Tab, Right, Wrap1, Wrap11, Wrap111, Wrap112, Wrap12, Wrap2, Wrap21, Wrap22, ConnectedText, ConnectWalletButton, DisconnectedButton } from "@styles/Navbar/style"
import { usePathname } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState, useRef } from 'react';
import axios from 'axios'
import { SearchBar } from '@components'
import { Network, Provider } from 'aptos';
//import { WalletManager } from '@utils/WalletManager'
//import { WalletProvider } from '@app/WalletContext'
//import { useWallet } from '@app/WalletContext'

export const provider = new Provider(Network.DEVNET)
export const moduleAddress = process.env.NEXT_PUBLIC_MODULE_ADDRESS;


const Navbar = () => {
    //const walletManager = new WalletManager();
    //const {connected, windowDefined,setWindowDefined, address, handleConnectClick, handleDisconnect} = useWallet();
    const [windowDefined, setWindowDefined] = useState<boolean>(false);
    const [address, setAddress] = useState<string | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [cid, setCid] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const pathname = usePathname()

    
      useEffect(() => {
        if (typeof window !== 'undefined') {
        setWindowDefined(true);
        //if (window.aptos) {
        //     window.location.href = '/form2';
        //     setConnected(true);
        // }
        // console.log(window.aptos)
        }
    }, [])
    /*useEffect(() => {
        setIsConnected(walletManager.isWalletConnected());
        if (walletManager.isWalletConnected()) {
          setAddress(walletManager.getAddress());
        }
      }, []);*/
    

    
    const getAptosWallet = () => {
        if ('aptos' in window) {
          return window.aptos;
        } else {
          window.open('https://petra.app/', `_blank`);
        }
    };


    const handleConnectClick = async () => {
        const wallet: any = getAptosWallet();
        try {
          const response = await wallet.connect();
          console.log(response); // { address: string, address: string }
    
          const account = await wallet.account();
          console.log(account); // { address: string, address: string }
    
          setAddress(account.address)
          setConnected(true);
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAddress', account.address);
        } catch (error) {
          // { code: 4001, message: "User rejected the request."}
          console.log(error)
        }
    }


    const handleDisconnect = async () => {
        const wallet: any = getAptosWallet()
        if(!wallet) return;
        await wallet.disconnect()
    
        setConnected(false);
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
        setAddress(null)
        setIsPlaying(false)
        setCid(null)
    }

    

    useEffect(() => {
        if (connected) {
            // Fetch address when connected
            const wallet: any = getAptosWallet();
            if (!wallet) return;


            wallet.account().then((account: any) => {
                setAddress(account.address);
            });
        }
    }, [connected]);


    useEffect(() => {
      const isWalletConnected = localStorage.getItem('walletConnected');
      if (isWalletConnected) {
          setConnected(true);
      }
  }, []);

  
    /*
    
    const handleConnectClick = async () => {
        const connected: boolean = await walletManager.connectWallet();
        if (connected) {
          setIsConnected(true);
          setAddress(walletManager.getAddress());
        }
      };
    
      const handleDisconnect = async () => {
        const disconnected: boolean = await walletManager.disconnectWallet();
        if (disconnected) {
          setIsConnected(false);
          setAddress(null);
        }
      };*/

    ///const address = walletManager.isWalletConnected() ? walletManager.getConnectedAddress() : null;

    const abbreviatedAddress = (address: string | null) => {
        if (!address) return '';
        if (address.length <= 7) return address;

        return `${address.substring(0, 7)}...`;
    };

    



    

    const getSrc = (path: string) => {
        return path === '/search' ? search_white : search
    }
    const getColor = (path: string, content: string) => {
        return path === content ? '#FFF' : '#ffffff56'
    }
    
    return (
        
        <Nav>
            <Left>
                <Link href='/'><Tab style={{color: getColor(pathname, '/')}}>Home</Tab></Link>
                <Link href='/explore'><Tab style={{color: getColor(pathname, '/explore')}}>Explore</Tab></Link>
                <Link href='/search' style={{display: 'flex', gap: '0.559vw', alignItems: 'center'}}>
                    <Image src={getSrc(pathname)} alt='' style={{width: '2.797vw', height: '2.797vw'}}  />
                    {
                        pathname === '/search' &&
                        <SearchBar />
                    }
                </Link>
            </Left>
            <Right>
                <Wrap1>
                    <Wrap11>
                        <Wrap111></Wrap111>
                        <Wrap112>24.40</Wrap112>
                    </Wrap11>
                    <Wrap12>
                        <Image src={arrow} alt="" style={{width: '0.9vw', height: '0.9vw'}}/>
                    </Wrap12>
                </Wrap1>
                <Wrap1>
                    <Wrap11>
                        <Wrap111></Wrap111>
                        <Wrap112>2,485</Wrap112>
                    </Wrap11>
                    <Wrap12>
                        <Image src={arrow} alt="" style={{width: '0.9vw', height: '0.9vw'}}/>
                    </Wrap12>
                </Wrap1>
                <Wrap2>
            {/* {address ? abbreviatedAddress(address) : 'Connect Wallet'} */}
            {windowDefined ? (
                connected ? (
                        <Wrap21>{abbreviatedAddress(address)}</Wrap21>
                ) : (
                    <Wrap21>Connect Wallet</Wrap21>
                )
            ) : (
                <Wrap21>Loading...</Wrap21>
            )}
            
            { connected ? (
                    <Wrap22 onClick={handleDisconnect} style={{backgroundColor: '#8d0303'}}><Image src={arrow} alt="" style={{width: '0.9vw', height: '0.9vw'}}/></Wrap22>
                ) : (
                    <Wrap22 onClick={handleConnectClick} style={{backgroundColor: '#24282D'}}><Image src={arrow} alt="" style={{width: '0.9vw', height: '0.9vw'}}/></Wrap22>
                )}
        </Wrap2>
            </Right>
        </Nav>
    );
}

export default Navbar;