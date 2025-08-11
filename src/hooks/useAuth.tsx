import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;

  [key: string]: any;
}

export default function useAuth() {
  const token = localStorage.getItem("token");
  let user = null;
  let isLoggedIn = false;
  let role = null;
  let email = null;
  let userId = null;

  if (token) {
    try {

      const decoded = jwtDecode<JwtPayload>(token);

      role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
      userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      user = { role, email, userId };
      isLoggedIn = true;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  return { user, role, email, userId, isLoggedIn };
}
