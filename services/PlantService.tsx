import { Plant } from "@/types";
import { sessionStorageService } from "./sessionStorageService";

const getAllPlants = async () => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plants/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

const getAllPlantsPage = async (page: Number) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plants?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

const getPlantsByOwnerId = async (id: number) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plants/all/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

const addPlant = async (plant: any) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plants/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
    body: JSON.stringify(plant),
  });
};

const editPlant = async (plant: any, plantId: Number) => {
  console.log("err ", plant);
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/plants/edit/${plantId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + sessionStorageService.getItem("token"),
      },
      body: JSON.stringify(plant),
    }
  );
};

const getPlantById = async (id: any) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plants/` + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

const deletePlant = async (id: any) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plants/` + id, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

const updateAutoPilot = async (id: any, plant: Plant) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plants/` + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
    body: JSON.stringify(plant),
  });
};

const waterPlant = async (id: any) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/plants/` + id + "/water",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + sessionStorageService.getItem("token"),
      },
    }
  );
};

const sortPlants = async (sortBy: string, direction: string, page: number, size: number) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/plants/sort?sortBy=${sortBy}&direction=${direction}&page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + sessionStorageService.getItem("token"),
      },
    }
  ).then((response) => response.json());
};


const identifyPlant = async (image: File) => {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const url = `https://my-api.plantnet.org/v2/identify/all?include-related-images=false&no-reject=false&lang=en&type=kt&api-key=${API_KEY}`;

  const formData = new FormData();
  formData.append("images", image);
  formData.append("organs", "auto");

  console.log(image);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
    headers: {
      accept: "application/json",
    },
  });

  if (response.ok) {
    const result = await response.json();
    if ("bestMatch" in result) {
      return result.bestMatch;
    } else {
      return "No best match found.";
    }
  } else {
    console.error("Error:", response.status, response.statusText);
    return "Error identifying plant.";
  }
};

const PlantService = {
  getAllPlants,
  getAllPlantsPage,
  addPlant,
  editPlant,
  getPlantById,
  getPlantsByOwnerId,
  deletePlant,
  updateAutoPilot,
  waterPlant,
  sortPlants,
  identifyPlant,
};
export default PlantService;
