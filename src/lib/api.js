import axios from "axios";

export const fetchProperties = async () => {
    try {
        const response = await axios.get("/api/properties"); // Internal API route
        return response.data;
    } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
    }
};


