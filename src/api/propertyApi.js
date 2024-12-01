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

export default api;
