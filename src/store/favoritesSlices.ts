import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FavoriteImage {
  id: number;
  image: string;
  user: {
    name: string;
  };
}

interface FavoritesState {
  favorites: number[];
  favoritesImages: FavoriteImage[];
}

const initialState: FavoritesState = {
  favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
  favoritesImages: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<FavoriteImage>) => {
      const imageId = action.payload.id;
      const isAlreadyFavorite = state.favorites.includes(imageId);

      if (isAlreadyFavorite) {
        state.favorites = state.favorites.filter((id) => id !== imageId);
        state.favoritesImages = state.favoritesImages.filter(
          (image) => image.id !== imageId
        );
      } else {
        state.favorites.push(imageId);
        state.favoritesImages.push(action.payload);
      }

      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
    loadFavoritesImages: (state, action: PayloadAction<FavoriteImage[]>) => {
      state.favoritesImages = action.payload.filter((image) =>
        state.favorites.includes(image.id)
      );
    },
  },
});

export const { toggleFavorite, loadFavoritesImages } = favoritesSlice.actions;
export default favoritesSlice.reducer;
