import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const fallbackImage = `https://source.unsplash.com/600x600/?${encodeURIComponent(
    product.category?.name || product.name
  )}`;

  const imageUrl = product.images?.[0]?.url || fallbackImage;

  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-56 object-cover rounded-lg"
      />

      <p className="text-sm text-gray-500 mt-3">
        {product.category?.name}
      </p>

      <h3 className="font-semibold text-lg mt-1">
        {product.name}
      </h3>

      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
        {product.description}
      </p>

      <p className="font-bold text-xl mt-3">
        ${product.price}
      </p>

      <Link
        to={`/products/${product.id}`}
        className="block text-center mt-4 bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        View Details
      </Link>
    </div>
  );
}

export default ProductCard;