import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Link, useParams } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";

const Product = ({ getProduct, product, updateProduct }) => {
  const params = useParams();
  const productId = params.productId;

  useEffect(() => {
    getProduct(productId);
  }, [productId]);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    quantity: 1,
    totalPrice: product?.price || 0,
  });

  useEffect(() => {
    // Update form data if product price changes
    setFormData((prevData) => ({
      ...prevData,
      totalPrice: calculateTotalPrice(prevData.quantity),
    }));
  }, [product]);

  const calculateTotalPrice = (quantity) => {
    return quantity * (product?.price || 0);
  };

  const handleToggleFormModal = () => {
    if (!showFormModal) {
      // Reset form data when modal opens
      setFormData({
        quantity: 1,
        totalPrice: product?.price || 0,
      });
    }
    setShowFormModal(!showFormModal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      const quantity = parseInt(value, 10);
      const totalPrice = calculateTotalPrice(quantity);
      setFormData((prevData) => ({
        ...prevData,
        quantity: isNaN(quantity) ? 1 : quantity,
        totalPrice: isNaN(totalPrice) ? 0 : totalPrice,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData.quantity > product.qty) {
      alert("Not enough products in stock!");
      return;
    }

    try {
      const orderRequest = {
        productId: productId,
        qty: formData.quantity,
        price: formData.totalPrice,
      };

      const response = await api.post("/api/v1/order", orderRequest, { withCredentials: true });

      if (response.status === 201) {
        // Update the local product state to reflect the new quantity
        updateProduct({
          ...product,
          qty: product.qty - formData.quantity,
        });

        // Optionally, refetch the product data to ensure it's up to date
        await getProduct(productId);

        setFormData({
          quantity: 1, // Reset to default value
          totalPrice: product?.price || 0,
        });
        setShowFormModal(false);
        alert("Product added to cart!");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("There was an error adding the product to the cart. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      {product ? (
        <div>
          <div className="row">
            <div className="col-md-6">
              <img src={product.img} className="img-fluid" alt={product.name} />
            </div>
            <div className="col-md-6">
              <p className="lead mb-4">Product Details:</p>
              <h1 className="mb-4">{product.name}</h1>
              <p>
                <strong>Category: </strong>
                <Link to="/home">
                  {product.category ? product.category.name : "N/A"}
                </Link>
              </p>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Available Quantity:</strong> {product.qty}
              </p>

              <Button variant="primary" onClick={handleToggleFormModal}>
                Buy Now
              </Button>

              <Modal show={showFormModal} onHide={handleToggleFormModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Buy Now</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleFormSubmit}>
                    <Form.Group controlId="formBasicQuantity">
                      <Form.Label>
                        Quantity ({product.qty} available)
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        max={product.qty} // Restrict quantity to available stock
                        required
                      />
                      <p className="mt-2">
                        <strong>Total Price:</strong> ${formData.totalPrice}
                      </p>
                    </Form.Group>

                    <Button variant="primary mt-2" type="submit">
                      Submit
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Product;
