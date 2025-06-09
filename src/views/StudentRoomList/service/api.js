import { AxiosInstance } from "@/services/api";

class ApiStudentRoomList {
  // Get All
  getStudents = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "students",
    });
  };

  // Get by ID
  getStudentById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `students/${id}`,
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
      url: "rooms/available",
    });
  };

  transferRoom = async (id, data) => {
    return await AxiosInstance({
      method: "PUT",
      url: `registration/${id}`,
      data,
    });
  };
}

export const API_STUDENT_ROOM_LIST = new ApiStudentRoomList();
