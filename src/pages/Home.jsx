import { useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
  getProductsByCategory,
} from "../services/productService";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      const productResponse = await getProducts();
      const categoryResponse = await getCategories();

      setProducts(productResponse.data?.all || []);
      setCategories(categoryResponse.data || []);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    try {
      setLoading(true);

      if (!categoryId) {
        const response = await getProducts();
        setProducts(response.data?.all || []);
      } else {
        const response = await getProductsByCategory(categoryId);
        setProducts(response.data?.all || response.data || []);
      }
    } catch (err) {
      setError("Failed to load category products.");
    } finally {
      setLoading(false);
    }
  };

  const displayedProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low-high") return Number(a.price) - Number(b.price);
      if (sort === "high-low") return Number(b.price) - Number(a.price);
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div>
      <section className="bg-black text-white rounded-xl p-10 mb-8">
        <h1 className="text-4xl font-bold">Ecomus Store</h1>
        <p className="mt-3 text-gray-300">
          Discover amazing products from the live API.
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2"
        />

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border rounded px-4 py-2"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Sort Products</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {displayedProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;