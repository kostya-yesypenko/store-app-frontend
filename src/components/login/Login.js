import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";
import api from "../../api/axiosConfig";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState("kostia");
  const [password, setPassword] = useState("1");

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await api.post("/auth/login", {
        login: login,
        password: password,
      }, { withCredentials: true });
  
      if (response.status === 200) {
        const user = response.data;
        console.log('Login successful:', user);
        setLogin("");
        setPassword("");
        localStorage.setItem("user", JSON.stringify(user))
        // Store user information in Local Storage or Session Storage
        navigate('/home');
      } else {
        console.error('Login failed:', response.status);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  return (
    <div className="main">
      <div className="container-wrapper">
        <div className="form-container sign-in">
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="form-control"
              placeholder="Login"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Password"
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
