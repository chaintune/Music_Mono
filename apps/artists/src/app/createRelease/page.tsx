'use client'

import { Layout, ReleaseOptions, TrackDetails } from "@/components";
import React, { useState } from 'react';
import {Container, Item, Icon} from "../../../styles/ReleaseOptions/style"
import disc from '../../../assets/disc.svg'
import folder from '../../../assets/folder.svg'
import Confetti from 'react-confetti'
import { useWindowSize } from "@uidotdev/usehooks";

const moduleAddress = process.env.MODULE_ADDRESS;

const CreateRelease = () => {
    const [selected, setSelected] = useState('single');
    const { width, height } = useWindowSize();
    const createAlbumData = async (
    album: string,
    imageCid: string | null,
    artist: string
  ) => {
    if (imageCid === null) {
      console.error("No image uploaded, error creating album.");
      return;
    }
    const origin = window.location.origin;
    console.log(origin);

    const response = await axios.post(
      `${origin}/api/uploadAlbum`,
      {
        imageCid: imageCid,
        album: album,
        artist: artist,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    const hash = response.data;
    setAlbumCid(hash);
  };
    const buyMusic = async (
    artist_account_address: string,
    album: string,
    song: string
  ) => {
    // checking for wallet connection
    const wallet: any = getAptosWallet(); // see "Connecting"
    setTransactionInProgress(true);
    const account = await wallet.account();
    if (!account) {
      console.error("No account connected");
      return;
    }

    if (artist_account_address === "" || album === "" || song === "") {
      console.error("Missing fields for buying");
      return;
    }

    const payload = {
      arguments: [artist_account_address, album, song],
      function: `${moduleAddress}::MarketPlace::download_script`,
      type: "entry_function_payload",
      type_arguments: [],
    };

    try {
      const pendingTransaction = await (
        window as any
      ).aptos.signAndSubmitTransaction(payload);
      const client = provider.aptosClient;
      const txn = await client.waitForTransactionWithResult(
        pendingTransaction.hash
      );
      console.log(txn);
    } catch (error: any) {
      console.error("Error buying music:", error);
    } finally {
      setTransactionInProgress(false);
    }
  };
    const createCollection = async (
    cid: string | null,
    Album: string,
    description: string,
    max_sup: number | 0
  ) => {
    const wallet: any = getAptosWallet(); // see "Connecting"
    // const response = await wallet.connect();
    const account = await wallet.account();
    if (!account) {
      console.error("No account connected");
      return;
    }

    if (cid == null) {
      console.error("CID is null, error creating collection.");
      return;
    }
    setTransactionInProgress(true);
    const textEncoder = new TextEncoder();

    const c_id = textEncoder.encode(`https://ipfs.io/ipfs/${cid}`);
    const desc = textEncoder.encode(description);
    const album = textEncoder.encode(Album);

    const payload = {
      arguments: [album, c_id, desc, max_sup],
      function: `${moduleAddress}::MarketPlace::set_collection_details`,
      type: "entry_function_payload",
      type_arguments: [],
    };

    try {
      const pendingTransaction = await (
        window as any
      ).aptos.signAndSubmitTransaction(payload);
      const client = provider.aptosClient;
      const txn = await client.waitForTransactionWithResult(
        pendingTransaction.hash
      );
      console.log(txn);
    } catch (error: any) {
      console.error("Error creating collection:", error);
    } finally {
      setTransactionInProgress(false);
    }
  };

  const createSongData = async (
    song_name: string,
    album: string,
    image: string | null,
    artist: string,
    audio: string | null,
    genre: string
  ) => {
    if (image === null) {
      console.error("No image uploaded, error publishing music.");
      return;
    }
    if (audio === null) {
      console.error("No audio uploaded, error publishing music.");
      return;
    }
    const origin = window.location.origin;
    console.log(origin);
    const res = await axios.post(
      `${origin}/api/uploadSong`,
      {
        song: song_name,
        audioCid: audio,
        imageCid: image,
        album: album,
        artist: artist,
        genre: genre,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // .then(function (response) {
    //   console.log(response.data);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
    console.log(res.data);
    setSongCid(res.data);
  };

  const publishSong = async (
    amount: number,
    price: number,
    cid: string | null,
    songName: string,
    Album: string,
    desc: string,
    song_image_cid: string | null,
    song_audio_cid: string | null,
    max_sup: number
  ) => {
    const wallet: any = getAptosWallet(); // see "Connecting"
    setTransactionInProgress(true);
    const account = await wallet.account();
    if (!account) {
      console.error("No account connected");
      return;
    }

    if (cid == null || song_image_cid == null || song_audio_cid == null) {
      console.error("CID is null, error minting and listing NFT.");
      return;
    }

    const textEncoder = new TextEncoder();

    const song_cid = textEncoder.encode(`ipfs://${cid}`);
    const song_Name = textEncoder.encode(songName);
    const audio_cid = textEncoder.encode(`ipfs://${audioCid}`);
    const image_cid = textEncoder.encode(`ipfs://${songImageCid}`);
    const album = textEncoder.encode(Album);
    const description = textEncoder.encode(songDesc);

    const payload = {
      arguments: [
        song_Name,
        album,
        song_cid,
        description,
        image_cid,
        audio_cid,
        max_sup,
        amount,
        price,
      ],
      function: `${moduleAddress}::MarketPlace::mint_and_list_token`,
      type: "entry_function_payload",
      type_arguments: [],
    };

    try {
      const pendingTransaction = await (
        window as any
      ).aptos.signAndSubmitTransaction(payload);
      const client = provider.aptosClient;
      const txn = await client.waitForTransactionWithResult(
        pendingTransaction.hash
      );
      console.log(txn);
    } catch (error: any) {
      console.error("Error publishing music:", error);
    } finally {
      setTransactionInProgress(false);
    }
  };
    return ( 

        <Layout>
            <Container>
                <div style={{padding:'2vh'}}>
                {
                    
                }
                    <div style={{fontFamily: 'Aileron',fontSize: '2vw',fontWeight: '300',color:'white'}}>Type</div>
                    <div style={{display:'flex'}}>
                    <ReleaseOptions
                    label="Single"
                    isSelected={selected === 'single'}
                    onClick={() => setSelected('single')}
                    iconSrc={disc}
                    />
                    <ReleaseOptions
                    label="Album"
                    isSelected={selected === 'album'}
                    onClick={() => setSelected('album')}
                    iconSrc={folder}
                    />
                    </div>
                </div>
            </Container>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                {/* <CoverArt /> */}
                </div>
                {(selected=="single")?(<TrackDetails selected="single" />):(<TrackDetails selected="album" />) }
                
                {/* <LaunchNFT /> */}

        </Layout>
     );
}
 
export default CreateRelease;
