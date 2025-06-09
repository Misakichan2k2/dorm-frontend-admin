import { AxiosInstance } from "@/services/api";

class ApiBuilding {
  // Create
  createBuilding = async (data) => {
    return await AxiosInstance({
      method: "POST",
      url: "buildings",
      data,
    });
  };

  // Get All
  getBuildings = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "buildings",
    });
  };

  // Get by ID
  getBuildingById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `buildings/${id}`,
    });
  };

  // Update
  updateBuilding = async (id, data) => {
    return await AxiosInstance({
      method: "PUT",
      url: `buildings/${id}`,
      data,
    });
  };

  // Delete
  deleteBuilding = async (id) => {
    return await AxiosInstance({
      method: "DELETE",
      url: `buildings/${id}`,
    });
  };
}

export const API_BUILDING = new ApiBuilding();
