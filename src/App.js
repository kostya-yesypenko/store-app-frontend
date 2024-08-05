import api from "./api/axiosConfig";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import Product from "./components/product/Product";
import Order from "./components/order/Order";
import Cart from "./components/cart/Cart";

function App() {
  const [products, setProducts] = useState();
  const [product, setProduct] = useState();

  const [categories, setCategories] = useState();

  const updateProduct = (updatedProduct) => {
    setProduct(updatedProduct);
  };

  const getCategories = async () => {
    try {
      const response = await api.get(`/api/v1/categories`);

      setCategories(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getProducts = async () => {
    try {
      const response = await api.get(`/api/v1/products`);

      setProducts(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getProduct = async (id) => {
    try {
      const response = await api.get(`/api/v1/products/${id}`);

      const singleProduct = response.data;

      setProduct(singleProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const getProductsByCategory = async (categoryId) => {
    try {
      const response = await api.get(`/api/v1/category/${categoryId}`);
      setProducts(response.data);
      // Navigate to the /home route after setting the products
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <div>
                <Header />
                <Home
                  products={products}
                  getProductsByCategory={getProductsByCategory}
                  categories={categories}
                  getProducts={getProducts}
                />
              </div>
            }
          />

          <Route
            path="/orders"
            element={
              <>
                <Header />
                <Order />
              </>
            }
          />

          <Route
            path="/product/:productId"
            element={
              <>
                <Header />
                <Product
                  getProduct={getProduct}
                  product={product}
                  updateProduct={updateProduct}
                />
              </>
            }
          />

          <Route
            path="/cart"
            element={
              <>
                <Header />
                <Cart />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
