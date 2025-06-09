import { AxiosInstance } from "@/services/api";

class ApiRenewal {
  // ADMIN - Lấy tất cả đơn
  getAllRenewal = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "renewals",
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
      method: "PUT",
      url: `renewals/${id}/status`,
      data: { status },
    });
  };

  // ADMIN - Cập nhật chi tiết thông tin form đăng ký
  updateRenewalFormDetail = async (id, data) => {
    return await AxiosInstance({
      method: "PUT",
      url: `renewals/${id}/register-form`,
      data,
    });
  };
}

export const API_RENEWAL = new ApiRenewal();
