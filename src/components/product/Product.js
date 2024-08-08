import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Link, useParams } from "react-router-dom";
import { Button, Modal, Form } from "react-bootstrap";
import Cookies from "js-cookie";

const Product = ({ getProduct, product, updateProduct }) => {
  const params = useParams();
  const productId = params.productId;

  useEffect(() => {
    getProduct(productId);
  }, [productId]);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    quantity: 0,
    totalPrice: 0,
  });

  const calculateTotalPrice = (quantity) => {
    return quantity * product?.price;
  };

  const handleToggleFormModal = () => {
    setShowFormModal(!showFormModal);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      const totalPrice = calculateTotalPrice(parseInt(value, 10));
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        totalPrice: isNaN(totalPrice) ? 0 : totalPrice,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
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
        setFormData({
          quantity: 0,
          totalPrice: 0,
        });
        setShowFormModal(false);
        alert("Product added to cart!");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert(
        "There was an error adding the product to the cart. Please try again."
      );
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
                        min="1" // Ensure quantity is a positive integer
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

// import React, { useEffect, useState } from "react";
// import api from "../../api/axiosConfig";
// import { Link, useParams } from "react-router-dom";
// import { Button, Modal, Form } from "react-bootstrap";

// const Product = ({ getProduct, product, updateProduct }) => {
//   const params = useParams();
//   const productId = params.productId;

//   useEffect(() => {
//     getProduct(productId);
//   }, [productId]);

//   const [showFormModal, setShowFormModal] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     quantity: 0,
//     totalPrice: 0,
//   });

//   const calculateTotalPrice = (quantity) => {
//     return quantity * product?.price;
//   };

//   const handleToggleFormModal = () => {
//     setShowFormModal(!showFormModal);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "quantity") {
//       // Calculate total price only when quantity changes
//       const totalPrice = calculateTotalPrice(parseInt(value, 10));

//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//         totalPrice: isNaN(totalPrice) ? 0 : totalPrice,
//       }));
//     } else {
//       // Handle other input changes (e.g., email)
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     // Check if requested quantity exceeds available stock
//     if (formData.quantity > product.qty) {
//       alert("Not enough products in stock!");
//       return;
//     }

//     // Recalculate total price based on the latest quantity
//     const totalPrice = calculateTotalPrice(formData.quantity);

//     // Continue with the rest of the form submission logic
//     console.log("Form submitted:", { ...formData, totalPrice, productId });

//     try {
//       const response = await api.post("/api/v1/order", {
//         email: formData.email,
//         productId: productId,
//         qty: formData.quantity,
//         price: formData.totalPrice,
//       });

//       // If the API call is successful, update the product details
//       if (response.status === 201) {
//         const updatedProduct = {
//           ...product,
//           qty: product.qty - formData.quantity,
//         };
//         updateProduct(updatedProduct); // Pass the updated product to the parent component
//         setFormData({
//           email: "",
//           quantity: 0,
//           totalPrice: 0,
//         });
//         setShowFormModal(false);
//         alert("Order successfully created!");
//       } else {
//         // If the status code is not 201, handle the error
//         console.error("Failed to create order. Status code:", response.status);
//         alert("Error creating the order. Please try again.");
//       }
//     } catch (error) {
//       console.error(error);
//       alert("Error creating the order. Please try again.");
//     }
//   };

//   return (
//     <div className="container mt-5">

//       {product ? (
//         <div>
//           <div className="row">
//             <div className="col-md-6">
//               <img src={product.img} className="img-fluid" alt={product.name} />
//             </div>
//             <div className="col-md-6">
//               <p className="lead mb-4">Product Details:</p>
//               <h1 className="mb-4">{product.name}</h1>
//               <p>
//                 <strong>Category: </strong>
//                 <Link to="/home">
//                   {product.category ? product.category.name : "N/A"}
//                 </Link>
//               </p>
//               <p>
//                 <strong>Price:</strong> ${product.price}
//               </p>
//               <p>
//                 <strong>Available Quantity:</strong> {product.qty}
//               </p>

//               <Button variant="primary" onClick={handleToggleFormModal}>
//                 Buy Now
//               </Button>

//               <Modal show={showFormModal} onHide={handleToggleFormModal}>
//                 <Modal.Header closeButton>
//                   <Modal.Title>Buy Now</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                   <Form onSubmit={handleFormSubmit}>
//                     <Form.Group controlId="formBasicEmail">
//                       <Form.Label>Email address</Form.Label>
//                       <Form.Control
//                         type="email"
//                         placeholder="Enter email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </Form.Group>
//                     <Form.Group controlId="formBasicQuantity">
//                       <Form.Label>
//                         Quantity ({product.qty} available)
//                       </Form.Label>
//                       <Form.Control
//                         type="number"
//                         placeholder="Enter quantity"
//                         name="quantity"
//                         value={formData.quantity}
//                         onChange={handleInputChange}
//                         min="1" // Ensure quantity is a positive integer
//                         required
//                       />
//                       <p className="mt-2">
//                         <strong>Total Price:</strong> ${formData.totalPrice}
//                       </p>
//                     </Form.Group>

//                     <Button variant="primary mt-2" type="submit">
//                       Submit
//                     </Button>
//                   </Form>
//                 </Modal.Body>
//               </Modal>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Product;
