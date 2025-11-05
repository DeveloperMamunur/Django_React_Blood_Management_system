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
    async allCampaigns () {
        try {
            const response = await api.get('/auth/campaigns/all/');
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async createCampaign(formData) {
        try {
            const response = await api.post("/campaigns/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
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
            const response = await api.put(`/campaigns/${id}/`, data,{
            headers: { "Content-Type": "multipart/form-data" },
            });
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

    async getCampaignRegistrationDonors (campaignId) {
        try {
            const response = await api.get(`/campaigns/${campaignId}/registrations/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async createCampaignRegistrationDonor (campaignId, data) {
        try {
            const response = await api.post(`/campaigns/${campaignId}/registrations/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async getCampaignRegistrationDonorById (campaignId, id) {
        try {
            const response = await api.get(`/campaigns/${campaignId}/registrations/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async updateCampaignRegistrationDonor (campaignId, id, data) {
        try {
            const response = await api.put(`/campaigns/${campaignId}/registrations/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async deleteCampaignRegistrationDonor (campaignId, id) {
        try {
            const response = await api.delete(`/campaigns/${campaignId}/registrations/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async listCampaigns () {
        try {
            const response = await api.get('/campaigns/list/');
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async currentCampaign (id) {
        try {
            const response = await api.get(`/campaigns/details/${id}/`);
            console.log(response.data);
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    }
}