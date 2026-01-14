const API_URL = "http://localhost:8080/api/admin/requests";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getAllRequests = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching requests: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to get document requests:", error);
    return [];
  }
};

export const approveRequest = async (id, reason) => {
  try {
    let url = `${API_URL}/${id}?status=APPROVED`;
    if (reason) {
      url += `&adminReason=${encodeURIComponent(reason)}`;
    }
    const response = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error approving request (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to approve request:", error);
    throw error;
  }
};

export const rejectRequest = async (id, reason) => {
  try {
    const response = await fetch(`${API_URL}/${id}?status=REJECTED&adminReason=${encodeURIComponent(reason)}`, {
      method: "PUT",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error rejecting request: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to reject request:", error);
    throw error;
  }
};

export const deleteRequest = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error deleting request (${response.status}): ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to delete request:", error);
    throw error;
  }
};
