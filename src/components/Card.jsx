import Link from "next/link";

const Card = ({ 
  photo, 
  price, 
  squareMeter, 
  region, 
  category, 
  bedrooms, 
  bathrooms, 
  description, 
  reference,
  selectable = false,
  selected = false,
  onSelect = () => {},
  disabled = false 
}) => {
  const CardContent = (
    <div className="relative group">
      {selectable && (
        <div 
          onClick={(e) => {
            e.preventDefault();
            if (!disabled) onSelect();
          }}
          className={`absolute inset-0 z-20 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            selected ? 'opacity-100' : ''
          } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            selected 
              ? 'bg-[#0C573C] border-[#0C573C]' 
              : 'bg-white border-gray-300'
          }`}>
            {selected && (
              <span className="text-white text-sm leading-none" style={{
                transform: 'rotate(45deg)',
                display: 'block',
                marginTop: '-2px',
                fontSize: '20px'
              }}>
                ✓
              </span>
            )}
          </div>
        </div>
      )}
      
      <div className="border rounded-lg shadow-lg overflow-hidden group-hover:shadow-xl transition-all duration-300">
        <div className="relative">
          <img src={photo} alt={description} className="w-full h-48 object-cover" />
          {selected && (
            <div className="absolute inset-0 bg-[#0C573C]/20" />
          )}
        </div>

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
      </div>
    </div>
  );

  return selectable ? (
    <div>{CardContent}</div>
  ) : (
    <Link href={`/property/${reference}`}>
      {CardContent}
    </Link>
  );
};

export default Card;

