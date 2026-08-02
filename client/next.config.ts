/** @type {import('next').NextConfig} */
const nextConfig = {
     
 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      
      },

     
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
       {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com'
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com'
      }
      ,{
        protocol: 'https',
        hostname: 'tableo.com'
      },
       {
        protocol: 'https',
        hostname: 'images.pexels.com'
      }
  ,
      {
        protocol: 'https',
        hostname: 'www.google.com',
        
      }
    ],
  },

};

export default nextConfig;
