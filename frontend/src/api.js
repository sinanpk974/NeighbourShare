import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:3003/api"
    : "https://neighbourshare-i2wq.onrender.com/api",
});

export default API;