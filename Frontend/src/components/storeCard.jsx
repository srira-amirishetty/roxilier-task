import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from 'lucide-react';

export function StoreCard({ store }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>{store.name}</CardTitle>
        <CardDescription className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>{store?.overallRating} Overall Rating</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 truncate">{store?.address}</p>
      </CardContent>
    </Card>
  );
}