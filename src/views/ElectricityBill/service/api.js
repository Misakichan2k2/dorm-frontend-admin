import { AxiosInstance } from "@/services/api";

class ApiElectricInvoice {
  // Get all electric invoices
  getAllElectricInvoices = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "electric-invoices",
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

  // Get electric invoice by ID
  getElectricInvoiceById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `electric-invoices/${id}`,
    });
  };

  // Create new electric invoice
  createElectricInvoice = async (data) => {
    return await AxiosInstance({
      method: "POST",
      url: "electric-invoices",
      data,
    });
  };

  // Update electric invoice
  updateElectricInvoice = async (id, data) => {
    return await AxiosInstance({
      method: "PUT",
      url: `electric-invoices/${id}`,
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

export const API_ELECTRIC_INVOICE = new ApiElectricInvoice();
