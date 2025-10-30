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
    }

};