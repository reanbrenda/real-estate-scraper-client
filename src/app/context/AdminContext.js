"use client";

import { fetchPropertyByReference } from "../../api/properties";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const PhotoModal = ({ photos, currentPhotoIndex, onClose, onNext, onPrevious }) => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div className="max-w-[90vw] max-h-[90vh] relative">
      <button
        onClick={onClose}
        className="absolute -top-10 right-0 text-white text-xl hover:text-gray-300"
      >
        Close ×
      </button>
      
      {/* Previous Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevious();
        }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <img
        src={photos[currentPhotoIndex]}
        alt={`Property photo ${currentPhotoIndex + 1}`}
        className="max-w-full max-h-[85vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Photo Counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
        {currentPhotoIndex + 1} / {photos.length}
      </div>
    </div>
  </div>
);

export default function Property() {
    const params = useParams();
    const { reference } = params;
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(null);

    useEffect(() => {
        if (!reference) return;

        const getProperty = async () => {
            try {
                const fetchedProperty = await fetchPropertyByReference(reference);
                setProperty(fetchedProperty);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch property:", error);
                setError("The property you are looking for does not exist.");
                setLoading(false);
            }
        };

        getProperty();
    }, [reference]);

    const handlePreviousPhoto = () => {
        setCurrentPhotoIndex((prev) => 
            prev === 0 ? property.photos.length - 1 : prev - 1
        );
    };

    const handleNextPhoto = () => {
        setCurrentPhotoIndex((prev) => 
            prev === property.photos.length - 1 ? 0 : prev + 1
        );
    };

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (currentPhotoIndex === null) return;
            
            if (e.key === 'ArrowLeft') {
                handlePreviousPhoto();
            } else if (e.key === 'ArrowRight') {
                handleNextPhoto();
            } else if (e.key === 'Escape') {
                setCurrentPhotoIndex(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPhotoIndex]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Property...</h2>
                    <p className="text-gray-600">Please wait while we load the property details.</p>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {currentPhotoIndex !== null && (
                <PhotoModal 
                    photos={property.photos}
                    currentPhotoIndex={currentPhotoIndex}
                    onClose={() => setCurrentPhotoIndex(null)}
                    onNext={handleNextPhoto}
                    onPrevious={handlePreviousPhoto}
                />
            )}
            
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="relative">
                    <img
                        src={property.photos[0]}
                        alt={property.description}
                        className="w-full h-[500px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setCurrentPhotoIndex(0)}
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
                        <span className="text-xl font-bold">${property.price.toLocaleString()}</span>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            {property.category}
                        </h1>
                        <div className="flex items-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-lg">{property.region}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <div>
                                <p className="text-sm text-gray-600">Square Meters</p>
                                <p className="font-bold text-black">{property.square_meters === 0 ? 'n/a sqm' : `${property.square_meters} sqm`}</p>
                            </div>
                        </div>
                        <div className="bg-gray-200 p-4 rounded-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16H4a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <div>
                                <p className="text-sm text-gray-600">Bedrooms</p>
                                <p className="font-bold text-black">{property.bedrooms}</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <div>
                                <p className="text-sm text-gray-600">Bathrooms</p>
                                <p className="font-bold text-black">{property.bathrooms}</p>
                            </div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a2 2 0 012-2z" />
                            </svg>
                            <div>
                                <p className="text-sm text-gray-600">Reference</p>
                                <p className="font-bold text-black">{property.reference}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <a 
                            className="underline text-2xl text-blue-600 hover:text-blue-800 visited:text-purple-600" 
                            href={property.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Visit Website!
                        </a>
                        <br/><br/>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project description</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {property.description}
                        </p>
                    </div>

                    {property.photos.length > 1 && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Photos</h2>
                            <div className="grid grid-cols-3 gap-4">
                                {property.photos.slice(1).map((photo, index) => (
                                    <img 
                                        key={index} 
                                        src={photo} 
                                        alt={`Property photo ${index + 2}`} 
                                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => setCurrentPhotoIndex(index + 1)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}