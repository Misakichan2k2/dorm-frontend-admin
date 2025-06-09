import { defineStore } from "pinia";
import { API_ELECTRIC_INVOICE } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreElectricInvoice = defineStore("StoreElectricInvoice", () => {
  const { setup } = RESPONSE();
  const API = API_ELECTRIC_INVOICE.API_ELECTRIC_INVOICE;

  // Get all
  const onActionGetAllElectricInvoices = async () => {
    return await setup({
      apiFunction: API.getAllElectricInvoices(),
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

  // Get by ID
  const onActionGetElectricInvoiceById = async (id) => {
    return await setup({
      apiFunction: API.getElectricInvoiceById(id),
    });
  };

  // Create
  const onActionCreateElectricInvoice = async (data) => {
    return await setup({
      apiFunction: API.createElectricInvoice(data),
    });
  };

  // Update
  const onActionUpdateElectricInvoice = async (id, data) => {
    return await setup({
      apiFunction: API.updateElectricInvoice(id, data),
    });
  };

  const onGetInvoiceByRoomMonth = async (roomId, month, year) => {
    try {
      const res = await API.getInvoiceByRoomMonth(roomId, month, year);
      return res.data;
    } catch (err) {
      console.error("Lỗi lấy chỉ số cũ:", err);
      return null;
    }
  };

  return {
    onActionGetAllElectricInvoices,
    onActionGetBuildings,
    onActionGetRooms,
    onActionGetElectricInvoiceById,
    onActionCreateElectricInvoice,
    onActionUpdateElectricInvoice,
    onGetInvoiceByRoomMonth,
  };
});
