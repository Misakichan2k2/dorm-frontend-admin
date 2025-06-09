import { AxiosInstance } from "@/services/api";

class ApiAuth {
  signIn = async (data) => {
    return await AxiosInstance({
      method: "POST",
      url: "auth/admin/signin",
      data,
    });
  };

  signUp = async (data) => {
    return await AxiosInstance({
      method: "POST",
      url: "auth/admin/signup",
      data: {
        fullname: data?.fullname || "",
        email: data?.email || "",
        password: data?.password || "",
      },
    });
  };
}

export const API_AUTH = new ApiAuth();
