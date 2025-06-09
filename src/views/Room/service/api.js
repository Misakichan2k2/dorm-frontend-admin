import { AxiosInstance } from "@/services/api";

class ApiRoom {
  createRoom = async (data) => {
    return await AxiosInstance({
      method: "POST",
      url: "rooms",
      data,
    });
  };

  getRooms = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "rooms",
    });
  };

  // Get All buildings
  getBuildings = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "buildings",
    });
  };

  getRoomById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `rooms/${id}`,
    });
  };

  updateRoom = async (data) => {
    return await AxiosInstance({
      method: "PUT",
      url: `rooms/${data._id}`,
      data,
    });
  };

  deleteRoom = async (id) => {
    return await AxiosInstance({
      method: "DELETE",
      url: `rooms/${id}`,
    });
  };
}

export const API_ROOM = new ApiRoom();
