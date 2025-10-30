import api from "./api";

export const locationService = {
    async getAllLocations() {
        try {
            const response = await api.get("/locations/");
            return response.data;
        } catch (error) {
            console.error("Error fetching locations:", error);
            return [];
        }
    },
    async getLocationById(id) {
        try {
            const response = await api.get(`/locations/${id}/`);
            return response.data;
        } catch (error) {
            console.error("Error fetching location:", error);
            return null;
        }
    },
};