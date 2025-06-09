import { defineStore } from "pinia";
import { API_REGISTRATION } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreRegistration = defineStore("StoreRegistration", () => {
  const { setup } = RESPONSE();
  const API = API_REGISTRATION.API_REGISTRATION;

  // ADMIN
  const onActionGetAllRegistrations = async () => {
    return await setup({
      apiFunction: API.getAllRegistrations(),
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

  const onActionGetRegistrationById = async (id) => {
    return await setup({
      apiFunction: API.getRegistrationById(id),
    });
  };

  const onActionGetRegistrationsStatus = async (params) => {
    return await setup({
      apiFunction: API.getRegistrationsByStatus(params),
    });
  };

  const onActionUpdateRegistrationPaymentMethod = async (id, paymentMethod) => {
    return await setup({
      apiFunction: API.updateRegistrationPaymentMethod(id, paymentMethod),
    });
  };

  const onActionUpdateRegistrationStatus = async (id, status) => {
    return await setup({
      apiFunction: API.updateRegistrationStatus(id, status),
    });
  };

  const onActionUpdateRegisterFormDetail = async (id, registerFormDetail) => {
    return await setup({
      apiFunction: API.updateRegisterFormDetail(id, registerFormDetail),
    });
  };

  return {
    onActionGetAllRegistrations,
    onActionGetBuildings,
    onActionGetRooms,
    onActionGetRegistrationById,
    onActionUpdateRegistrationPaymentMethod,
    onActionUpdateRegistrationStatus,
    onActionUpdateRegisterFormDetail,
    onActionGetRegistrationsStatus,
  };
});
