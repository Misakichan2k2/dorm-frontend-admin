import { AxiosInstance } from "@/services/api";

class ApiAccount {
  // Lấy tất cả tài khoản (GET /)
  getAllAccounts = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "users",
    });
  };

  // Lấy tài khoản theo ID (GET /:id)
  getAccountById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `users/${id}`,
    });
  };

  // Cập nhật trạng thái BAN (PUT /:id/ban)
  updateStatusBan = async (id) => {
    return await AxiosInstance({
      method: "PATCH",
      url: `users/${id}/ban`,
    });
  };

  // Cập nhật trạng thái DELETE (PUT /:id/delete)
  updateStatus = async (id, status) => {
    return await AxiosInstance({
      method: "PUT",
      url: `users/${id}/status`,
      data: {
        status,
      },
    });
  };

  // Xóa tài khoản thật sự (DELETE /:id)
  deleteAccount = async (id) => {
    return await AxiosInstance({
      method: "DELETE",
      url: `users/${id}`,
    });
  };

  getRegistrationById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `registration/${id}`,
    });
  };
}

export const API_ACCOUNT = new ApiAccount();
