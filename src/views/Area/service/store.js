import { defineStore } from "pinia";
import { API_BUILDING } from "@/services/api";
import { RESPONSE } from "@/utils/response";

export const StoreBuilding = defineStore("StoreBuilding", () => {
  const { setup } = RESPONSE();
  const API = API_BUILDING.API_BUILDING;

  // Create
  const onActionCreateBuilding = async (data) => {
    return await setup({
      apiFunction: API.createBuilding(data),
    });
  };

  // Get All
  const onActionGetBuildings = async () => {
    return await setup({
      apiFunction: API.getBuildings(),
    });
  };

  // Get by ID
  const onActionGetBuildingById = async (id) => {
    return await setup({
      apiFunction: API.getBuildingById(id),
    });
  };

  // Update
  const onActionUpdateBuilding = async (id, data) => {
    return await setup({
      apiFunction: API.updateBuilding(id, data),
    });
  };

  // Delete
  const onActionDeleteBuilding = async (id) => {
    return await setup({
      apiFunction: API.deleteBuilding(id),
    });
  };

  return {
    onActionCreateBuilding,
    onActionGetBuildings,
    onActionGetBuildingById,
    onActionUpdateBuilding,
    onActionDeleteBuilding,
  };
});
