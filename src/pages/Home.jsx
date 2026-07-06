import { useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
} from "../services/productService";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const productResponse = await getProducts();
      const categoryResponse = await getCategories();

      console.log("Products:", productResponse);
      console.log("Categories:", categoryResponse);

      const allProducts = productResponse.data?.all || [];

      setProducts(allProducts);
      setFilteredProducts(allProducts);

      setCategories(
        categoryResponse.data ||
          categoryResponse.categories ||
          []
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    setSelectedCategory(categoryId);

    if (!categoryId) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) => product.categoryId === categoryId
    );

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10">
        Loading products...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 className="text-center text-red-600 mt-10">
        {error}
      </h2>
    );
  }

  return (
    <div>
      {/* Hero */}

      <section className="bg-black text-white rounded-xl p-10 mb-8">
        <h1 className="text-4xl font-bold">
          Ecomus Store
        </h1>

        <p className="mt-3 text-gray-300">
          Discover amazing products from our store.
        </p>
      </section>

      {/* Category */}

      <div className="mb-8">
        <label className="font-semibold mr-3">
          Category
        </label>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border rounded px-4 py-2"
        >
          <option value="">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products */}

      {filteredProducts.length === 0 ? (
        <h2 className="text-center">
          No products found.
        </h2>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;