"use client";
import { useState, useEffect } from "react";
import { fetchProperties } from "./api/properties";
import { withAuth } from "../components/AuthGuard";
import Card from "../components/Card";
import Navigation from "../components/Navigation";

function Home() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchSuccess, setSearchSuccess] = useState(false);

  // Filter states
  const [descriptionSearch, setDescriptionSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [minBathrooms, setMinBathrooms] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const loadProperties = async () => {
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
    };
    loadProperties();
  }, []);

  const applyFilters = () => {
    const filtered = properties.filter((property) => {
      const price = property.price || 0;
      const region = property.region?.toLowerCase() || "";
      const reference = property.reference?.toLowerCase() || "";
      const description = property.description?.toLowerCase() || "";
      const categoryValue = property.category?.toLowerCase() || "";
      const bedrooms = property.bedrooms || 0;
      const bathrooms = property.bathrooms || 0;

      return (
        description.includes(descriptionSearch.toLowerCase()) &&
        region.includes(locationSearch.toLowerCase()) &&
        (minPrice === "" || price >= Number(minPrice)) &&
        (maxPrice === "" || price <= Number(maxPrice)) &&
        (category === "" || categoryValue === category) &&
        bedrooms >= minBedrooms &&
        bathrooms >= minBathrooms
      );
    });
    setFilteredProperties(filtered);
    setSearchSuccess(true);
    setTimeout(() => {
      setSearchSuccess(false);
    }, 2000);
  };

  const downloadFile = async (type) => {
    const propertyIds = filteredProperties.map((property) => property.id);
    if (propertyIds.length === 0) {
      alert("No properties selected for download.");
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
          body: JSON.stringify({ property_ids: propertyIds }),
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
                    Search description
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
                    <option value="plot of land" className="text-black">Plot of Land</option>
                    <option value="apartment" className="text-black">Apartment</option>
                    <option value="chalet / villa" className="text-black">Chalet / Villa</option>
                    <option value="finca / country house" className="text-black">Finca / Country House</option>
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
              <div className="mt-6 text-right">
                <button
                  onClick={applyFilters}
                  className={`px-6 py-2 rounded-md transition-all duration-300 ${
                    searchSuccess
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-[#0C573C] hover:bg-[#09422D]"
                  } text-white`}
                >
                  {searchSuccess ? "Search Successful!" : "Search Properties"}
                </button>
              </div>
            </div>
            {filteredProperties.length > 0 ? (
              <div className="p-6 bg-[#E6FAF1]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <Card
                      key={property.id}
                      photo={property.photos?.[0] || "https://via.placeholder.com/300"}
                      price={property.price || "$"}
                      squareMeter={property.square_meters || "__"}
                      region={property.region || "Unknown"}
                      category={property.category || "Uncategorized"}
                      bedrooms={property.bedrooms || 0}
                      bathrooms={property.bathrooms || 0}
                      reference={property.reference || "No reference"}
                    />
                  ))}
                </div>
                <div className="mt-6 flex space-x-4 justify-end">
                  <button
                    onClick={() => downloadFile("pdf")}
                    disabled={isDownloading}
                    className={`px-4 py-2 rounded-md transition ${
                      isDownloading
                        ? "bg-gray-400 cursor-not-allowed text-gray-800"
                        : "bg-green-500 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isDownloading ? "Downloading PDF..." : "Download as PDF"}
                  </button>
                  <button
                    onClick={() => downloadFile("csv")}
                    disabled={isDownloading}
                    className={`px-4 py-2 rounded-md transition ${
                      isDownloading
                        ? "bg-green-400 cursor-not-allowed text-gray-800"
                        : "bg-green-900 text-white hover:bg-green-700"
                    }`}
                  >
                    {isDownloading ? "Downloading CSV..." : "Download as CSV"}
                  </button>
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