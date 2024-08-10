import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Spinner, Alert, Modal } from "react-bootstrap";

const Cart = () => {
  const [cart, setCart] = useState({ orders: [] });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const calculateTotalPrice = () => {
    return cart.orders.reduce((total, order) => total + (order.qty * order.product.price), 0);
  };
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("api/v1/cart", {
          withCredentials: true,
        });
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveItem = async (index) => {
    try {
      const productId = cart.orders[index].product.id;
      await api.delete("api/v1/deleteOrder", {
        params: { productId },
        withCredentials: true,
      });
      // Refresh the cart data after removal
      const updatedCartResponse = await api.get("api/v1/cart", {
        withCredentials: true,
      });
      setCart(updatedCartResponse.data);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleUpdateQuantity = async (index, change) => {
    const productId = cart.orders[index].product.id;
    const currentQty = cart.orders[index].qty;
    if (currentQty >= 1) {
      try {
        const response = await api.post("api/v1/updateCartOrderQty", null, {
          params: { productId, qty: change },
          withCredentials: true,
        });

        // Assuming the response status is 200 (OK), you can then update the cart
        if (response.status === 200) {
          // Fetch updated cart data
          const updatedCartResponse = await api.get("/api/v1/cart", {
            withCredentials: true,
          });
          setCart(updatedCartResponse.data);
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    } 
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await api.post("api/v1/checkout", {}, { withCredentials: true });

      setShowModal(true); // Show the modal on successful checkout

      // Fetch updated cart data (which should be empty after checkout)
      const updatedCartResponse = await api.get("api/v1/cart", {
        withCredentials: true,
      });
      setCart(updatedCartResponse.data);
    } catch (error) {
      console.error("Error processing checkout:", error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/home"); // Redirect to the home page or another page after closing the modal
  };

  return (
    <div className="container mt-5">
      <h1>Your Cart</h1>
      {cart.orders.length > 0 ? (
        <>
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
              {cart.orders.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{order.product.name}</td>
                  <td>${order.product.price}</td>
                  <td>
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdateQuantity(index, -1)}
                    >
                      -
                    </Button>{" "}
                    {order.qty}{" "}
                    <Button
                      variant="secondary"
                      onClick={() => handleUpdateQuantity(index, 1)}
                    >
                      +
                    </Button>
                  </td>
                  <td>${order.qty * order.product.price}</td>
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
          <div className="d-flex justify-content-end mt-3">
            <h4>Total Price: ${calculateTotalPrice()}</h4>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <Button
        variant="primary"
        onClick={handleCheckout}
        disabled={checkoutLoading}
      >
        {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
      </Button>
  
      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Checkout Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your order has been placed successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Cart;
