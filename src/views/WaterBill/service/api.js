import { AxiosInstance } from "@/services/api";

class ApiWaterInvoice {
  // Get all water invoices
  getAllWaterInvoices = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "water-invoices",
    });
  };

  // Get All buildings
  getBuildings = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "buildings",
    });
  };

  // Get rooms
  getRooms = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "rooms",
    });
  };

  // Get water invoice by ID
  getWaterInvoiceById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `water-invoices/${id}`,
    });
  };

  // Create new water invoice
  createWaterInvoice = async (data) => {
    return await AxiosInstance({
      method: "POST",
      url: "water-invoices",
      data: data,
    });
  };

  // Update water invoice
  updateWaterInvoice = async (id, data) => {
    return await AxiosInstance({
      method: "PUT",
      url: `water-invoices/${id}`,
      data,
    });
  };

  getInvoiceByRoomMonth = async (roomId, month, year) => {
    return await AxiosInstance({
      method: "GET",
      url: "electric-invoices/by-room-month",
      params: { roomId, month, year },
    });
  };
}

export const API_WATER_INVOICE = new ApiWaterInvoice();
