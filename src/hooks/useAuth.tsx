export default function useAuth() {
  const userString = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const user = userString ? JSON.parse(userString) : null;
  const isLoggedIn = !!(user && token); // Check if both user and token exist
  const role = user?.roles[0];
  return { user, role, isLoggedIn };
}
