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


function readStoredUser() {

  const saved =
    localStorage.getItem(
      "threatlens_user"
    );


  if (!saved) {
    return null;
  }


  try {

    return JSON.parse(saved);

  } catch {

    localStorage.removeItem(
      "threatlens_user"
    );

    return null;
  }
}


export function AuthProvider({
  children,
}) {

  const [user, setUser] =
    useState(readStoredUser);


  const [loading, setLoading] =
    useState(
      Boolean(
        localStorage.getItem(
          "threatlens_token"
        )
      )
    );


  useEffect(() => {

    const token =
      localStorage.getItem(
        "threatlens_token"
      );


    if (!token) {

      setLoading(false);
      return;
    }


    getCurrentUser()

      .then((currentUser) => {

        setUser(currentUser);

        localStorage.setItem(
          "threatlens_user",
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
      "threatlens_user",
      JSON.stringify(userData)
    );
  }


  async function signIn(
    username,
    password
  ) {

    const data =
      await login(
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