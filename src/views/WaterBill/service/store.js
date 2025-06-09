import { defineStore } from "pinia";
import { API_WATER_INVOICE } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreWaterInvoice = defineStore("StoreWaterInvoice", () => {
  const { setup } = RESPONSE();
  const API = API_WATER_INVOICE.API_WATER_INVOICE;

  // Get all
  const onActionGetAllWaterInvoices = async () => {
    return await setup({
      apiFunction: API.getAllWaterInvoices(),
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
  const onActionGetWaterInvoiceById = async (id) => {
    return await setup({
      apiFunction: API.getWaterInvoiceById(id),
    });
  };

  // Create
  const onActionCreateWaterInvoice = async (data) => {
    return await setup({
      apiFunction: API.createWaterInvoice(data),
    });
  };

  // Update
  const onActionUpdateWaterInvoice = async (id, data) => {
    return await setup({
      apiFunction: API.updateWaterInvoice(id, data),
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
    onActionGetAllWaterInvoices,
    onActionGetBuildings,
    onActionGetRooms,
    onActionGetWaterInvoiceById,
    onActionCreateWaterInvoice,
    onActionUpdateWaterInvoice,
    onGetInvoiceByRoomMonth,
  };
});
