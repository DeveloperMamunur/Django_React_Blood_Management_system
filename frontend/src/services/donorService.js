import api from "./api";

export const donorService = {
  async getAllDonors() {
    try {
      const response = await api.get("/donors/profiles/");
      console.log("Donors fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching donors:", error);
      return [];
    }
  },

  async createDonor(data) {
    try {
      const response = await api.post("/donors/profiles/", data);
      return response.data;
    } catch (error) {
      console.error("Error creating donor:", error);
      throw error;
    }
  },

  async getDonorById(id) {
    try {
      const response = await api.get(`/donors/profiles/${id}/`);
      console.log("Donor fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching donor:", error);
      return null;
    }
  },

  async updateDonor(id, data) {
    try {
      const response = await api.put(`/donors/profiles/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating donor:", error);
      throw error;
    }
  },

  async getDonorRecords() {
    try {
      const response = await api.get("/donors/records/");
      return response.data;
    } catch (error) {
      console.error("Error fetching donor records:", error);
      return [];
    }
  },

  async getDonorRecordById(id) {
    try {
      const response = await api.get(`/donors/records/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching donor record:", error);
      return null;
    }
  },
};
