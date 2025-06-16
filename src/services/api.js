// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:3000/api", // Đặt URL backend của bạn
//   withCredentials: true, // Để gửi cookie (như access_token)
// });

// export default api;

import axios from "axios";

export * as API_BUILDING from "@/views/Area/service/api";
export * as API_ROOM from "@/views/Room/service/api";
export * as API_STUDENT_ROOM_LIST from "@/views/StudentRoomList/service/api";
export * as API_ELECTRIC_INVOICE from "@/views/ElectricityBill/service/api";
export * as API_WATER_INVOICE from "@/views/WaterBill/service/api";
export * as API_REPORT from "@/views/Report/service/api";
export * as API_REGISTRATION from "@/views/Registration/service/api";
export * as API_FEEDBACK from "@/views/Feedback/service/api";
export * as API_ACCOUNT from "@/views/Account/service/api";
export * as API_RENEWAL from "@/views/RenewalRequest/service/api";
export * as API_AUTH from "@/views/SignIn/service/api";
export * as API_STATISTICS from "@/views/Statistics/service/api";
export * as API_DASHBOARD from "@/views/Dashboard/service/api";

class ApiApp {}

export const API_APP = new ApiApp();

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
});

const updateAuthorizationHeader = (token) => {
  if (token) {
    AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete AxiosInstance.defaults.headers.common["Authorization"];
  }
};

AxiosInstance.interceptors.request.use((config) => {
  if (config) return config;
});

AxiosInstance.interceptors.response.use(
  (response) => {
    if (response) return response;
  },
  (error) => {
    // if (["TOKEN_EXPIRED"].includes(error?.response?.data?.statusCode)) {
    //   onDeleteAppLocalStorage();
    // }

    return Promise.reject(error);
  }
);

export { AxiosInstance, updateAuthorizationHeader };
