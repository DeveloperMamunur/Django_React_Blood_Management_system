import api from "./api";

export const analyticService = {
    async getDonationStats() {
        try {
            const response = await api.get("/analytics/donation-stats/");
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async getActivityLogs(page = 1, search = "", action = "ALL") {
        try {
            const params = new URLSearchParams();
            params.append("page", page);
            if (search) params.append("search", search);
            if (action !== "ALL") params.append("action", action);
            
            const response = await api.get(`/analytics/activity-logs/?${params.toString()}`);
            console.log(response.data);  
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
    async getRequestStates() {
        try {
            const response = await api.get("/analytics/request-views/");
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