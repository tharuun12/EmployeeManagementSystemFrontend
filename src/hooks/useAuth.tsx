// hooks/useAuth.js
export default function useAuth() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null; // Or use context
  const isLoggedIn = true;
  const role = user?.roles[0];
  console.log("useAuth - user:", user, "role:", role, "isLoggedIn:", isLoggedIn);
  return { user, role, isLoggedIn };
}
