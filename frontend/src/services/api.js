const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";


async function request(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem(
      "cybersentinel_token"
    );

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : {
          "Content-Type":
            "application/json",
        }),
    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),
    ...(options.headers || {}),
  };


  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  } catch {
    throw new Error(
      "Unable to connect to CyberSentinel backend."
    );
  }


  const contentType =
    response.headers.get(
      "content-type"
    ) || "";


  const data =
    contentType.includes(
      "application/json"
    )
      ? await response.json()
      : null;


  if (
    response.status === 401
  ) {
    localStorage.removeItem(
      "cybersentinel_token"
    );

    localStorage.removeItem(
      "cybersentinel_user"
    );
  }


  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Request failed with status ${response.status}`
    );
  }


  return data;
}


// Authentication

export async function login(
  username,
  password
) {
  const body =
    new URLSearchParams();

  body.append(
    "username",
    username
  );

  body.append(
    "password",
    password
  );


  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body,
      }
    );
  } catch {
    throw new Error(
      "Unable to connect to CyberSentinel backend."
    );
  }


  const data =
    await response.json();


  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Login failed."
    );
  }


  localStorage.setItem(
    "cybersentinel_token",
    data.access_token
  );

  localStorage.setItem(
    "cybersentinel_user",
    JSON.stringify(data.user)
  );


  return data;
}


export async function register(
  username,
  email,
  password
) {
  return request(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    }
  );
}


export async function getCurrentUser() {
  return request("/auth/me");
}


export function logout() {
  localStorage.removeItem(
    "cybersentinel_token"
  );

  localStorage.removeItem(
    "cybersentinel_user"
  );
}


// Incidents

export async function getIncidents() {
  return request(
    "/incidents/"
  );
}


export async function getIncident(id) {
  return request(
    `/incidents/${id}`
  );
}


export async function createIncident(
  data
) {
  return request(
    "/incidents/",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}


export async function analyzeIncident(
  id
) {
  return request(
    `/incidents/${id}/analyze`,
    {
      method: "POST",
    }
  );
}


export async function runAgent(id) {
  return request(
    `/incidents/${id}/agent-run`,
    {
      method: "POST",
    }
  );
}


export async function updateIncident(
  id,
  data
) {
  return request(
    `/incidents/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}


export async function deleteIncident(
  id
) {
  return request(
    `/incidents/${id}`,
    {
      method: "DELETE",
    }
  );
}


// Analytics

export async function getAnalytics() {
  return request(
    "/analytics/summary"
  );
}


export function isAuthenticated() {
  return Boolean(
    localStorage.getItem(
      "cybersentinel_token"
    )
  );
}