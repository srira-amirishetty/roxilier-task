import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../store/API/Auth";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role:""
  });

  const { data, status, error } = useSelector((state) => state.LoginAPI);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(userLogin(formData));
  };

  useEffect(() => {
    if (status === "succeeded" && data && data.length > 0) {
      console.log("API Response Data:", data); 

      const userData = data[0];
      console.log("User data:", userData);
      if (userData) {
        const { role } = userData;
        console.log("User role:", role);
        if (role === "user") {
          navigate("/userScreen");
        } else if (role === "shopOwner") {
          navigate(`/OwnerScreen`);
      } else {
        console.error("User data or role is missing:", userData);
      }
    }
  }
  }, [status, data, navigate]);


  return (
    <>
  
    <div className="flex justify-center items-center min-h-screen bg-gray-50">

        <div className="absolute top-4 right-6 text-lg font-semibold cursor-pointer" onClick={() => navigate("/admin-login")}>
            Admin
        </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <div>
          <Label htmlFor="email" className="pb-1">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" value={formData.email}
              onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="password" className="pb-1">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" value={formData.password}
              onChange={handleChange} />
        </div>

        <Button type="submit" className="w-full">
          Login
        </Button>
        {status === "loading" && <p>Logging in...</p>}
        {status === "failed" && (
          <p className="text-red-500">Error: {error?.message}</p>
        )}
        <h3 onClick={() => navigate('/register')} className="transition duration-500 ease-in-out transform hover:scale-105" >New user Register Now</h3>
      </form>
      
    </div>

    </>
  )
}

export default App