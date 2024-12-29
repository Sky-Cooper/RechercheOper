import axios from "axios";

const getCookie = (name: string) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name) {
        cookieValue = decodeURIComponent(cookie[1]);
        break;
      }
    }
  }
  return cookieValue;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "X-CSRFToken": getCookie("csrftoken"),
  },
});
