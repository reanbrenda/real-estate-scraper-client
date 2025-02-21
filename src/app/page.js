
"use client";
import { useState, useEffect } from "react";
import { withAuth } from "../components/AuthGuard";
import Card from "../components/Card";
import Navigation from "../components/Navigation";
import { useRouter, useSearchParams } from 'next/navigation';


const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const fetchProperties = async (filters = {}) => {
  const { description, region, category, minPrice, maxPrice, bedrooms, bathrooms } = filters;
  const params = new URLSearchParams({
    skip: "0",
    limit: "100",
    ...(description && { description }),
    ...(region && { region }),
    ...(category && { category }),
    ...(minPrice && { min_price: minPrice }),
    ...(maxPrice && { max_price: maxPrice }),
    ...(bedrooms && { bedrooms }),
    ...(bathrooms && { bathrooms }),
  });

  const response = await fetch(`https://real-estate-scraper-api.onrender.com/properties?${params}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }

  return response.json();
};

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showSelectionMode, setShowSelectionMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Initialize states from URL parameters
  const [descriptionSearch, setDescriptionSearch] = useState(searchParams.get('description') || '');
  const [locationSearch, setLocationSearch] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minBedrooms, setMinBedrooms] = useState(Number(searchParams.get('bedrooms')) || 0);
  const [minBathrooms, setMinBathrooms] = useState(Number(searchParams.get('bathrooms')) || 0);

  const togglePropertySelection = (propertyId) => {
    setSelectedProperties(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      }
      return [...prev, propertyId];
    });
  };

  const selectAllProperties = () => {
    if (selectedProperties.length === filteredProperties.length) {
      // If all are selected, deselect all
      setSelectedProperties([]);
    } else {
      // Otherwise select all
      setSelectedProperties(filteredProperties.map(property => property.id));
    }
  };

  useEffect(() => {
    const loadFiltersFromURL = async () => {
      if (!searchParams.toString()) {
        // If no filters, load all properties
        try {
          setLoading(true);
          const data = await fetchProperties();
          setProperties(data || []);
          setFilteredProperties(data || []);
        } catch (err) {
          setError("Failed to fetch properties. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const filters = {
          description: searchParams.get('description'),
          region: searchParams.get('location'),
          category: searchParams.get('category'),
          minPrice: searchParams.get('minPrice'),
          maxPrice: searchParams.get('maxPrice'),
          bedrooms: searchParams.get('bedrooms'),
          bathrooms: searchParams.get('bathrooms'),
        };

        // Clean up empty filters
        Object.keys(filters).forEach(key => {
          if (!filters[key]) delete filters[key];
        });

        const filteredData = await fetchProperties(filters);
        setFilteredProperties(filteredData || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load filtered properties.");
      } finally {
        setLoading(false);
      }
    };

    loadFiltersFromURL();
  }, [searchParams]);

  const applyFilters = async () => {
    try {
      setLoading(true);
      const filters = {
        ...(descriptionSearch && { description: descriptionSearch }),
        ...(locationSearch && { location: locationSearch }),
        ...(category && { category }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(minBedrooms > 0 && { bedrooms: minBedrooms }),
        ...(minBathrooms > 0 && { bathrooms: minBathrooms }),
      };

      // Create URL parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Update URL without refreshing the page
      window.history.pushState({}, '', `?${params.toString()}`);

      const filteredData = await fetchProperties(filters);
      setFilteredProperties(filteredData || []);
      setSearchSuccess(true);
      setTimeout(() => {
        setSearchSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Failed to apply filters. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (property) => {
    const currentUrl = new URL(window.location.href);
    const queryString = currentUrl.search;
    router.push(`/property/${property.reference}${queryString}`);
  };

  const downloadFile = async (type) => {
    if (!showSelectionMode) {
      setShowSelectionMode(true);
      return;
    }

    if (selectedProperties.length === 0) {
      alert("Please select at least one property to download.");
      return;
    }

    setIsDownloading(true);

    try {
      const response = await fetch(
        type === "pdf"
          ? "https://real-estate-scraper-api.onrender.com/export/pdf"
          : "https://real-estate-scraper-api.onrender.com/export/csv",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ property_ids: selectedProperties }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please log in and try again.");
        }
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `properties.${type}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setShowSelectionMode(false);
      setSelectedProperties([]);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert(error.message || "Failed to download file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-xl font-bold text-gray-600">Loading properties...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-xl font-bold text-red-600">{error}</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-md rounded-lg">
            <div className="p-6 bg-[#E6FAF1]">
              <h1 className="text-3xl font-extrabold text-[#0C573C] text-center">
                Real Estate Listings
              </h1>
            </div>
            <div className="p-6 bg-white border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#0C573C] mb-2">
                  Context Search
                  </label>
                  <input
                    type="text"
                    value={descriptionSearch}
                    onChange={(e) => setDescriptionSearch(e.target.value)}
                    placeholder="e.g., pool, garden"
                    className="w-full p-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C573C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0C573C] mb-2">
                    Search Location
                  </label>
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="e.g., Cas Concos"
                    className="w-full p-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C573C]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0C573C] mb-2">
                    Property Type
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C573C] text-black"
                  >
                    <option value="" className="text-black">All Categories</option>
                    <option value="Plot of land" className="text-black">Plot of land</option>
                    <option value="Chalet / Villa" className="text-black">Chalet / Villa</option>
                    <option value="Finca / Country house" className="text-black">Finca / Country House</option>
                    <option value="Apartment" className="text-black">Apartment </option>
                    <option value="House" className="text-black">House</option>
                    <option value="Estate / Manor house" className="text-black"> Estate / Manor house</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-[#0C573C] mb-2">
                      Min Price
                    </label>
                    <input
                      type="text"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Min"
                      className="w-full p-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C573C]"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-[#0C573C] mb-2">
                      Max Price
                    </label>
                    <input
                      type="text"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Max"
                      className="w-full p-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C573C]"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-[#0C573C] mb-2">
                      Bedrooms
                    </label>
                    <input
                      type="number"
                      value={minBedrooms}
                      onChange={(e) => setMinBedrooms(Number(e.target.value))}
                      placeholder="Min"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C573C]"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-[#0C573C] mb-2">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={minBathrooms}
                      onChange={(e) => setMinBathrooms(Number(e.target.value))}
                      placeholder="Min"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0C573C]"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-4">
                  {showSelectionMode && (
                    <button
                      onClick={() => {
                        setShowSelectionMode(false);
                        setSelectedProperties([]);
                      }}
                      className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
                    >
                      Cancel Selection
                    </button>
                  )}
                  <button
                    onClick={() => downloadFile("pdf")}
                    disabled={isDownloading || (showSelectionMode && selectedProperties.length === 0)}
                    className={`px-4 py-2 rounded-md transition ${
                      isDownloading || (showSelectionMode && selectedProperties.length === 0)
                        ? "bg-gray-400 cursor-not-allowed text-gray-800"
                        : "bg-green-500 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isDownloading 
                      ? "Downloading PDF..." 
                      : showSelectionMode 
                        ? "Download Selected as PDF" 
                        : "Select Properties for PDF"}
                  </button>
                  <button
                    onClick={() => downloadFile("csv")}
                    disabled={isDownloading || (showSelectionMode && selectedProperties.length === 0)}
                    className={`px-4 py-2 rounded-md transition ${
                      isDownloading || (showSelectionMode && selectedProperties.length === 0)
                        ? "bg-green-400 cursor-not-allowed text-gray-800"
                        : "bg-green-900 text-white hover:bg-green-700"
                    }`}
                  >
                    {isDownloading 
                      ? "Downloading CSV..." 
                      : showSelectionMode 
                        ? "Download Selected as CSV" 
                        : "Select Properties for CSV"}
                  </button>
                </div>
                <button
                  onClick={applyFilters}
                  className={`px-6 py-2 rounded-md transition-all duration-300 ${
                    searchSuccess ? "bg-green-500 hover:bg-green-600" : "bg-[#0C573C] hover:bg-[#09422D]"
                  } text-white`}
                >
                  {searchSuccess ? "Search Successful!" : "Search Properties"}
                </button>
              </div>
            </div>
            {filteredProperties.length > 0 ? (
              <div className="p-6 bg-[#E6FAF1]">
                {showSelectionMode && (
                  <div className="mb-4 p-4 bg-white rounded-lg shadow">
                    <div className="flex justify-between items-center">
                      <p className="text-[#0C573C] font-medium">
                        Selected properties: {selectedProperties.length} of {filteredProperties.length}
                      </p>
                      <button
                        onClick={selectAllProperties}
                        className="px-4 py-2 rounded-md bg-[#0C573C] text-white hover:bg-[#09422D] transition"
                      >
                        {selectedProperties.length === filteredProperties.length ? "Deselect All" : "Select All"}
                      </button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <div key={property.id} className="relative">
                      {showSelectionMode && (
                        <div className="absolute top-2 right-2 z-10">
                          <input
                            type="checkbox"
                            checked={selectedProperties.includes(property.id)}
                            onChange={() => togglePropertySelection(property.id)}
                            className="w-5 h-5 cursor-pointer accent-[#0C573C]"
                          />
                        </div>
                      )}
                      <Card
                        key={property.id}
                        photo={property.photos?.[0] || "https://via.placeholder.com/300"}
                        price={formatPrice(property.price)}
                        squareMeter={property.square_meters === 0 ? "" : property.square_meters || "__"}
                        region={property.region === "None" ? "" : property.region || "Unknown"}
                        category={property.category === "None" ? "" : property.category || "Uncategorized"}
                        bedrooms={property.bedrooms || 0}
                        bathrooms={property.bathrooms || 0}
                        reference={property.reference || "No reference"}
                        selectable={showSelectionMode}
                        selected={selectedProperties.includes(property.id)}
                        onSelect={() => togglePropertySelection(property.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-[#E6FAF1]">
                <p className="text-xl text-gray-500">
                  No properties found. Try adjusting your search filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default withAuth(Home);