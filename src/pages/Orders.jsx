import { useEffect, useState } from "react";
import { getMyOrders } from "../services/orderService";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await getMyOrders();
      setOrders(response.data || response.orders || []);
    } catch (err) {
      setError("Failed to load orders. Please login again.");
    }
  };

  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-xl shadow">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status || "Pending"}</p>
              <p><strong>Total:</strong> ${order.total || 0}</p>
              <p>
                <strong>Date:</strong>{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;