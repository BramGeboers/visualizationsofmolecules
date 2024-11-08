// LoginService.ts
import { Login, Register } from "@/types/login";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const getStatsLogin = async () => {
  const response = await fetch(
    "https://thingsboard.ucll.cloud:443/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        username: "team19@ucll.cloud",
        password: "groep19",
      }),
    }
  );
  const result = await response.json();
  console.log(response);
  console.log(result);

  sessionStorage.setItem("statisticsToken", result.token);
};

const login = async ({ email, password }: Login) => {
  const data = {
    email: email,
    password: password,
  };

  return await fetch(baseUrl + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return response.text().then((errorMessage) => {
        if (errorMessage.includes("Your account is locked")) {
          throw new Error(
            "Your account is locked. Please contact an administrator."
          );
        } else {
          throw new Error(errorMessage);
        }
      });
    }
  });
};

const register = async ({ username, email, password, role }: Register) => {
  console.log("register service");
  const data = {
    username: username,
    email: email,
    role: role,
    password: password,
  };

  return await fetch(baseUrl + "/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(data),
  });
};

const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("statisticsToken");
  return fetch(baseUrl + "/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
  });
};

const passwordResetRequest = async (email: string) => {
  return await fetch(baseUrl + "/auth/password-reset-request", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({ email }),
  });
};

const passwordReset = async (token: string, newPassword: string) => {
  return await fetch(baseUrl + "/auth/password-reset", {
    method: "POST",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  });
};

const LoginService = {
  login,
  register,
  logout,
  passwordResetRequest,
  passwordReset,
};
export default LoginService;
