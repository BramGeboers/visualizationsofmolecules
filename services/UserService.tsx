import { sessionStorageService } from "./sessionStorageService";

const getAllUsers = async () => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/user/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

const updateUserRole = async (userId: number, role: string) => {
  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }/user/${userId}/role?role=${encodeURIComponent(role)}`;

  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

const getUserByEmail = async (email: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/email/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

const getUserById = async (userId: number) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/id/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};


const getEasterEggsFound = async () => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/get-easter-eggs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

  const incrementEasterEggsFound = async () => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/easter-eggs`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + sessionStorageService.getItem("token"),
        }
    });
}

const UserService = {
  getUserByEmail,
};

const lockUser = async (userId: number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/user/${userId}/lock`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

const unlockUser = async (userId: number) => {
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/user/${userId}/unlock`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

const deleteUser = async (userId: number) => {
  // First, fetch the user's plants
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/plants/all/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });

  if (response.ok) {
    const plants = await response.json();

    // Delete each plant if the user has any
    if (plants.length > 0) {
      for (const plant of plants) {
        await fetch(process.env.NEXT_PUBLIC_API_URL + `/plants/${plant.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + sessionStorageService.getItem("token"),
          },
        });
      }
    }
  }

  // Delete the user regardless of whether they have plants or not
  return fetch(process.env.NEXT_PUBLIC_API_URL + `/user/delete/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + sessionStorageService.getItem("token"),
    },
  });
};

export default {
  getAllUsers,
  updateUserRole,
  getUserByEmail,
  getUserById,
  lockUser,
  unlockUser,
  deleteUser,
  UserService,
  getEasterEggsFound,
  incrementEasterEggsFound,
};
