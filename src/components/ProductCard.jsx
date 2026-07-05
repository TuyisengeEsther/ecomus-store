import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const imageUrl = product.images?.[0]?.url;

  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg bg-gray-100"
      />

      <p className="text-sm text-gray-500 mt-3">
        {product.category?.name}
      </p>

      <h3 className="font-semibold text-lg mt-1 line-clamp-1">
        {product.name}
      </h3>

      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
        {product.description}
      </p>

      <p className="font-bold mt-3">${product.price}</p>

      <Link
        to={`/products/${product.id}`}
        className="block text-center bg-black text-white py-2 rounded mt-4"
      >
        View Details
      </Link>
    </div>
  );
}

export default ProductCard;