import api from "./api";

export const requestService = {
    async getAllRequests() {
        try {
            const response = await api.get("/requests/");
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async createRequest(data) {
        try {
            const response = await api.post("/requests/", data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async getRequestById(id) {
        try {
            const response = await api.get(`/requests/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async updateRequest(id, data) {
        try {
            const response = await api.put(`/requests/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async deleteRequest(id) {
        try {
            const response = await api.delete(`/requests/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    }

}