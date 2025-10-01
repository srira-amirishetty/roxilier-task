import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/StarRatingInput";
import { API_URL } from "@/store/API/store";
import { TopBar } from "@/components/TopBar";

const SingleStorePage = () => {
  const { storeId } = useParams();
  const location = useLocation();
  const storeData = location.state?.store;

  const { data } = useSelector((state) => state.LoginAPI);
  const userId = data[0]?.user._id;

  const [store, setStore] = useState(storeData || null);
  const [currentRating, setCurrentRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userRatings, setUserRatings] = useState([]);


  useEffect(() => {
    const getUserRating = async () => {
      try {
        setIsLoading(true);
        setStore(storeData);

        const res = await axios.get(`${API_URL}/rating/${userId}/${storeData._id}`);
        // console.log(res.data);
        if (res.data) {
          setCurrentRating(res.data.rating);
        } else {
          setCurrentRating(0);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getUserRating();
  }, [storeId, userId, storeData]);

    useEffect(() => {
    const getRatings = async () => {
      try {
        const res = await axios.get(`${API_URL}/rating/${storeData._id}`);
        console.log(res.data);
        if (res.data) {
          setAverageRating(res.data.averageRating);
          setUserRatings(res.data.ratings);
        } else {
          setAverageRating(0);
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getRatings();
  }, []);


    const handleRatingSubmit = async () => {
        try {
        await axios.post(`${API_URL}/rating/${userId}/${storeData._id}`, {
            rating: newRating,
        });
        setCurrentRating(newRating);
        setNewRating(0);
        alert("Rating updated successfully!");
        } catch (error) {
        console.error("Error updating rating:", error);
        }
    };

    const handleDeleteRating = async () => {
        try {
            await axios.delete(`${API_URL}/rating/${userId}/${storeData._id}`);
            setCurrentRating(0);
            alert("Rating deleted successfully!");
        } catch (error) {
            console.error("Error deleting rating:", error);
        }
    };

  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <>
    <TopBar />
    <div className="p-6">
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold">{store?.name}</h1>
          <p className="text-gray-600">{store?.address}</p>

          <div className="mt-4">
            <p className="text-lg">⭐ Overall Rating: {averageRating || "N/A"}</p>
            <div className="flex items-center gap-4 mt-2">
            <p className="text-lg">⭐ Your Rating: {currentRating}</p>
            <Button onClick={handleDeleteRating} disabled={!currentRating}>
                Delete Rating
            </Button>
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <h2 className="text-xl font-semibold mb-3">Update Your Rating</h2>
            <div className="flex items-center gap-4">
              <StarRating rating={newRating || currentRating} onRate={setNewRating} />
              <Button onClick={handleRatingSubmit} disabled={!newRating}>
                Submit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="mt-6 w-[90vw] mx-auto rounded-2xl shadow-lg">
      <CardContent>
        <h2 className="text-xl font-semibold mb-3">Your Ratings</h2>
        {userRatings.length > 0 ? (
          userRatings.map((rating) => (
            <div key={rating._id} className="flex items-center justify-between py-2 border-b ">
              <StarRating rating={rating.rating} />
              <span className="text-lg text-gray-500">{rating.userId.username}</span>
              <span className="text-lg text-gray-500">{rating.userId.email}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground p-4">No ratings found.</p>
        )}
      </CardContent>
    </Card>
    </>
  );
};

export default SingleStorePage;
