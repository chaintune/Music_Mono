"use client"

import SongCard from "@components/SongCard/songCard";
import NFTSongContainer from "@components/NFTDialog/nftSongContainer";
import NFTDialog from "@components/NFTDialog/NftDialog";
import { Layout, SearchPlaylist } from "@components";
import React, { useEffect, useContext, useState } from 'react';
import {AlbumWrapper} from "@styles/nftDialog/style";
import { useParams } from "next/navigation";
import DataContext from "@context/dataContext";
import { album } from "@types";


export default function Home() {

    const [isOpen, setIsOpen] = useState(false);
    const params = useParams()
    const albumId = params.id
    const [album, setAlbum] = useState([] as album[])

    const closeDialog = () => {
        setIsOpen(false);
    };
    const openDialog = () => {
        setIsOpen(true);
    }

    useEffect(() => {
        const getAlbumDetails = async () => {
            const response = await fetch(`/api/album/${albumId}`)

            const data = await response.json()
            console.log(data)
            setAlbum(data)
        }

        if(albumId) getAlbumDetails()
    }, [albumId])

    return (
        <Layout>
            <div style={{padding: '0vh 2.8vw', display: 'flex', justifyContent: 'space-between'}}>
                <div className="flex justify-between flex-col" style={{ width: '70.769vw', height: '70vh', overflowY: 'auto', gap: '1.860vh', scrollBehavior: 'smooth'}}>
                <AlbumWrapper>
                <SongCard album={album} />

                {
                    isOpen && <NFTDialog close={closeDialog}/>
                }

                <SearchPlaylist album={album}/>

            </AlbumWrapper>

                </div>
            </div>
        </Layout>
    );
}