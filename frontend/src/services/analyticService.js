import api from "./api";

export const analyticService = {
    async getAllStats() {
        try {
            const response = await api.get("/analytics/donation-stats/");
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async getActivityLogs() {
        try {
            const response = await api.get("/analytics/activity-logs/");
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async getRequestViewStats() {
        try {
            const response = await api.get("/analytics/view-stats/");
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async getNearbyDonors() {
        try {
            const response = await api.get("/nearby/");
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    
};