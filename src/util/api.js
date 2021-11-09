import axios from "axios";

const api = axios.create({
  baseURL: "https://www.okex.com/api",
});

export const orderApi = {
  get: (instrument_id) =>
    api.get(`/futures/v3/instruments/${instrument_id}/book?size=200`),
};

export const fetchApi = {
  get: () => api.get("futures/v3/instruments/ticker"),
};
