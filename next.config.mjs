/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/properties',
          destination: 'https://real-estate-scraper-api.onrender.com/properties'
        },
      {
          source: '/api/properties/reference/:reference',
          destination: 'https://real-estate-scraper-api.onrender.com/properties/reference/:reference'
      },
      {
        source: '/api/properties/:propertyId',
        destination: 'https://real-estate-scraper-api.onrender.com/properties/:propertyId',
      },
        
      ]
    }
  }
  
  export default nextConfig
