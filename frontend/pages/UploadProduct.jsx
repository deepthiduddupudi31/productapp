import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function UploadProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    description: "",
    image: null,
    pdf: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      !form.productName ||
      !form.description ||
      !form.image ||
      !form.pdf
    ) {
      setError("Please fill all fields and select image + PDF");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("productName", form.productName);
      formData.append("description", form.description);
      formData.append("image", form.image);
      formData.append("pdf", form.pdf);

      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      alert("Product uploaded successfully!");

      navigate("/products");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Upload Product</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={form.productName}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            rows="5"
          />

          <label>Product Image</label>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />

          <label>Product PDF</label>

          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            onChange={handleChange}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </div>
    </div>
  );
}