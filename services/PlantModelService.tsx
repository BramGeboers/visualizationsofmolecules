import { PlantModel } from "@/types";
import { sessionStorageService } from "./sessionStorageService";


const addPlantModel = async (plantModel: PlantModel) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/plantmodel/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + sessionStorageService.getItem("token"),
      },
      body: JSON.stringify(plantModel),
    });
  };


  const updatePlantModel = async (plantModel: PlantModel, plantId: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/plantmodel/${plantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + sessionStorageService.getItem("token"),
      },
      body: JSON.stringify(plantModel),
    });
  };

  const PlantModelService = { updatePlantModel, addPlantModel };
  export default PlantModelService;