import axios from "axios";


const api = axios.create({
  baseURL: "/", 
  headers: {
    "Content-Type": "application/json",
  },
});


export const fetchProperties = async () => {
  try {
    const response = await api.get("/api/properties");
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    throw error; 
  }
};


export const fetchPropertyByReference = async (reference) => {
  try {
    const response = await api.get(`/api/properties/reference/${reference}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch property with reference ${reference}:`, error);
    throw error;
  }
};

export const fetchPropertyById = async (propertyId) => {
  try {
    const response = await api.get(`/api/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch property with ID ${propertyId}:`, error);
    throw error;
  }
};

export default api;
