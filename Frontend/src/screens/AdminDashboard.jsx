import React, { use, useEffect, useMemo, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Register } from '../components/RegisterModel';
import { Button } from '@/components/ui/button';
import { CreateStore } from '../components/CreateStoreModel';
import { CardContent,Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronUp, ChevronDown } from "lucide-react";
import axios from 'axios';
import { API_URL } from '@/store/API/store';
import { clearUserSession } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const AdminDashboard = () => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isStoreModalOpen, setIsStoreModalOpen] = useState(false); 
    const [users, setUsers] = useState();
    const [filters, setFilters] = useState({ username: "", email: "", address: "", role: "" });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        const getAllUsers = async () => {
            try{
                const res = await axios.get(`${API_URL}/admin/users/all`)
                setUsers(res.data);
            }catch(e){
                console.error("Error fetching users:", e);
            }
        };
        getAllUsers();
    },[])


      const toggleRole = async(id) => {

        await axios.patch(`${API_URL}/admin/users/role/${id}`);

         setUsers((prev) =>
           prev.map((user) =>
             user._id === id
               ? { ...user, role: user.role === "user" ? "shopOwner" : "user" }
               : user
           )
         );
       };

  const filteredUsers = useMemo(() => {
    return users?.filter((u) => {
      return (
        (filters.username ? u.username.toLowerCase().includes(filters.username.toLowerCase()) : true) &&
        (filters.email ? u.email.toLowerCase().includes(filters.email.toLowerCase()) : true) &&
        (filters.address ? u.address.toLowerCase().includes(filters.address.toLowerCase()) : true) &&
        (filters.role ? u.role === filters.role : true)
      );
    });
  }, [users, filters]);   
  
  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      const valA = a[sortConfig.key]?.toLowerCase();
      const valB = b[sortConfig.key]?.toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  const totalPages = Math.ceil(sortedUsers?.length / itemsPerPage);
  const paginatedUsers = sortedUsers?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    const handleLogout = () => {
        clearUserSession();
        navigate('/register');
        dispatch(logoutUser());
    };

    const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

    return (
        <div className="min-h-screen bg-gray-50">

            <nav className="flex justify-between items-center px-10 h-16 bg-white shadow-md">
                 <h1 className="text-2xl font-bold">Admin Dashboard Overview</h1>
                <div className="flex space-x-4">
                    
                    <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" className="w-40">Create User</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                                <DialogDescription>Register a new user (admin/shop owner/customer).</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Register 
                                    isModal={true} 
                                    closeModal={() => setIsUserModalOpen(false)} 
                                />
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isStoreModalOpen} onOpenChange={setIsStoreModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" className="w-40">Create Store</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]"> 
                            <DialogHeader>
                                <DialogTitle>Create New Store</DialogTitle>
                                <DialogDescription>Register a new store linked to an owner.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <CreateStore 
                                    isModal={true} 
                                    closeModal={() => setIsStoreModalOpen(false)} 
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                    
                    <Button variant="destructive" onClick={handleLogout} className="w-40">
                        Logout
                </Button>
                </div>
                
            </nav>


            <div className="p-4">
                            <StatsSection />
                <h2 className="text-xl font-bold mb-4">Users Dashboard</h2>
                 <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          placeholder="Filter by Name"
          value={filters.username}
          onChange={(e) => setFilters({ ...filters, username: e.target.value })}
        />
        <Input
          placeholder="Filter by Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <Input
          placeholder="Filter by Address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <Select
          onValueChange={(value) => setFilters({ ...filters, role: value })}
          value={filters.role}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="shopOwner">Shop Owner</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2">
                Name
                <button className="ml-1" onClick={() => requestSort("username")}>
                  {sortConfig.key === "username" && sortConfig.direction === "asc" ? (
                    <ChevronUp className="inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="p-2">
                Email
                <button className="ml-1" onClick={() => requestSort("email")}>
                  {sortConfig.key === "email" && sortConfig.direction === "asc" ? (
                    <ChevronUp className="inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="p-2">Address</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers?.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.address}</td>
                <td className="p-2 capitalize">{user.role}</td>
                <td className="p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRole(user._id)}
                  >
                    {user.role === "user" ? "Set as ShopOwner" : "Set as User"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
         <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
            </div>
            <StoresDashboard />
        </div>
    );
};

export default AdminDashboard;


 function StoresDashboard() {
  const [stores,setStores] = useState();
  const [filters, setFilters] = useState({ name: "", email: "", address: "", overallRating: "" });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

      useEffect(() => {
        const getAllStores = async () => {
            try{
                const res = await axios.get(`${API_URL}/store/get/all`)
                console.log(res.data);
                setStores(res.data);
            }catch(e){
                console.error("Error fetching stores:", e);
            }
        };
        getAllStores();
    },[])

  const filteredStores = useMemo(() => {
    return stores?.filter((s) => {
      return (
        (filters.name ? s.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
        (filters.email ? s.email.toLowerCase().includes(filters.email.toLowerCase()) : true) &&
        (filters.address ? s.address.toLowerCase().includes(filters.address.toLowerCase()) : true) &&
        (filters.overallRating ? s.overallRating.toString().includes(filters.overallRating) : true)
      );
    });
  }, [stores, filters]);

  const sortedStores = useMemo(() => {
    if (!sortConfig.key) return filteredStores;
    return [...filteredStores].sort((a, b) => {
      const valA = a[sortConfig.key].toString().toLowerCase();
      const valB = b[sortConfig.key].toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredStores, sortConfig]);

  const totalPages = Math.ceil(sortedStores?.length / itemsPerPage);
  const paginatedStores = sortedStores?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <Card className="p-4 shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Stores Dashboard</h2>

      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Input
          placeholder="Filter by Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <Input
          placeholder="Filter by Email"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <Input
          placeholder="Filter by Address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <Input
          placeholder="Filter by Rating"
          value={filters.overallRating}
          onChange={(e) => setFilters({ ...filters, overallRating: e.target.value })}
        />
      </CardContent>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2">
                Name
                <button className="ml-1" onClick={() => requestSort("name")}>
                  {sortConfig.key === "name" && sortConfig.direction === "asc" ? (
                    <ChevronUp className="inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="p-2">
                Email
                <button className="ml-1" onClick={() => requestSort("email")}>
                  {sortConfig.key === "email" && sortConfig.direction === "asc" ? (
                    <ChevronUp className="inline h-4 w-4" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="p-2">Address</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStores?.map((store) => (
              <tr key={store.id} className="border-t">
                <td className="p-2">{store.name}</td>
                <td className="p-2">{store.email}</td>
                <td className="p-2">{store.address}</td>
                <td className="p-2">{store.overallRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}


 function StatsSection() {
    const [userCount, setUserCount] = useState(0);
    const [storeCount, setStoreCount] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);

    useEffect(() => {
       const getDetails = async () => {
            try {
                const usersRes = await axios.get(`${API_URL}/admin/users`);
                setUserCount(usersRes.data);
                // console.log(usersRes.data);
                const storesRes = await axios.get(`${API_URL}/admin/stores`);
                setStoreCount(storesRes.data);
                const ratingsRes = await axios.get(`${API_URL}/admin/ratings`);
                setRatingCount(ratingsRes.data);
            } catch (error) {
                console.error("Error fetching admin details:", error);
            }
        };

        getDetails();
    }, []);
  return (
    <section className="w-full p-3 ">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-3 text-center">
            <h2 className="text-lg font-semibold text-gray-700">Users</h2>
            <p className="text-4xl font-bold text-blue-600 mt-2">{userCount}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-3 text-center">
            <h2 className="text-lg font-semibold text-gray-700">Stores</h2>
            <p className="text-4xl font-bold text-green-600 mt-2">{storeCount}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-3 text-center">
            <h2 className="text-lg font-semibold text-gray-700">Ratings</h2>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{ratingCount}</p>
          </CardContent>
        </Card>

      </div>
    </section>
  )
}
