import api from "./api";

export const hospitalService = {
    async getAllHospitals () {
        try {
            const response = await api.get('/hospitals/');
            // console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async createHospital (data) {
        try {
            const response = await api.post("/hospitals/", data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async getHospitalById (id) {
        try {
            const response = await api.get(`/hospitals/${id}`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    async updateHospital (id, data) {
        try {
            const response = await api.put(`/hospitals/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    }

};