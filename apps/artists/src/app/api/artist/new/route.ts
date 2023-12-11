import mongooseconnect from "@/lib/mongoose";
import { Artist } from "@/models/artist";
import pinataSDK from "@pinata/sdk";
const pinata = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_JWT });

export const POST = async (req: Request) => {
  const { name, desc, walletAddress,imageCid } = await req.json();
  // const date = new Date().toISOString();

  try {
    await mongooseconnect();

    if (!name || !desc || !walletAddress) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          statusText: "Error",
        }
      );
    }

    const image = `https://gateway.pinata.cloud/${imageCid}`;
    
    // const pinataOptions = {
    //   pinataMetadata: {
    //     name: `${name}_image`,
    //   },
    // };
    // console.log(image,pinataOptions);
    // const pinataResult = await pinata.pinFileToIPFS(image, pinataOptions);

    const artist = await Artist.create({
      name,
      image: image,
      // image:imageCid,
      desc,
      walletAddress,
      // date,
      albums: [],
      // community,
      earnings: 0,
      plays: 0,
    });
    console.log(`The artist data the api is sending is ${artist}`);
    return new Response(JSON.stringify(artist), {
      status: 200,
      statusText: "Success",
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ message: "Error fetching artist" }), {
      status: 400,
      statusText: "Error",
    });
  }
};
