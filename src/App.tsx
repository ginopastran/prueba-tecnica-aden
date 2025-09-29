import axios from "axios";
import { useState, useEffect } from "react";
import ImageCard from "./components/imageCard";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { loadFavoritesImages } from "./store/favoritesSlices";
import { Star } from "lucide-react";
import imageCategories from "./utils/imagesData";

function App() {
  // const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imagesData, setImagesData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const dispatch = useAppDispatch();
  const { favoritesImages, favorites } = useAppSelector(
    (state) => state.favorites
  );

  const getImageData = (imageId: number) => {
    return (
      (imageCategories as any)[imageId] || {
        category: "Todas",
        description: "No se encontró información",
      }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.pexels.com/videos/popular",
          {
            headers: {
              Authorization: import.meta.env.VITE_API_KEY,
            },
          }
        );
        console.log("Data:", response.data.videos);
        setImagesData(response.data.videos);
        setFilteredData(response.data.videos);

        dispatch(loadFavoritesImages(response.data.videos));
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // useEffect(() => {
  //   if (searchTerm.trim() === "") {
  //     setFilteredData(imagesData);
  //   } else {
  //     const filtered = imagesData.filter((image) =>
  //       image.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setFilteredData(filtered);
  //   }
  // }, [searchTerm, imagesData]);

  useEffect(() => {
    const baseData = showFavorites ? favoritesImages : imagesData;

    let filtered = baseData;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((image) =>
        image.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "Todas") {
      filtered = filtered.filter((image) => {
        const imageData = getImageData(image.id);
        return imageData.category === selectedCategory;
      });
    }

    setFilteredData(filtered);
  }, [
    searchTerm,
    imagesData,
    showFavorites,
    favoritesImages,
    selectedCategory,
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleFavoritesView = () => {
    setShowFavorites(!showFavorites);
    setSearchTerm("");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center p-4">
        <h1 className="text-xl font-semibold">
          Prueba Técnica – Frontend (ADEN)
        </h1>
        <div className=" mt-2 w-full flex gap-4 justify-center items-center">
          <input
            type="text"
            id="search"
            placeholder="Buscar por nombre"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded-xl p-2 text-sm w-[20rem]"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-xl p-2 text-sm"
          >
            <option value="Todas">Todas</option>
            <option value="Nature">Nature</option>
            <option value="Landscape">Landscape</option>
            <option value="Animals">Animals</option>
            <option value="Space">Space</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
          <button
            onClick={toggleFavoritesView}
            className={`flex text-sm itec-center items-center gap-2 rounded-xl p-2 ${
              showFavorites
                ? "bg-yellow-300 hover:bg-yellow-400"
                : "bg-gray-50 hover:bg-gray-200"
            }`}
          >
            <Star
              size={25}
              className={`stroke-none ${
                showFavorites ? "fill-yellow-600" : "fill-gray-300"
              } transition-colors`}
            />
            Favoritos
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mt-10">
          {filteredData.map((img, idx) => (
            <ImageCard key={idx} image={img} />
          ))}
        </div>
        {filteredData.length === 0 &&
          (searchTerm.trim() !== "" || selectedCategory !== "Todas") && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-lg">
                No se encontraron resultados para{" "}
                {searchTerm.trim() !== "" && `"${searchTerm}"`}
                {showFavorites && " en tus favoritos"}
              </p>
              <p className="text-slate-500 text-sm">
                {/* {searchTerm.trim() !== "" && `Búsqueda: "${searchTerm}"`} */}
                {searchTerm.trim() !== "" &&
                  selectedCategory !== "Todas" &&
                  " • "}
                {selectedCategory !== "Todas" &&
                  `Categoría: ${selectedCategory}`}
              </p>
            </div>
          )}

        {filteredData.length === 0 &&
          searchTerm.trim() === "" &&
          selectedCategory === "Todas" &&
          showFavorites && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-lg">
                No tienes fotos favoritas aún
              </p>
              <p className="text-slate-500 text-sm">
                Marca algunas fotos como favoritas para verlas aquí
              </p>
            </div>
          )}
      </div>
    </>
  );
}

export default App;
