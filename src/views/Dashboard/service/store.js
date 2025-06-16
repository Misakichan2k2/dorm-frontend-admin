import { defineStore } from "pinia";
import { API_DASHBOARD } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreDashboard = defineStore("StoreDashboard", () => {
  const { setup } = RESPONSE();
  const API = API_DASHBOARD.API_DASHBOARD;

  // Get all reports
  const onActionGetReportStatistics = async () => {
    return await setup({
      apiFunction: API.getStatistics(),
    });
  };

  const onActionGetIncomeStatistics = async () => {
    return await setup({
      apiFunction: API.getIncomeStatistics(),
    });
  };

  const onActionGetRegistrationStatistics = async () => {
    return await setup({
      apiFunction: API.getRegistrationStatistics(),
    });
  };

  return {
    onActionGetReportStatistics,
    onActionGetRegistrationStatistics,
    onActionGetIncomeStatistics,
  };
});
