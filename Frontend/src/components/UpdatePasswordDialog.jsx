import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSelector } from 'react-redux';
import { API_URL } from '@/store/API/store';
import axios from 'axios';

export function UpdatePasswordDialog({ children }) {

  const { status, error,data } = useSelector((state) => state.LoginAPI);
  const email = data[0]?.user.email

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: email,
    oldPassword: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting to update password with:', formData);

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      alert("Password must be 8–16 characters, include at least one uppercase letter and one special character.");
      return;
    }

    await axios.post(`${API_URL}/auth/update-password`, formData)

    alert(`Password update request for ${formData.email} submitted. Check console for details.`);
    setOpen(false);
    setFormData({ email: '', oldPassword: '', newPassword: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
          <DialogDescription>
            Enter your email and passwords to update your account credentials.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              className="col-span-3"
              disabled={true}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="oldPassword" className="text-right">
              Current
            </Label>
            <Input
              id="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              New
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}