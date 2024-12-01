/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/properties',
          destination: 'https://real-estate-scraper-api.onrender.com/properties'
        }
      ]
    }
  }
  
  export default nextConfig
