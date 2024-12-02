"use client";

import { useState, useEffect } from "react";
import { fetchProperties } from "./propertyApi";
import Card from "../components/Card";

export default function Home() {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [category, setCategory] = useState("");
    const [minBedrooms, setMinBedrooms] = useState(0);
    const [minBathrooms, setMinBathrooms] = useState(0);

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
            const categoryValue = property.category?.toLowerCase() || "";
            const bedrooms = property.bedrooms || 0;
            const bathrooms = property.bathrooms || 0;

            return (
                (region.includes(search.toLowerCase()) || reference.includes(search.toLowerCase())) &&
                (minPrice === "" || price >= Number(minPrice)) &&
                (maxPrice === "" || price <= Number(maxPrice)) &&
                (category === "" || categoryValue === category) &&
                bedrooms >= minBedrooms &&
                bathrooms >= minBathrooms
            );
        });
        setFilteredProperties(filtered);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl font-bold text-gray-600">Loading properties...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-xl font-bold text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
                        <h1 className="text-4xl font-extrabold text-white text-center tracking-tight">
                            Real Estate Listings
                        </h1>
                    </div>

                    <div className="p-6 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search Location
                                </label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="e.g., Cas Concos"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Property Type
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-black"
                                >
                                    <option value="" className="text-black bg-white">
                                        All Categories
                                    </option>
                                    <option value="plot of land" className="text-black bg-white">
                                        Plot of Land
                                    </option>
                                    <option value="chalet / villa" className="text-black bg-white">
                                        Chalet / Villa
                                    </option>
                                </select>
                            </div>

                            <div className="flex space-x-2">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Min Price
                                    </label>
                                    <input
                                        type="text"
                                        value={minPrice}
                                        onChange={(e) => {

                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                            setMinPrice(value);
                                        }}
                                        placeholder="Min"
                                        className="text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Price
                                    </label>
                                    <input
                                        type="text"
                                        value={maxPrice}
                                        onChange={(e) => {
                                            // Allow only numbers and empty string
                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                            setMaxPrice(value);
                                        }}
                                        placeholder="Max"
                                        className="text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bedrooms
                                    </label>
                                    <input
                                        type="number"
                                        value={minBedrooms}
                                        onChange={(e) => setMinBedrooms(Number(e.target.value))}
                                        placeholder="Min"
                                        className="text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bathrooms
                                    </label>
                                    <input
                                        type="number"
                                        value={minBathrooms}
                                        onChange={(e) => setMinBathrooms(Number(e.target.value))}
                                        placeholder="Min"
                                        className="text-black w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={applyFilters}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                            >
                                Search Properties
                            </button>
                        </div>
                    </div>

                    {filteredProperties.length > 0 ? (
                        <div className="p-6 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProperties.map((property) => (
                                    <Card
                                        key={property.id}
                                        photo={property.photos?.[0] || "https://via.placeholder.com/300"}
                                        price={property.price !== null ? property.price : "$"}
                                        squareMeter={property.square_meters || "__"}
                                        region={property.region || "Unknown"}
                                        category={property.category || "Uncategorized"}
                                        bedrooms={property.bedrooms || 0}
                                        bathrooms={property.bathrooms || 0}
                                        reference={property.reference || "No reference"}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-12 text-center bg-gray-50">
                            <p className="text-xl text-gray-500">
                                No properties found. Try adjusting your search filters.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}