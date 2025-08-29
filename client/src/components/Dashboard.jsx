import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

export default function Dashboard() {
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [images, setImages] = useState({}); // store image per folderId
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
 const [selectedImage, setSelectedImage] = useState(null);
  const token = localStorage.getItem("token");

  // fetch folders
  const fetchFolders = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/folders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFolders(res.data);
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  // create folder
  const createFolder = async () => {
    if (!folderName) return toast.error("Folder name is required");
    try {
      await axios.post(
        "http://localhost:5001/api/folders",
        { name: folderName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Folder created successfully");
      setFolderName("");
      fetchFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Error creating folder");
    }
  };

  // upload image (per folder)
  const uploadImage = async (folderId) => {
    const image = images[folderId];
    if (!image) return toast.error("Please select an image to upload");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", image.name);

    try {
      await axios.post(
        `http://localhost:5001/api/images/${folderId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Image uploaded successfully");
      setImages((prev) => ({ ...prev, [folderId]: null })); // reset for that folder
      fetchFolders();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    }
  };

  // search images
  const searchImages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/images/search?name=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(res.data);
    } catch (error) {
      console.error("Error searching images:", error);
      toast.error("Error searching images");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📂 Dashboard</h2>

      {/* create folder */}
      <div className="mb-6 flex space-x-3">
        <input
          placeholder="Enter folder name"
          value={folderName}
          className="px-3 py-2 border rounded-lg shadow-sm w-64 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFolderName(e.target.value)}
        />
        <Button onClick={createFolder} className="cursor-pointer">
          Create Folder
        </Button>
      </div>

      {/* search image */}
      <div className="mb-6 flex space-x-3">
        <input
          placeholder="Search image"
          value={searchTerm}
          className="px-3 py-2 border rounded-lg shadow-sm w-64 focus:ring-2 focus:ring-green-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={searchImages} className="cursor-pointer">
          Search
        </Button>
      </div>

      {/* search results */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Search Results:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {searchResults.map((img) => (
              <Card
                key={img._id}
                className="shadow hover:shadow-md transition"
              >
                <CardContent className="p-2">
                  <img
                    src={`http://localhost:5001/uploads/${img.user}/${img.fileName}`}
                    alt={img.name}
                    className="w-full h-32 object-cover rounded-md cursor-pointer"
                    onClick={() =>
                      setSelectedImage(
                        `http://localhost:5001/uploads/${img.user}/${img.fileName}`
                      )
                    }
                  />
                  <p className="text-sm mt-2 text-center">{img.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full view"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* folders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {folders.map((folder) => (
          <Card
            key={folder._id}
            className="p-4 shadow hover:shadow-lg transition"
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📁</span>
                <span>{folder.name}</span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <input
                type="file"
                onChange={(e) =>
                  setImages((prev) => ({
                    ...prev,
                    [folder._id]: e.target.files[0],
                  }))
                }
                
                className="text-sm mb-2 hover:cursor-pointer"
              />

              <Button
                className="mt-2 w-full cursor-pointer"
                onClick={() => uploadImage(folder._id)}
              >
                Upload
              </Button>

              {/* preview selected file before upload */}
              {images[folder._id] && (
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {images[folder._id].name}
                </p>
              )}

              <div className="mt-3 grid grid-cols-3 gap-2">
                {folder.images?.map((img) => (
                  <img
                    key={img._id}
                    src={`http://localhost:5001/uploads/${img.path}`}
                    alt={img.name}
                    className="w-full h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
