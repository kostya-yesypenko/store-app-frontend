import { useState, useEffect } from "react";
import { Button, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../api/axiosConfig";

const Home = ({
  products,
  getProductsByCategory,
  categories,
  getProducts,
  getCart,
}) => {
  // Accept getCart as a prop
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [chosenCategoryName, setChosenCategoryName] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleCategoryChange = (categoryId, categoryName) => {
    setCurrentCategoryId(categoryId);
    setChosenCategoryName(categoryName);
    getProductsByCategory(categoryId);
  };

  const handleResetFilters = () => {
    setCurrentCategoryId(null);
    setChosenCategoryName(null);
    getProducts();
  };

  const handleAddToCart = async (product) => {
    try {
      const order = {
        productId: product.id,
        qty: 1,
        price: product.price,
      };
      await api.post("api/v1/order", order, { withCredentials: true });
      alert("Product added to cart successfully!");

      getCart(); // Refresh the cart after adding the item
      
      getProducts(); // Refresh the products to update availability if needed
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleDownloadExcel = async () => {
    try {
      const response = await api.get("api/excel/download", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };

  return (
    <section>
      <div className="container py-5">
        <h1>Welcome, {user.name}</h1>
        <p>Email: {user.email}</p>
        <Button variant="success" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
        <div className="d-flex justify-content-around mb-4">
          <NavDropdown title="Filters" id="basic-nav-dropdown">
            {categories?.map((category) => (
              <NavDropdown.Item
                key={category.id}
                onClick={() => handleCategoryChange(category.id, category.name)}
              >
                {category.name}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
          {currentCategoryId && (
            <Button variant="secondary" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          )}
        </div>
        {chosenCategoryName && (
          <h3 className="text-center mb-4">{chosenCategoryName}</h3>
        )}
        <div className="row justify-content-between">
          {products?.map((product) => (
            <div className="col-md-12 col-lg-4 mb-4 mb-lg-4" key={product.id}>
              <div className="card product-card" style={{ height: "100%" }}>
                <div className="d-flex justify-content-around p-3">
                  <p className="lead mb-0">Today's Combo Offer</p>
                </div>
                <div style={{ height: "400px" }}>
                  <img
                    src={product.img}
                    className="card-img-top img-fluid"
                    alt="Product"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0">{product.name}</h5>
                    <h5 className="text-dark mb-0">${product.price}</h5>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <p className="text-muted mb-0">
                      Available: <span className="fw-bold">{product.qty}</span>
                    </p>
                    <div>
                      <Link to={`/product/${product.id}`}>
                        <Button variant="info" className="me-2">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="primary"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
