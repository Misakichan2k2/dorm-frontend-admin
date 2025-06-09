import { AxiosInstance } from "@/services/api";

class ApiReport {
  // Get all reports
  getAllReports = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "reports",
    });
  };

  // Get All buildings
  getBuildings = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "buildings",
    });
  };

  // Get rooms
  getRooms = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "rooms",
    });
  };

  // Get report by ID
  getReportById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `reports/${id}`,
    });
  };

  // Update report status
  updateReportStatus = async (id, status) => {
    return await AxiosInstance({
      method: "PUT",
      url: `reports/${id}/status`,
      data: { status },
    });
  };
}

export const API_REPORT = new ApiReport();
