import api from "./api";


export const receiverService = {
    async getAllReceivers () {
        try {
            const response = await api.get('/receivers/');
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async createReceiver (data) {
        try {
            const response = await api.post("/receivers/", data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async getReceiverById (id) {
        try {
            const response = await api.get(`/receivers/${id}`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async updateReceiver (id, data) {
        try {
            const response = await api.put(`/receivers/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    }
};