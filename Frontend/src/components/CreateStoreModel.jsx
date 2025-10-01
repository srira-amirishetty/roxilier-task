import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { API_URL, createStore } from '@/store/API/store';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


export function CreateStore({ isModal = false, closeModal }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, error, data } = useSelector((state) => state.LoginAPI);

    const userId = data && data.length > 0 ? data[0]?.user._id : null;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        userId: "",
    });
    const [users,setUsers] = useState([])

    useEffect(() => {
        const getAllUsersNames = async () => {
            try {

                const res = await axios.get(`${API_URL}/admin/users/names`);
                console.log(res.data);
                setUsers(res.data);
            } catch (e) {
                console.error("Error fetching user names:", e);
            }
        }
        getAllUsersNames();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

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

        if (!userId) {
            alert("User ID is missing. Cannot create store.");
            return;
        }

        let resultAction;
        try {
            resultAction = await dispatch(createStore(formData));

            if (resultAction.meta.requestStatus === "fulfilled") {
                if (isModal && closeModal) {
                    closeModal();
                    alert("Store Created Successfully!");
                } 
            }
        } catch (error) {
            console.error("Store creation failed:", error);
        }
    };

    const mainContainerClasses = isModal ? "w-full space-y-4" : "flex justify-center items-center h-[80vh] bg-gray-50";
    const formClasses = isModal ? "p-0 space-y-4" : "w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4";

    return (
        <div className={mainContainerClasses}>
            {!isModal && <TopBar />}

            <form className={formClasses} onSubmit={handleSubmit}>
                {!isModal && <h2 className="text-2xl font-bold text-center">Create Store</h2>}

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

                <div>
                    <Label className="pb-1">User</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                        <SelectContent>
                        {users.map((user) => (
                            <SelectItem key={user._id} value={user._id}>{user.username}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                    Create Store
                </Button>
            </form>
        </div>
    );
}