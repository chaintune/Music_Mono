'use client'
import TopTracks from '@/components/topTracksCard/TopTracks'
import NFTCollection from '@/components/nftCard/NFTCollection'
import ArtistBar from "@/components/ArtistBar"
import DiscoverArtist from "@/components/discoverArtistCard/discoverArtist"
import { Layout } from '@/components'

const Home_page = () => {
  return ( 
    <Layout>
      <ArtistBar/>
      <TopTracks/>
      <NFTCollection/>
      <DiscoverArtist/>
    </Layout>
   );
}
 
export default Home_page;