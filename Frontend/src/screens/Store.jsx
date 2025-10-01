import { getStores } from '@/store/API/store';
import { TopBar } from '../components/TopBar';
import { StoreCard } from '../components/storeCard';
import { storeData } from '../utils';
import { useDispatch, useSelector } from "react-redux";
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function StorePage() {
  const [name,setName] = useState()
  const [address,setAddress] = useState()
  const [page,setPage] = useState(1)
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getStores({name,address,page}))
  },[name,address,page])
    const { data } = useSelector((state) => state?.getStores);
   const totalPages = data?.totalPages

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 h-[75vh]">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Available Stores</h2>

        <div className='flex max-w-[40vw] gap-5 m-3 justify-end ml-auto'>
          <div>
          <Label htmlFor="name" className="pb-1 pl-1">Store Name</Label>
          <Input id="name" type="text" placeholder="Enter store name" value={name}
              onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="address" className="pb-1 pl-1">Address</Label>
          <Input id="address" type="text" placeholder="Enter address" value={address}
              onChange={e=>setAddress(e.target.value)} />
        </div>
          
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.stores?.map((store) => (
            <div key={store.id} onClick={() => navigate(`/store/${store.id}`, { state: { store } })} className="cursor-pointer" >
            <StoreCard store={store} />
            </div> 
          ))}
        </div>

        {storeData.length === 0 && (
          <p className="text-center text-gray-500 py-10">No stores found.</p>
        )}
      </main>

        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>

    </div>
  );
}