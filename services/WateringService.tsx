import { sessionStorageService } from "./sessionStorageService";

const logWatering = async (plantId: number, email: string, type: "MANUAL" | "AUTO_ON" | "AUTO_OFF") => {
  return fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/watering/${plantId}/${email}/${type}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + sessionStorageService.getItem("token"),
      },
      body: JSON.stringify({ plantId }),
    }
  );
};

const WateringService = {
  logWatering,
};

export default WateringService;
