/* eslint-disable @next/next/no-img-element */
'use client'

import { useCallback, useReducer, useState } from 'react';
import { WalletManager } from '../../utils/connect_wallet';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {DropArea, Instructions, FileInput} from "../../../styles/CoverArt/style"
import upload from '../../../assets/upload.svg'
import Image from 'next/image'

import IPFSManager from '../../utils/ipfs_upload';
import { Network, Provider } from 'aptos';
import { min } from 'date-fns';
const mintingModuleAddress=process.env.MODULE_ADDRESS;
const provider = new Provider(Network.DEVNET);

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'SET_NAME':
            return { ...state, name: action.payload };
        case 'SET_DESCRIPTION':
            return { ...state, desc: action.payload };
        default:
            return state;
    }
};

const Signup = () => {

    const router = useRouter();
    const walletManager = new WalletManager();
    const ipfsManager = new IPFSManager();
    const [isConnected, setIsConnected] = useState<boolean>(walletManager.isWalletConnected());

    const [profileCid, setProfileCid] = useState('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const handleConnectWallet = async () => {
        
        const connected: boolean = await walletManager.connectWallet();
        if (connected) {
            console.log('Wallet connected successfully');
            setIsConnected(true);
        } else {
            console.log('Failed to connect to the wallet');
        }
    };

    const initialState = {
        name: '',
        desc: '',
        walletAddress: walletManager.getAddress(),
    };

    const [state , dispatch] = useReducer(reducer, initialState);


    const mintNFT =async(ipfshash:string) =>{
        try{
            const wallet = window?.aptos;
            const response = await wallet.connect();
            const account = await wallet.account();
            const textEncoder = new TextEncoder();
            const payload = {
                type: "entry_function_payload",
                function: mintingModuleAddress + "::Marketplace::mint_profile_nft",
                type_arguments: [],
                arguments: [textEncoder.encode(state.name), textEncoder.encode(ipfshash), textEncoder.encode(state.desc), textEncoder.encode(profileCid)],
            };
            const pendingTransaction = await (
                window as any
            ).aptos.signAndSubmitTransaction(payload);
            console.log(pendingTransaction);
            console.log(provider);
            const client = (provider as any).aptosClient;
            console.log(client);
            const txn = await client.waitForTransactionWithResult(
                pendingTransaction.hash
            );
                console.log(txn);
        } catch(error){
            console.log('Error while minting profile NFT',error);
        }
    }

    const RegisterArtist = async (e:any) => {

        e.preventDefault();

        const data = {...state,walletAddress:walletManager.getAddress(), imageCid:profileCid,};
        console.log(data);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            },
        };


        try {
            await axios.post('http://localhost:3000/api/artist/new', data, config)
            .then(async (response) => { 
                await mintNFT(response.data._id).then( () => {

                        console.log(`The new artist is successfully registered`);
                        console.log(response.data);
                        router.push('/dashboard')
                

                    })
                 
                })   
            .catch((error) => { console.log(error) });
        } catch (error) {
            console.log(error)
        }
    }

    const onClick = useCallback(() => {
        const fileInput = document.getElementById('fileInput');
        fileInput?.click();
      }, []);

      const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {

            setProfileImage(e.target.files[0]);
            const imgCid = await ipfsManager.handleUploadToIPFS(e.target.files[0],'Image');
            
            setProfileCid(imgCid);
            console.log(imgCid);
            
        }
      };


    return (
        <div className="w-screen bg-zinc-950 flex flex-row">
            <div id="NewRootRoot" className="flex flex-row w-[50vw] bg-white items-start">
                <div style={{ backgroundImage: "url('https://file.rendit.io/n/XTQ0PJCJyvpg97UWDQaO.png')" }} className=" bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-row gap-3 w-full h-[100%] items-start pt-6 px-8">
                    <img
                        src="https://file.rendit.io/n/0D7VVQAz909zwFE5ngdy.svg"
                        alt="Group"
                        className="w-12"
                    />
                    <div className="text-xl font-['Aileron'] leading-[24px] text-white mt-3">
                        ChainTune
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-[1vw] py-[10vw] px-[10vw]">
                <div className="text-4xl font-['Aileron'] font-light leading-[48px] text-white w-full">
                    Experience music like it should be.
                </div>
                <div className="opacity-60 font-['Aileron'] font-light leading-[22px] text-white">
                    Already have an account? <a href="/login" className="cursor-pointer underline">Login here</a>
                </div>
                <div className="w-[35vw] pt-[0.7vw] border-solid border-white/6 backdrop-blur-[24px] shadow-[2px_4px_48px_0px_rgba(0,_0,_0,_0.5)] bg-[linear-gradient(159deg,_rgba(28,_30,_34,_0.33)_-9%,rgba(31,_34,_40,_0.5)_113%)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-row justify-between h-16 items-start pl-6 pr-2 rounded-[24px]">
                    <div className="text-xl font-['Aileron'] font-light leading-[28px] text-white mt-2">
                        {isConnected ? walletManager.getAddress().substring(0,30) + `...`: 'Wallet'}
                    </div>
                    <button
                        className="text-sm font-['Aileron'] font-light leading-[20px] text-white border-solid border-white/6 backdrop-blur-[24px] bg-[linear-gradient(159deg,_rgba(28,_30,_34,_0.33)_-9%,rgba(31,_34,_40,_0.5)_113%)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-row justify-center pt-3 w-1/4 h-10 items-start border rounded-[24px]"
                        onClick={handleConnectWallet}
                    >
                        {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
                    </button>
                </div>
                <div className="w-[35vw] backdrop-blur-[24px] shadow-[2px_4px_48px_0px_rgba(0,_0,_0,_0.5)] bg-[linear-gradient(159deg,_rgba(28,_30,_34,_0.33)_-9%,rgba(31,_34,_40,_0.5)_113%)] bg-cover bg-50%_50% bg-blend-normal bg-no-repeat flex flex-col justify-center gap-2 items-start p-4 rounded-[24px]">
                    <div className="flex flex-col gap-1 w-full items-start">
                        <div className="opacity-60 text-xs font-['Aileron'] leading-[20px] text-white ml-1">
                            Artist Name
                        </div>
                        <input value={state.name} onChange={(e)=>dispatch({type: 'SET_NAME', payload: e.target.value})} className="outline-none text-sm font-['Aileron'] leading-[20px] text-white bg-[rgba(38,_40,_44,_0.4)] flex flex-row w-full h-12 items-start px-4 rounded-lg" placeholder="name" />
                    </div>
                    <div className="flex flex-col gap-1 w-full items-start">
                        <div className="opacity-60 text-xs font-['Aileron'] leading-[20px] text-white ml-1">
                            Description
                        </div>
                        <textarea value={state.desc} onChange={(e)=> dispatch({type:'SET_DESCRIPTION', payload : e.target.value})} className="outline-none text-sm font-['Aileron'] leading-[20px] text-white bg-[rgba(38,_40,_44,_0.4)] flex flex-row w-full h-24 items-start pt-3 px-4 rounded-lg" placeholder="Enter description here..." />
                    </div>
                    <div className="flex flex-col gap-1 w-full items-start">
                        <div className="opacity-60 text-xs font-['Aileron'] leading-[20px] text-white ml-1">
                            Profile Image
                        </div>
                        <DropArea
                        // isDragActive={isDragActive}
                        // onDragOver={onDragOver}
                        // onDragLeave={onDragLeave}
                        // onDrop={onDrop}
                        onClick={onClick}
                        >
                        <FileInput
                            type="file"
                            id="fileInput"
                            accept=".png,.jpg,.jpeg"
                            onChange={e=>onFileChange(e)}
                        />
                        <Image src={upload} alt="" style={{width: '5vw', height: '5vw'}}/>
                        <Instructions>
                            {
                                (profileImage===null)?
                                <div>
                                    <span style={{fontSize:'2.2vh'}}>Browse File or Drag and drop the file here</span>
                                    <br />
                                    <span style={{opacity:0.6}}>.png and .jpg files with 1:1 aspect ratio up to 10mb are supported. ChainTune recommends 1080px or more for best quality.</span>
                                </div>
                            :
                                <span style={{fontSize:'2.2vh'}}>File Uploaded Successfully.</span>
                            }
                            
                        </Instructions>
                        </DropArea>

                    </div>
                </div>
                <div onClick={RegisterArtist} className="w-[35vw] border-solid border-white/6 backdrop-blur-[24px] bg-[linear-gradient(#ffffff,_#ffffff),_linear-gradient(159deg,_rgba(28,_30,_34,_0.33)_-9%,rgba(31,_34,_40,_0.5)_113%)] bg-cover,_cover bg-50%_50%,_50%_50% bg-blend-normal,_normal bg-repeat-no-repeat,_no-repeat flex flex-row justify-center pt-3 h-12 items-start border rounded-[24px]">
                    <div className="text-sm font-['Aileron'] leading-[20px]">Create Account</div>
                </div>
            </div>
        </div>

    );
}

export default Signup;
