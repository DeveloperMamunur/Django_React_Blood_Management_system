import api from "./api";

export const userService = {
    async getAllUsers() {
        try {
            const response = await api.get('/users/');
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    
    async createUser(data) {
        try {
            const response = await api.post("/users/", data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async getUserById(id) {
        try {
            const response = await api.get(`/users/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async updateUser(id, data) {
        try {
            const response = await api.put(`/users/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async deleteUser(id) {
        try {
            const response = await api.delete(`/users/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async toggleStatus(id, data) {
        try {
            const response = await api.patch(`/users/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

    // admin services 
    async getAdminProfile() {
        try {
            const response = await api.get('/admin/');
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async createAdminProfile(data) {
        try {
            const response = await api.post('/admin/', data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async adminProfileById(id) {
        try {
            const response = await api.get(`/admin/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async updateAdminProfile(id, data) {
        try {
            const response = await api.put(`/admin/${id}/`, data);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async deleteAdminProfile(id) {
        try {
            const response = await api.delete(`/admin/${id}/`);
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },
    async currentAdminProfile() {
        try {
            const response = await api.get('/admin/current-profile/');
            console.log(response.data);
            
            return response.data;    
        } catch (error) {
            console.log(error);
        }
    },

};