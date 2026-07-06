import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { buyNow } from "../services/orderService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const fallbackImage = (product) =>
    `https://source.unsplash.com/900x900/?${encodeURIComponent(
      product?.category?.name || product?.name || "shopping"
    )}`;

  const getImageUrl = (image, product) => {
    if (!image) return fallbackImage(product);

    if (typeof image === "string") return image;

    return (
      image.url ||
      image.imageUrl ||
      image.src ||
      fallbackImage(product)
    );
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProductById(id);

      const productData = response.data?.product;

      if (!productData) {
        setError("Product not found.");
        return;
      }

      setProduct(productData);

      setSelectedVariant(productData.variants?.[0] || null);

      setMainImage(
        getImageUrl(productData.images?.[0], productData)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      imageUrl: mainImage,
      selectedVariant,
      quantity: Number(quantity),
      cartId: `${product.id}-${selectedVariant?.id || "default"}`,
    });

    setSuccess("Product added to cart.");
  };

  const handleBuyNow = async () => {
    if (!token) {
      setError("Please login first.");
      return;
    }

    if (!selectedVariant) {
      setError("Please select a variant.");
      return;
    }

    try {
      setBuying(true);

      await buyNow({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
      });

      setSuccess("Order placed successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <Loader />;

  if (error && !product)
    return <ErrorMessage message={error} />;

  return (
    <div className="max-w-7xl mx-auto">
      <Link
        to="/"
        className="text-blue-600 mb-6 inline-block"
      >
        ← Back to Products
      </Link>

      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-10 bg-white rounded-xl shadow p-6">

        <div>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-[500px] object-cover rounded-lg"
          />

          <div className="flex gap-3 mt-4 overflow-x-auto">
            {(product.images?.length
              ? product.images
              : [{ url: fallbackImage(product) }]
            ).map((image, index) => (
              <img
                key={index}
                src={getImageUrl(image, product)}
                alt={product.name}
                onClick={() =>
                  setMainImage(getImageUrl(image, product))
                }
                className={`w-20 h-20 rounded cursor-pointer border-2 ${
                  mainImage === getImageUrl(image, product)
                    ? "border-black"
                    : "border-gray-300"
                } object-cover`}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-500">
            {product.category?.name}
          </p>

          <h1 className="text-4xl font-bold mt-2">
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-green-600 mt-5">
            $
            {selectedVariant?.price || product.price}
          </p>

          <p className="mt-6 text-gray-700">
            {product.description}
          </p>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">
              Select Variant
            </h3>

            <div className="flex flex-wrap gap-2">
              {product.variants?.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() =>
                    setSelectedVariant(variant)
                  }
                  className={`px-4 py-2 border rounded ${
                    selectedVariant?.id === variant.id
                      ? "bg-black text-white"
                      : ""
                  }`}
                >
                  {variant.color} / {variant.size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="font-semibold block mb-2">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value))
              }
              className="border rounded px-4 py-2 w-24"
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 border border-black py-3 rounded hover:bg-black hover:text-white"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 bg-black text-white py-3 rounded"
            >
              {buying ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;