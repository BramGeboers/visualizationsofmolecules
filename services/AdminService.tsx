const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllLogs = async () => {
  console.log("fetching all logs");
  return await fetch(baseUrl + `/watering`, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
    },
  });
};

const getAllLogsByUserId = async (userId: number) => {
  console.log("fetching all logs by userId:" + userId);
  return await fetch(baseUrl + `/watering/getByUserId/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
    },
  });
};

const getAllLogsByPlantId = async (plantId: number) => {
  console.log("fetching all logs by plantId:" + plantId);
  return await fetch(baseUrl + `/watering/getByPlantId/${plantId}`, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
    },
  });
};

const getLast10Logs = async () => {
  console.log("fetching last 10 logs");
  return await fetch(baseUrl + `/watering/getLast10Logs`, {
    method: "GET",
    headers: {
      "Content-Type": "Application/json",
    },
  });
};

const AdminService = {
  getAllLogs,
  getAllLogsByUserId,
  getAllLogsByPlantId,
  getLast10Logs,
};
export default AdminService;
