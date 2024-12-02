import Link from "next/link";

const Card = ({ photo, price, squareMeter, region, category, bedrooms, bathrooms, description, reference }) => {
    return (
        <Link href={`/property/${reference}`} className="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
           
            <img src={photo} alt={description} className="w-full h-48 object-cover" />

            
            <div className="p-4">
                <h2 className="text-xl font-bold text-blue-800">{category}</h2>
                <p className="text-gray-600">{region}</p>
                <p className="text-lg font-semibold text-gray-800">${price}</p>
                <p className="text-gray-500">{squareMeter} sqm</p>
                <div className="flex justify-between mt-4 text-sm text-gray-700">
                    <span>{bedrooms} Bedrooms</span>
                    <span>{bathrooms} Bathrooms</span>
                </div>
                <p className="mt-2 text-sm text-gray-500 truncate">{description}</p>
            </div>
        </Link>
    );
};

export default Card;

