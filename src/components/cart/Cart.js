import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Table, Button } from "react-bootstrap";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartItems = JSON.parse(Cookies.get("cart") || "[]");
    setCart(cartItems);
  }, []);

  const handleRemoveItem = (index) => {
    const updatedCart = cart.filter((item, i) => i !== index);
    setCart(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart));
  };

  const handleIncreaseQuantity = (index) => {
    const updatedCart = cart.map((item, i) => {
      if (i === index) {
        const newQuantity = item.quantity + 1;
        return { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price };
      }
      return item;
    });
    setCart(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart));
  };

  const handleDecreaseQuantity = (index) => {
    const updatedCart = cart.map((item, i) => {
      if (i === index && item.quantity > 1) {
        const newQuantity = item.quantity - 1;
        return { ...item, quantity: newQuantity, totalPrice: newQuantity * item.price };
      }
      return item;
    });
    setCart(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="container mt-5">
      <h1>Your Cart</h1>
      {cart.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>
                  <Button variant="secondary" onClick={() => handleDecreaseQuantity(index)}>-</Button>
                  {" "}{item.quantity}{" "}
                  <Button variant="secondary" onClick={() => handleIncreaseQuantity(index)}>+</Button>
                </td>
                <td>${item.totalPrice}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <Button as={Link} to="/checkout" variant="primary">
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default Cart;
