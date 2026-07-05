import { createContext, useContext, useState } from "react";
import { loginUser, registerUser } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

 const login = async (formData) => {
  const response = await loginUser(formData);

  const receivedToken = response.data?.token;
  const loggedInUser = response.data?.user;

  if (!receivedToken) {
    throw new Error("Login successful but token was not found.");
  }

  localStorage.setItem("token", receivedToken);
  setToken(receivedToken);
  setUser(loggedInUser);

  return response;
};

  const register = async (formData) => {
    return await registerUser(formData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);