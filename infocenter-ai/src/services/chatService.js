const API_URL = "http://localhost:8080/api/chat";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// --- Conversation Management ---

export const getUserConversations = async () => {
  try {
    const response = await fetch(`${API_URL}/conversations`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Failed to fetch conversations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

export const createConversation = async (title = "New Conversation") => {
  try {
    const response = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ title })
    });
    if (!response.ok) throw new Error("Failed to create conversation");
    return await response.json();
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

export const getConversationMessages = async (conversationId) => {
  try {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Failed to fetch messages");
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const deleteConversation = async (conversationId) => {
  try {
    const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Failed to delete conversation");
    return true;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
};

export const renameConversation = async (conversationId, newTitle) => {
  try {
    // Assuming PUT /conversations/{id} updates the conversation
    // Adjust endpoint if backend differs (e.g. /conversations/{id}/title)
    const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ title: newTitle })
    });
    if (!response.ok) throw new Error("Failed to rename conversation");
    return await response.json();
  } catch (error) {
    console.error("Error renaming conversation:", error);
    throw error;
  }
};

export const getConversationsByUserId = async (userId) => {
  try {
    // Endpoint to fetch conversations for a specific user (Admin only)
    const response = await fetch(`${API_URL}/admin/users/${userId}/conversations`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Failed to fetch user conversations");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    return [];
  }
};

// --- AI Interaction ---

export const sendMessageToAI = async (message, conversationId) => {
  try {
    const response = await fetch(`${API_URL}/ask-ai`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        message,
        sessionId: conversationId // Sending session ID as requested
      })
    });

    if (!response.ok) {
      throw new Error("Failed to get response from AI");
    }

    return await response.json();
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};
