import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { userRegister } from '@/store/API/Auth';

export function Register({ isModal = false, closeModal }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.LoginAPI);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        address: "",
        role: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameRegex = /^.{20,60}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

        if (!nameRegex.test(formData.username)) {
            alert("Name must be between 20 and 60 characters.");
            return;
        }
        if (formData.address.length > 400) {
            alert("Address cannot exceed 400 characters.");
            return;
        }
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!passwordRegex.test(formData.password)) {
            alert("Password must be 8–16 characters, include at least one uppercase letter and one special character.");
            return;
        }

        let resultAction;
        try {
            resultAction = await dispatch(userRegister(formData));

            if (resultAction.meta.requestStatus === "fulfilled") {
                if (isModal && closeModal) {
                    closeModal();
                    alert("User Registered Successfully!");
                } 
            }
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const mainContainerClasses = isModal ? "w-full space-y-4" : "flex justify-center items-center min-h-screen bg-gray-50";
    const formClasses = isModal ? "p-0 space-y-4" : "w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4";


    return (
        <div className={mainContainerClasses}>
            {!isModal && (
                <div className="absolute top-4 right-6 text-lg font-semibold cursor-pointer" onClick={() => navigate("/admin-login")}>
                    Admin
                </div>
            )}
            
            <form className={formClasses} onSubmit={handleSubmit}>
                {!isModal && <h2 className="text-2xl font-bold text-center">Register</h2>}

                <div>
                    <Label htmlFor="username" className="pb-1">Name</Label>
                    <Input id="username" type="text" placeholder="Enter your name" value={formData.username}
                        onChange={handleChange} />
                </div>
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
                    <Label className="pb-1">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="shopOwner">Shop Owner</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" className="w-full">
                    Register
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

                {!isModal && (
                    <h3 onClick={() => navigate('/')} className="transition duration-500 ease-in-out transform hover:scale-105" >
                        Already Registered Login Now
                    </h3>
                )}
            </form>
        </div>
    );
}
