import { defineStore } from "pinia";
import { API_RENEWAL } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreRenewal = defineStore("StoreRenewal", () => {
  const { setup } = RESPONSE();
  const API = API_RENEWAL.API_RENEWAL;

  // ADMIN
  const onActionGetAllRenewals = async () => {
    return await setup({
      apiFunction: API.getAllRenewal(),
    });
  };

  const onActionGetRenewalByParams = async (params) => {
    return await setup({
      apiFunction: API.getRenewalByParams(params),
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

  const onActionGetRenewalById = async (id) => {
    return await setup({
      apiFunction: API.getRenewalById(id),
    });
  };

  const onActionUpdateRenewalStatus = async (id, status) => {
    return await setup({
      apiFunction: API.updateRenewalStatus(id, status),
    });
  };

  const onActionUpdateRenewalPaymentMethod = async (id, paymentMethod) => {
    return await setup({
      apiFunction: API.updateRenewalPaymentMethod(id, paymentMethod),
    });
  };

  const onActionUpdateRenewalFormDetail = async (id, data) => {
    return await setup({
      apiFunction: API.updateRenewalFormDetail(id, data),
    });
  };

  return {
    onActionGetAllRenewals,
    onActionGetRenewalById,
    onActionUpdateRenewalStatus,
    onActionUpdateRenewalFormDetail,
    onActionGetRenewalByParams,
    onActionGetBuildings,
    onActionGetRooms,
    onActionUpdateRenewalPaymentMethod,
  };
});
