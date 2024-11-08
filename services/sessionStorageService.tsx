const getItem = (key: string) => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(key);
};

const setItem = (key: string, value: string) => {
  if (typeof window === "undefined") return null;
  sessionStorage.setItem(key, value);
};

const removeItem = (key: string) => {
  if (typeof window === "undefined") return null;
  sessionStorage.removeItem(key);
};

const clear = () => {
  if (typeof window === "undefined") return null;
  sessionStorage.clear();
};

const isMember = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("role") === "MEMBER";
};

const isAdmin = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("role") === "ADMIN";
};

const getRole = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("role");
}

const isLoggedIn = () => {
  if (typeof window === "undefined") return null;
  return (
    sessionStorageService.getItem("token") !== null &&
    sessionStorageService.getItem("token") !== undefined
  );
};

export const sessionStorageService = {
  getItem,
  setItem,
  removeItem,
  clear,
  isMember,
  isAdmin,
  isLoggedIn,
  getRole
};
