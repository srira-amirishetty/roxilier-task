import { TopBar } from "@/components/TopBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/store/API/store";
import customAxios from "@/utils";
import { Star, Store, User } from "lucide-react"; 
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 transition-colors duration-200 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          fill={i < rating ? "currentColor" : "none"}
          strokeWidth={2}
        />
      ))}
    </div>
  );
};

export function OwnerStoreDashboard() {

  const [store, setStore] = useState();
  const { data } = useSelector((state) => state.LoginAPI);
  const userId = data[0]?.user._id;
  const [userRatings, setUserRatings] = useState([]);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const res = await customAxios.get(`${API_URL}/store/${userId}`);
        setStore(res.data?.[0]);
      } catch (error) {
        console.error("Error fetching store details:", error);
      } 
    }
    fetchStoreDetails();

  },[])

  useEffect(() => {
    if (!store?._id) return;
    const fetchUserRatings = async () => {
      try {
        const res = await customAxios.get(`${API_URL}/rating/${store?._id}`);
        console.log("trigger")
        setUserRatings(res.data.ratings);
      } catch (error) {
        console.error("Error fetching user ratings:", error);
      }
    }
    fetchUserRatings();

  },[store])


  const ratingCounts = userRatings?.reduce((acc, rating) => {
    acc[rating.rating] = (acc[rating.rating] || 0) + 1;
    return acc;
  }, {});

  console.log(ratingCounts);

  const starBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: ratingCounts[star] || 0,
    percentage: userRatings.length > 0 ? ((ratingCounts[star] || 0) / userRatings.length) * 100 : 0,
  }));

  return (
    <>
            <TopBar />
    <div className="p-4 md:p-6 lg:p-8 space-y-6">

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-medium flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" /> {store?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm">
            Address: {store?.address} 
          </CardDescription>

          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Store Average Rating
              </p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">{store?.overallRating?.toFixed(1)}</span>
                <StarRating rating={Math.round(store?.overallRating)} />
              </div>
              <p className="text-xs text-muted-foreground">
                Based on {userRatings?.length} ratings
              </p>
            </div>

            <div className="space-y-1">
              {starBreakdown.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center text-xs">
                  <div className="w-10 text-right pr-2 font-medium">{star} Star</div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full mr-2">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    />
                  </div>
                  <div className="w-8 text-right text-muted-foreground">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-4">Latest User Ratings</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({userRatings?.length})</TabsTrigger>
            <TabsTrigger value="5star">5 Stars ({ratingCounts[5] || 0})</TabsTrigger>
            <TabsTrigger value="4star">4 Stars ({ratingCounts[4] || 0})</TabsTrigger>
            <TabsTrigger value="3star">3 Stars ({ratingCounts[3] || 0})</TabsTrigger>
            <TabsTrigger value="low">2 & Below ({ (ratingCounts[2] || 0) + (ratingCounts[1] || 0) })</TabsTrigger>
          </TabsList>

          {[5, 4, 3].map(starFilter => (
            <TabsContent key={`${starFilter}star`} value={`${starFilter}star`}>
              <Card>
                <CardContent className="pt-6 space-y-3">
                  {userRatings
                    .filter(r => r.rating === starFilter)
                    .slice(0, 10) 
                    .map(rating => (
                      <div key={rating.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium">{rating.userId.username}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <StarRating rating={rating.rating} />

                        </div>
                      </div>
                    ))}
                  {userRatings.filter(r => r.rating === starFilter).length === 0 && (
                      <p className="text-center text-muted-foreground p-4">No {starFilter}-star ratings found.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}

          <TabsContent value="all">
            <Card>
              <CardContent className="pt-6 space-y-3">
                {userRatings.slice(0, 15).map(rating => (
                  <div key={rating.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium">{rating?.userId?.username}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <StarRating rating={rating.rating} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="low">
            <Card>
              <CardContent className="pt-6 space-y-3">
                {userRatings
                    .filter(r => r.rating <= 2)
                    .slice(0, 10)
                    .map(rating => (
                      <div key={rating.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium">{rating.userId.username}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <StarRating rating={rating.rating} />
                        </div>
                      </div>
                    ))}
                  {userRatings.filter(r => r.rating <= 2).length === 0 && (
                      <p className="text-center text-muted-foreground p-4">No low ratings (2 stars or less) found.</p>
                  )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
    </>
  );
}