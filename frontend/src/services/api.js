import axios from "axios";


const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "");


const api = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 30000,
});


// =========================
// ERROR HANDLER
// =========================

function getErrorMessage(error, fallback) {

  if (error?.response?.data?.detail) {

    const detail =
      error.response.data.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map(
          (item) =>
            item?.msg ||
            "Invalid request"
        )
        .join(", ");
    }
  }


  if (error?.code === "ERR_NETWORK") {
    return (
      `Cannot reach ThreatLens AI backend at ${API_BASE_URL}. ` +
      "Make sure FastAPI is running on port 8000."
    );
  }


  if (error?.code === "ECONNABORTED") {
    return (
      "The request timed out. Please try again."
    );
  }


  return (
    error?.message ||
    fallback
  );
}


// =========================
// REQUEST INTERCEPTOR
// =========================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "threatlens_token"
      ) ||
      localStorage.getItem(
        "access_token"
      );


    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }


    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =========================
// RESPONSE INTERCEPTOR
// =========================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      error?.response?.status === 401
    ) {

      localStorage.removeItem(
        "threatlens_token"
      );

      localStorage.removeItem(
        "threatlens_user"
      );

      localStorage.removeItem(
        "access_token"
      );
    }

    return Promise.reject(error);
  }
);


// =========================
// AUTH
// =========================

export const register = async (
  username,
  email,
  password
) => {

  try {

    const response =
      await api.post(
        "/auth/register",
        {
          username,
          email,
          password,
        }
      );

    return response.data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Registration failed."
      )
    );
  }
};


export const login = async (
  username,
  password
) => {

  try {

    const formData =
      new URLSearchParams();

    formData.append(
      "username",
      username
    );

    formData.append(
      "password",
      password
    );


    const response =
      await api.post(
        "/auth/login",
        formData,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );


    const data =
      response.data;


    // Save JWT token
    if (data?.access_token) {

      localStorage.setItem(
        "threatlens_token",
        data.access_token
      );
    }


    // Save logged-in user
    if (data?.user) {

      localStorage.setItem(
        "threatlens_user",
        JSON.stringify(data.user)
      );
    }


    return data;

  } catch (error) {

    throw new Error(
      getErrorMessage(
        error,
        "Unable to sign in."
      )
    );
  }
};


export const logout = () => {

  localStorage.removeItem(
    "threatlens_token"
  );

  localStorage.removeItem(
    "threatlens_user"
  );


  // Old keys cleanup
  localStorage.removeItem(
    "access_token"
  );

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );

  localStorage.removeItem(
    "cybersentinel_token"
  );

  localStorage.removeItem(
    "cybersentinel_user"
  );
};


export const isAuthenticated = () => {

  return Boolean(
    localStorage.getItem(
      "threatlens_token"
    ) ||
    localStorage.getItem(
      "access_token"
    )
  );
};


export const getCurrentUser =
  async () => {

    try {

      const response =
        await api.get(
          "/auth/me"
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to load current user."
        )
      );
    }
  };


// =========================
// INCIDENTS
// =========================

export const getIncidents =
  async () => {

    try {

      const response =
        await api.get(
          "/incidents/"
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to load incidents."
        )
      );
    }
  };


export const getIncident =
  async (incidentId) => {

    try {

      const response =
        await api.get(
          `/incidents/${incidentId}`
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to load incident."
        )
      );
    }
  };


export const createIncident =
  async (incidentData) => {

    try {

      const response =
        await api.post(
          "/incidents/",
          incidentData
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to create incident."
        )
      );
    }
  };


export const updateIncident =
  async (
    incidentId,
    incidentData
  ) => {

    try {

      const response =
        await api.put(
          `/incidents/${incidentId}`,
          incidentData
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to update incident."
        )
      );
    }
  };


export const deleteIncident =
  async (incidentId) => {

    try {

      const response =
        await api.delete(
          `/incidents/${incidentId}`
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Unable to delete incident."
        )
      );
    }
  };


// =========================
// AI ANALYSIS
// =========================

export const analyzeIncident =
  async (incidentId) => {

    try {

      const response =
        await api.post(
          `/incidents/${incidentId}/analyze`
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "AI analysis failed."
        )
      );
    }
  };


// =========================
// AI AGENT
// =========================

export const runAgent =
  async (incidentId) => {

    try {

      const response =
        await api.post(
          `/incidents/${incidentId}/agent-run`
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "AI agent execution failed."
        )
      );
    }
  };


export const runIncidentAgent =
  runAgent;


// =========================
// HEALTH CHECK
// =========================

export const healthCheck =
  async () => {

    try {

      const response =
        await api.get(
          "/health"
        );

      return response.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "Backend health check failed."
        )
      );
    }
  };


export default api;