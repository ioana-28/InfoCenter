const BASE_URL = `${import.meta.env.VITE_API_Base_URL}/admin/stats`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/students`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to get users:", error);
    throw error;
  }
};

export const deleteUser = async (email) => {
  try {
    // Matches @DeleteMapping("/users/{email}") in AdminStatsController
    const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(email)}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error deleting user: ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};
