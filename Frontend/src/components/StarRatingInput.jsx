import React, { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, onRate }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-8 w-8 cursor-pointer transition duration-150 
            ${(hover || rating) >= star 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-gray-300"}`}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        />
      ))}
    </div>
  );
};

export default StarRating;
