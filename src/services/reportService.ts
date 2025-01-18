import axios from "../utils/axios";

// Create a new report
export const createReport = async (
  reported: string,
  reportedType: string,
  desc: string
) => {
  try {
    const response = await axios.post(`/report/create`, {
      reported,
      reportedType,
      desc,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
};

// Get all reports
export const getAllReports = async () => {
  try {
    const { data } = await axios.get(`/report/all`);
    return data.reports || [];
  } catch (error) {
    console.error("Error getting all reports:", error);
    throw error;
  }
};

// Get a report by ID
export const getReportById = async (reportId: string) => {
  try {
    const { data } = await axios.get(`/report/id/${reportId}`);
    return data.report;
  } catch (error) {
    console.error("Error getting report by ID:", error);
    throw error;
  }
};

// Update a report by ID
export const updateReport = async (reportId: string, desc: string) => {
  try {
    const response = await axios.put(`/report/update/${reportId}`, { desc });
    return response.data;
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
};

// Delete a report by ID
export const deleteReport = async (reportId: string) => {
  try {
    const response = await axios.delete(`/report/delete/${reportId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
};
