import { defineStore } from "pinia";
import { API_REPORT } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreReport = defineStore("StoreReport", () => {
  const { setup } = RESPONSE();
  const API = API_REPORT.API_REPORT;

  // Get all reports
  const onActionGetAllReports = async () => {
    return await setup({
      apiFunction: API.getAllReports(),
    });
  };

  // Get All Buidings
  const onActionGetBuildings = async () => {
    return await setup({
      apiFunction: API.getBuildings(),
    });
  };

  // Get All rooms
  const onActionGetRooms = async () => {
    return await setup({
      apiFunction: API.getRooms(),
    });
  };

  // Get report by ID
  const onActionGetReportById = async (id) => {
    return await setup({
      apiFunction: API.getReportById(id),
    });
  };

  // Update report status
  const onActionUpdateReportStatus = async (id, status) => {
    return await setup({
      apiFunction: API.updateReportStatus(id, status),
    });
  };

  return {
    onActionGetAllReports,
    onActionGetBuildings,
    onActionGetRooms,
    onActionGetReportById,
    onActionUpdateReportStatus,
  };
});
