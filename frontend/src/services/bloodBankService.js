import api from "./api";

export const bloodBankService = {
    async getAllBloodBanks () {
        try {
            const response = await api.get('/bloodbanks/');
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async createBloodBank (data) {
        try {
            const response = await api.post("/bloodbanks/", data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async getBloodBankById (id) {
        try {
            const response = await api.get(`/bloodbanks/${id}`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async updateBloodBank (id, data) {
        try {
            const response = await api.put(`/bloodbanks/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async deleteBloodBank (id) {
        try {
            const response = await api.delete(`/bloodbanks/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async getAllBloodsInventory (id) {
        try {
            const response = await api.get(`/bloodbanks/${id}/inventory/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async createBloodInventory (id,data) {
        try {
            const response = await api.post(`/bloodbanks/${id}/inventory/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async getBloodInventoryById (bank_id,id) {
        try {
            const response = await api.get(`/bloodbanks/${bank_id}/inventory/${id}`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async updateBloodInventory (bank_id,id, data) {
        try {
            const response = await api.put(`/bloodbanks/${bank_id}/inventory/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async deleteBloodInventory (bank_id,id) {
        try {
            const response = await api.delete(`/bloodbanks/${bank_id}/inventory/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async currentBloodBank () {
        try {
            const response = await api.get('/bloodbanks/current/');
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async allBloodBanksList () {
        try {
            const response = await api.get('/bloodbanks/all/');
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

};