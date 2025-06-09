import { AxiosInstance } from "@/services/api";

class ApiFeedback {
  // Lấy tất cả feedbacks
  getAllFeedbacks = async () => {
    return await AxiosInstance({
      method: "GET",
      url: "feedbacks",
    });
  };

  // Lấy chi tiết feedback theo ID
  getFeedbackById = async (id) => {
    return await AxiosInstance({
      method: "GET",
      url: `feedbacks/${id}`,
    });
  };

  // Cập nhật note cho feedback
  updateFeedbackNote = async (id, data) => {
    return await AxiosInstance({
      method: "PUT",
      url: `feedbacks/${id}/note`,
      data,
    });
  };
}

export const API_FEEDBACK = new ApiFeedback();
