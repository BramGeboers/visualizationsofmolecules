import { sessionStorageService } from "./sessionStorageService";

const getAccessToken = () => {
  return sessionStorageService.getItem("token");
};

const getMediaByPath = async (mediaPath: string) => {
  const token = await getAccessToken();
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/media/${mediaPath}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  });
};

const getMediaByPathAndBucket = async (mediaPath: string, Bucket: string) => {
  const token = await getAccessToken();
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/media/${mediaPath}/${Bucket}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  });
};

const uploadMedia = async (formData: FormData, file: String) => {
  const token = await getAccessToken();
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/media/add/${file}`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token
    },
    body: formData,
  });
};

const deleteMedia = async (source: String) => {
  const token = await getAccessToken();
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/media/delete/" + source, {
    method: "DELETE",
    headers: {
      "Authorization": "Bearer " + token
    }
  });
};

const MediaService = {
  getMediaByPath,
  deleteMedia,
  uploadMedia,
  getMediaByPathAndBucket
};

export default MediaService;
