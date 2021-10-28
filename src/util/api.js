import axios from "axios";

const api = axios.create({
  baseURL: "https://www.okex.com/api",
});

export const order = {
  get: (instrument_id) =>
    api.get(`/futures/v3/instruments/${instrument_id}/book?size=200`),
};

export const fetch = {
  get: () => api.get("futures/v3/instruments/ticker"),
};
