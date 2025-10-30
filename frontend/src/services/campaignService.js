import api from "./api";

export const campaignService = {
    async getAllCampaigns () {
        try {
            const response = await api.get('/campaigns/');
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async createCampaign (data) {
        try {
            const response = await api.post("/campaigns/", data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async getCampaignById (id) {
        try {
            const response = await api.get(`/campaigns/${id}`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async updateCampaign (id, data) {
        try {
            const response = await api.put(`/campaigns/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async deleteCampaign (id) {
        try {
            const response = await api.delete(`/campaigns/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async getCampaignRegistrations () {
        try {
            const response = await api.get("/campaigns/registrations/");
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async createCampaignRegistration (data) {
        try {
            const response = await api.post("/campaigns/registrations/", data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async getCampaignRegistrationById (id) {
        try {
            const response = await api.get(`/campaigns/registrations/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async updateCampaignRegistration (id, data) {
        try {
            const response = await api.put(`/campaigns/registrations/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async deleteCampaignRegistration (id) {
        try {
            const response = await api.delete(`/campaigns/registrations/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    }
}