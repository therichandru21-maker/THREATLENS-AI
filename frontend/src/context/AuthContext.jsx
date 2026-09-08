import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  login,
  logout,
} from "../services/api";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "cybersentinel_user"
        );

      if (!saved) {
        return null;
      }

      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    });

  const [loading, setLoading] =
    useState(
      Boolean(
        localStorage.getItem(
          "cybersentinel_token"
        )
      )
    );


  useEffect(() => {
    const token =
      localStorage.getItem(
        "cybersentinel_token"
      );

    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);

        localStorage.setItem(
          "cybersentinel_user",
          JSON.stringify(currentUser)
        );
      })
      .catch(() => {
        logout();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  function setAuthenticatedUser(
    userData
  ) {
    setUser(userData);

    localStorage.setItem(
      "cybersentinel_user",
      JSON.stringify(userData)
    );
  }


  async function signIn(
    username,
    password
  ) {
    const data = await login(
      username,
      password
    );

    setAuthenticatedUser(
      data.user
    );

    return data;
  }


  function signOut() {
    logout();
    setUser(null);
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        setAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}