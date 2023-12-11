import { Album } from "@/models/album";
import { Artist } from "@/models/artist";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const { name, image, external_url, desc, creator, songs, artists, date, properties , walletAddress} = await req.json();
    
    if (!name || !image || !external_url || !desc || !creator || !songs || !artists || !date || !properties || !walletAddress) {
        return new Response(JSON.stringify({ message: "Missing required fields" }),
            {
                status: 400,
                statusText: "Error",
            }
        );
    }
    try {
        const album = await Album.create({
            name,
            image,
            external_url,
            desc,
            creator,
            songs,
            artists,
            date,
            properties
        })

        const artist = await Artist.findOneAndUpdate(
            { walletAddress: walletAddress },
            { $push: { albums: album._id } },
            { new: true }
        );

        if (!artist) {
            return new Response(JSON.stringify({ message: "Artist not found" }),    
                {
                    status: 400,
                    statusText: "Error",
                }
            );
        }

        return new Response(JSON.stringify({ album, artist }),    
            {
                status: 200,
                statusText: "Success",
            }
        );
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: "Error fetching album" }),    
            {
                status: 400,
                statusText: "Error",
            }
        );
    }
}
