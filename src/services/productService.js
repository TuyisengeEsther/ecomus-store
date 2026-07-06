import API from "../api/axios";

export const getProducts = async () => {
  const res = await API.get("/api/public/products");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await API.get(`/api/public/products/${id}`);
  return res.data;
};

export const getCategories = async () => {
  const res = await API.get("/api/categories?page=1&limit=50");
  return res.data;
};