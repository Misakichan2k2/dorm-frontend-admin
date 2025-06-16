import { AxiosInstance } from "@/services/api";

class ApiDashboard {
  // Get all reports
  getStatistics = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "reports/statistics/category",
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
}

export const API_DASHBOARD = new ApiDashboard();
