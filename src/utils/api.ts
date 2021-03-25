import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = "https://api.unsplash.com";

export const getPhotos = async (itemCount: number): Promise<AxiosResponse> => {
  const params = new URLSearchParams();
  params.set("client_id", "VNzF9dsTw3b-QStzWxU--gQZw3VAccsK38L6vowoHIg");
  params.set("per_page", JSON.stringify(itemCount));
  params.set("order_by", "popular");

  try {
    return await axios.get("/photos", {
      params,
    });
  } catch (e) {
    console.error(e);
  }
};
