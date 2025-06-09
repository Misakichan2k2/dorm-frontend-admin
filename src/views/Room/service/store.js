import { defineStore } from "pinia";
import { API_ROOM } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreRoom = defineStore("StoreRoom", () => {
  const { setup } = RESPONSE();
  const API = API_ROOM.API_ROOM;

  const onActionCreateRoom = async (data) => {
    return await setup({
      apiFunction: API.createRoom(data),
    });
  };

  const onActionGetRooms = async () => {
    return await setup({
      apiFunction: API.getRooms(),
    });
  };

  // Get All Buidings
  const onActionGetBuildings = async () => {
    return await setup({
      apiFunction: API.getBuildings(),
    });
  };

  const onActionGetRoomById = async (id) => {
    return await setup({
      apiFunction: API.getRoomById(id),
    });
  };

  const onActionUpdateRoom = async (data) => {
    return await setup({
      apiFunction: API.updateRoom(data),
    });
  };

  const onActionDeleteRoom = async (id) => {
    return await setup({
      apiFunction: API.deleteRoom(id),
    });
  };

  return {
    onActionCreateRoom,
    onActionGetRooms,
    onActionGetBuildings,
    onActionGetRoomById,
    onActionUpdateRoom,
    onActionDeleteRoom,
  };
});
