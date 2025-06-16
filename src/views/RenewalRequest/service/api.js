import { AxiosInstance } from "@/services/api";

class ApiRenewal {
  // ADMIN - Lấy tất cả đơn
  getAllRenewal = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "renewals",
    });
  };

  getRenewalByParams = async (params) => {
    return await AxiosInstance({
      method: "GET",
      url: "renewals/renewals",
      params,
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

  // ADMIN - Lấy đơn theo ID
  getRenewalById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `renewals/${id}`,
    });
  };

  // ADMIN - Cập nhật trạng thái đơn
  updateRenewalStatus = async (id, status) => {
    return await AxiosInstance({
      method: "PATCH",
      url: `renewals/${id}/status`,
      data: { status },
    });
  };

  updateRenewalPaymentMethod = async (id, paymentMethod) => {
    return await AxiosInstance({
      method: "PATCH",
      url: `renewals/${id}/payment-method`,
      data: {
        paymentMethod,
      },
    });
  };

  // ADMIN - Cập nhật chi tiết thông tin form đăng ký
  updateRenewalFormDetail = async (id, notes) => {
    return await AxiosInstance({
      method: "PATCH",
      url: `renewals/${id}/note`,
      data: { notes },
    });
  };
}

export const API_RENEWAL = new ApiRenewal();
