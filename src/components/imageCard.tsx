import React from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleFavorite } from "../store/favoritesSlices";
import { Star } from "lucide-react";
import imageCategories from "../utils/imagesData";

interface ImageCardProps {
  image: {
    image: string;
    user: {
      name: string;
    };
    id: number;
  };
}

const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.favorites);

  const isFavorite = favorites.includes(image.id);

  const getImageData = (imageId: number) => {
    return (
      (imageCategories as any)[imageId] || {
        category: "General",
        description: "Video interesante",
      }
    );
  };

  const imageData = getImageData(image.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(
      toggleFavorite({
        id: image.id,
        image: image.image,
        user: image.user,
      })
    );
  };

  return (
    <div className="min-h-64 border rounded-2xl max-w-56 flex flex-col p-2 relative">
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-4 right-4 z-10 rounded-full p-1 ${
          isFavorite
            ? "bg-yellow-300 hover:bg-yellow-400"
            : "bg-gray-50 hover:bg-gray-200"
        }`}
      >
        <Star
          size={25}
          className={`stroke-none ${
            isFavorite ? "fill-yellow-600" : "fill-gray-300"
          } transition-colors`}
        />
      </button>
      <img
        src={image.image}
        alt={image.user.name}
        className="w-56 h-auto aspect-square object-cover rounded-xl"
      />
      <div className=" mt-2">
        <h4 className="font-semibold">{image.user.name}</h4>
        <p className="text-sm text-slate-500">{imageData.description}</p>
      </div>
    </div>
  );
};

export default ImageCard;
