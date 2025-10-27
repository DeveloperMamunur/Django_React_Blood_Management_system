import api, { getAccessToken } from "./api"

export const authService = {
    async login(credentials) {
        try {
            const response = await api.post('/auth/login/', {
            username: credentials.username,
            password: credentials.password
        });
        return {
            token: response.data.access,
            refresh: response.data.refresh,
            user: {
                id: response.data.user_id,
                username: response.data.username,
            }
        }
        } catch (error) {
            const errorMessage = 
                error.response?.data?.error ||
                error.response?.data?.detail ||
                error.response?.data?.message ||
                error.response?.data?.non_field_errors?.[0] ||
                (error.response?.status === 401 ? 'The password or username does not match' : null) ||
                'Login failed. Please try again.';
            
            throw new Error(errorMessage);
        }
    },

    async register(userData) {
        try {
            await api.post('/auth/register/', {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                password2: userData.password2,
                role: userData.role
            });
            return this.login({
                username: userData.username,
                password: userData.password
            });
        } catch (error) {
            throw new Error(error.response?.data?.error ||'Registration failed. Please check your information and try again.');
        }
    },

    async getCurrentUser() {
        try {
            const token = getAccessToken();
            if (!token) throw new Error("No access token");
            const response = await api.get('/auth/user/profile/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            
            return response.data.user || response.data;
        } catch (error) {
            console.log(error);
            
        }
    }
}

export default api;