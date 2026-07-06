import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    loadingCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
  } = useCart();

  const getItemId = (item) => {
    return item.id || item.cartItemId || item._id;
  };

  const getProduct = (item) => {
    return item.product || item;
  };

  const getPrice = (item) => {
    return item.product?.price || item.selectedVariant?.price || item.price || 0;
  };

  const getImage = (item) => {
    return (
      item.product?.images?.[0]?.url ||
      item.images?.[0]?.url ||
      item.imageUrl ||
      ""
    );
  };

  if (loadingCart) {
    return <p className="text-center py-10">Loading cart...</p>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add products before checkout.</p>

        <Link to="/" className="bg-black text-white px-6 py-3 rounded">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => {
          const itemId = getItemId(item);
          const product = getProduct(item);
          const price = getPrice(item);
          const imageUrl = getImage(item);
          const subtotal = Number(price) * Number(item.quantity || 1);

          return (
            <div
              key={itemId}
              className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4 md:items-center"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full md:w-28 h-48 md:h-28 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full md:w-28 h-48 md:h-28 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="flex-1">
                <h2 className="font-bold text-lg">{product.name}</h2>

                <p className="text-sm text-gray-500">
                  {product.category?.name || "Product"}
                </p>

                <p className="font-semibold mt-2">${Number(price).toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(itemId, Number(item.quantity || 1) - 1)
                  }
                  className="border px-3 py-1 rounded"
                >
                  -
                </button>

                <span className="px-3">{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(itemId, Number(item.quantity || 1) + 1)
                  }
                  className="border px-3 py-1 rounded"
                >
                  +
                </button>
              </div>

              <div className="md:text-right">
                <p className="font-bold">${subtotal.toFixed(2)}</p>

                <button
                  onClick={() => removeFromCart(itemId)}
                  className="text-red-600 mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-6 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p className="text-gray-600">Total</p>
          <h2 className="text-3xl font-bold">${total.toFixed(2)}</h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={clearCart}
            className="bg-red-600 text-white px-5 py-3 rounded"
          >
            Clear Cart
          </button>

          <button className="bg-black text-white px-5 py-3 rounded">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;