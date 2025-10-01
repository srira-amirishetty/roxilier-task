import { Button } from "@/components/ui/button";
import { UpdatePasswordDialog } from './UpdatePasswordDialog';
import { clearUserSession } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/Slice/loginSlice";


export function TopBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    clearUserSession();
    navigate('/register');
    dispatch(logoutUser());

  };

  return (
    <div className="sticky top-0 z-10 w-full border-b bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-gray-900">Store Dashboard</h1>
        <div className="flex space-x-2">
          <UpdatePasswordDialog>
            <Button variant="outline">Update Password</Button>
          </UpdatePasswordDialog>

          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}