import axios, { AxiosResponse } from 'axios';

export default class IPFSManager {

  
    public async handleUploadToIPFS(file: File, uploadType: string) {

      const formData = new FormData();
      formData.append('file', file);
  
      const metadata = JSON.stringify({
        name: `${file.name}`,
      });
      formData.append('pinataMetadata', metadata);
  
      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);
  
      try {
        const resFile = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            maxBodyLength: Infinity,
            headers: {
              'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT}`,
            },
          }
        );
  
        console.log(resFile.data.IpfsHash);
        return resFile.data.IpfsHash;  
      } catch (error) {
        console.log('Error: ', error);
      }
      
    }
  }