import { defineStore } from "pinia";
import { API_STATISTICS } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreStatistics = defineStore("StoreStatistics", () => {
  const { setup } = RESPONSE();
  const API = API_STATISTICS.API_STATISTICS;

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

  // Get All Buidings
  const onActionGetBuildings = async () => {
    return await setup({
      apiFunction: API.getBuildings(),
    });
  };

  return {
    onActionGetReportStatistics,
    onActionGetRegistrationStatistics,
    onActionGetBuildings,
    onActionGetIncomeStatistics,
  };
});
