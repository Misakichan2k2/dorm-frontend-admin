import { AxiosInstance } from "@/services/api";

class ApiRegistration {
  // ADMIN - Lấy tất cả đơn
  getAllRegistrations = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "registration",
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
  getRegistrationById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `registration/${id}`,
    });
  };

  getRegistrationsByStatus = async () => {
    return await AxiosInstance({
      method: "GET",
      url: `registration/registrations`,
    });
  };

  // ADMIN - Cập nhật trạng hình thức thanh toán
  updateRegistrationPaymentMethod = async (id, paymentMethod) => {
    return await AxiosInstance({
      method: "PATCH",
      url: `registration/${id}/payment-method`,
      data: {
        paymentMethod,
      },
    });
  };

  // ADMIN - Cập nhật trạng thái đơn
  updateRegistrationStatus = async (id, status) => {
    return await AxiosInstance({
      method: "PUT",
      url: `registration/${id}/status`,
      data: {
        status,
      },
    });
  };

  // ADMIN - Cập nhật chi tiết thông tin form đăng ký
  updateRegisterFormDetail = async (id, registerFormDetail) => {
    return await AxiosInstance({
      method: "PUT",
      url: `registration/${id}/register-form`,
      data: {
        registerFormDetail,
      },
    });
  };
}

export const API_REGISTRATION = new ApiRegistration();
