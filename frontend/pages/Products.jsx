import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load products");
      }

      setProducts(data.products || []);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  return (
    <div className="products-page">

      <header className="products-header">
        <h1>ProductHub</h1>

        <div>
          <Link to="/upload">
            <button>Upload Product</button>
          </Link>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {products.length === 0 ? (
        <p>No products uploaded yet.</p>
      ) : (
        <div className="products-grid">

          {products.map((product) => (
            <div
              className="product-card"
              key={product.Id}
            >

              <img
                src={product.ImageUrl}
                alt={product.ProductName}
              />

              <div className="product-content">

                <h2>
                  {product.ProductName}
                </h2>

                <p>
                  {product.Description}
                </p>

                <p>
                  Uploaded by:{" "}
                  <strong>
                    {product.UploadedBy}
                  </strong>
                </p>

                <a
                  href={product.PdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
                </a>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}