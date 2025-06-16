import { AxiosInstance } from "@/services/api";

class ApiStatistics {
  // Get all reports
  getStatistics = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "reports",
    });
  };

  getRegistrationStatistics = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "registration/statistics",
    });
  };

  getIncomeStatistics = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "students/room-income",
    });
  };

  // Get All buildings
  getBuildings = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "buildings",
    });
  };
}

export const API_STATISTICS = new ApiStatistics();
