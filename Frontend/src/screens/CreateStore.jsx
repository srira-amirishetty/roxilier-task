import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import { userRegister} from "../store/API/Auth";
import { useNavigate } from "react-router-dom";
import { TopBar } from '@/components/TopBar';
import { API_URL, createStore } from '@/store/API/store';
import axios from 'axios';

function CreateStore() {

 const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error,data } = useSelector((state) => state.LoginAPI);

  const userId = data[0]?.user._id

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

    const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(()=>{
    const checkStore = async () => {
        const res = await axios.get(`${API_URL}/store/${userId}`)
        if(res.data.length === 1){
            console.log("store there")
            navigate("/OwnerDashboard")
        }
    }
    checkStore()
  },[])

const handleSubmit = async (e) => {
  e.preventDefault();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  if (formData.address.length > 400) {
    alert("Address cannot exceed 400 characters.");
    return;
  }

  if (!emailRegex.test(formData.email)) {
    alert("Please enter a valid email address.");
    return;
  }



  let resultAction;
  try {
    resultAction = await dispatch(createStore({...formData,userId}));
    console.log(resultAction);

    if (resultAction.meta.requestStatus === "fulfilled") {
      navigate("/OwnerDashboard");
    }
  } catch (error) {
    console.error("Registration failed:", error);
  }
};

  return (
    <>
      <TopBar />
    <div className="flex justify-center items-center h-[80vh] bg-gray-50">

      <form className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center">Create Store</h2>

        <div>
          <Label htmlFor="name" className="pb-1">Store Name</Label>
          <Input id="name" type="text" placeholder="Enter store name" value={formData.name}
              onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="email" className="pb-1">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" value={formData.email}
              onChange={handleChange} />
        </div>
        
        <div>
          <Label htmlFor="address" className="pb-1">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full">
          Create Store
        </Button>
     
       {status === "failed" && (
        <p className="text-red-500">
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">
              Error:{" "}
              {typeof error === "object"
                ? error.Message || JSON.stringify(error)
                : error}
            </span>
          </div>
        </p>
      )}
       </form>
    </div>

    </>
  )
}

export default CreateStore
