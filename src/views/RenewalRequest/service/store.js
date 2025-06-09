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

  const onActionGetRenewalById = async (id) => {
    return await setup({
      apiFunction: API.getRenewalById(id),
    });
  };

  const onActionUpdateRenewalStatus = async (id, payload) => {
    return await setup({
      apiFunction: API.updateRenewalStatus(id, payload),
    });
  };

  const onActionUpdateRenewalFormDetail = async (id, payload) => {
    return await setup({
      apiFunction: API.updateRenewalFormDetail(id, payload),
    });
  };

  return {
    onActionGetAllRenewals,
    onActionGetRenewalById,
    onActionUpdateRenewalStatus,
    onActionUpdateRenewalFormDetail,
  };
});
