// lib/api.ts
import { API_BASE_URL } from "./config";
const getAuthToken = () => {
  // Replace this with your actual token retrieval logic
  return localStorage.getItem("token");
};

// ... (existing functions for registerDonor, registerHospital, login)
export async function registerDonor(data: any) {
  
  const res = await fetch(`${API_BASE_URL}/register/donor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Donor registration failed");
  }

  return res.json();
}


//  New function for hospitals
export async function registerHospital(data: any) {
  const res = await fetch(`${API_BASE_URL}/register/hospital`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      role: "hospital" // so backend knows it's a hospital
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Hospital registration failed");
  }

  return res.json();
}

// Function to handle user login
export async function login(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Login failed");
  }

  // Parse the JSON response from the backend
  const data = await res.json();
  
  // Store the access token in local storage
  // The 'getAuthToken' function you created earlier will now be able to retrieve this.
  localStorage.setItem("token", data.access_token);
  
  // You might also want to store user info
  localStorage.setItem("user_info", JSON.stringify(data.user_info));

  return data;
}


// NEW: Fetch all active blood requests for the logged-in hospital
export async function fetchHospitalRequests() {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const res = await fetch(`${API_BASE_URL}/hospitals/me/dashboard/requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to fetch blood requests");
  }

  return res.json();
}

// NEW: Create a new blood request
export async function createBloodRequest(requestData: { bloodType: string, unitsRequested: number, urgency: string }) {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not found.");
  }
  
  const res = await fetch(`${API_BASE_URL}/hospitals/me/dashboard/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to create new request");
  }

  return res.json();
}

// NEW: Fetch hospital statistics
export async function fetchHospitalStats() {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const res = await fetch(`${API_BASE_URL}/hospitals/me/dashboard/stats`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to fetch hospital stats");
  }

  return res.json();
}

// NEW: Fetch blood inventory
export async function fetchBloodInventory() {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const res = await fetch(`${API_BASE_URL}/hospitals/me/dashboard/inventory`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to fetch inventory");
  }

  return res.json();
}

// NEW: Fetch donor responses
export async function fetchDonorResponses() {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const res = await fetch(`${API_BASE_URL}/hospitals/me/dashboard/donor-responses`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to fetch donor responses");
  }

  return res.json();
}