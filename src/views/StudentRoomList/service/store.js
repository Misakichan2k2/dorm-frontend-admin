import { defineStore } from "pinia";
import { API_STUDENT_ROOM_LIST } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreStudentRoomList = defineStore("StoreStudentRoomList", () => {
  const { setup } = RESPONSE();
  const API = API_STUDENT_ROOM_LIST.API_STUDENT_ROOM_LIST;

  // Get All
  const onActionGetStudents = async () => {
    return await setup({
      apiFunction: API.getStudents(),
    });
  };

  // Get by ID
  const onActionGetStudentById = async (id) => {
    return await setup({
      apiFunction: API.getStudentById(id),
    });
  };

  // Get All Buidings
  const onActionGetBuildings = async () => {
    return await setup({
      apiFunction: API.getBuildings(),
    });
  };

  // Get All rooms
  const onActionGetRooms = async () => {
    return await setup({
      apiFunction: API.getRooms(),
    });
  };

  const onActionTransferRoom = async (id, data) => {
    return await setup({
      apiFunction: API.transferRoom(id, data),
    });
  };

  return {
    onActionGetStudents,
    onActionGetStudentById,
    onActionGetBuildings,
    onActionGetRooms,
    onActionTransferRoom,
  };
});
