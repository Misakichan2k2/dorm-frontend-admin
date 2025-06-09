import { defineStore } from "pinia";
import { API_ACCOUNT } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreAccount = defineStore("StoreAccount", () => {
  const { setup } = RESPONSE();
  const API = API_ACCOUNT.API_ACCOUNT;

  // Lấy tất cả tài khoản
  const onActionGetAllAccounts = async () => {
    return await setup({
      apiFunction: API.getAllAccounts(),
    });
  };

  // Lấy tài khoản theo ID
  const onActionGetAccountById = async (id) => {
    return await setup({
      apiFunction: API.getAccountById(id),
    });
  };

  // Ban tài khoản
  const onActionUpdateStatusBan = async (id) => {
    return await setup({
      apiFunction: API.updateStatusBan(id),
    });
  };

  const onActionUpdateStatus = async (id, status) => {
    return await setup({
      apiFunction: API.updateStatus(id, status),
    });
  };

  // Xóa tài khoản thật sự
  const onActionDeleteAccount = async (id) => {
    return await setup({
      apiFunction: API.deleteAccount(id),
    });
  };

  const onActionGetRegistrationById = async (id) => {
    return await setup({
      apiFunction: API.getRegistrationById(id),
    });
  };

  return {
    onActionGetAllAccounts,
    onActionGetAccountById,
    onActionUpdateStatusBan,
    onActionUpdateStatus,
    onActionDeleteAccount,
    onActionGetRegistrationById,
  };
});
