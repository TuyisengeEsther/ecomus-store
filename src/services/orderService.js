import API from "../api/axios";

export const buyNow = async (orderData) => {
  const res = await API.post("/api/auth/orders/buy", orderData);
  return res.data;
};

export const placeOrderFromCart = async () => {
  const res = await API.post("/api/auth/orders");
  return res.data;
};