const API_URL = "http://localhost:8080/api/faqs";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// --- Student Methods ---

export const getMyQuestions = async () => {
  try {
    const response = await fetch(`${API_URL}/my-questions`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching my questions: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to get my questions:", error);
    return [];
  }
};

export const getAllPublishedFAQs = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching published FAQs: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to get published FAQs:", error);
    return [];
  }
};

export const askQuestion = async (questionText) => {
  try {
    const response = await fetch(`${API_URL}/ask`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ question: questionText })
    });

    if (!response.ok) {
      throw new Error(`Error asking question: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to ask question:", error);
    throw error;
  }
};

// --- Admin Methods ---

export const getAdminAllFAQs = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/all`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching all FAQs for admin: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to get admin FAQs:", error);
    return [];
  }
};

export const answerQuestion = async (id, answerText, publish = true) => {
  try {
    const response = await fetch(`${API_URL}/admin/answer/${id}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        answer: answerText,
        publish: publish
      })
    });

    if (!response.ok) {
      throw new Error(`Error answering question: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to answer question:", error);
    throw error;
  }
};

export const deleteQuestion = async (id) => {
  try {
    const response = await fetch(`${API_URL}/admin/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error deleting question: ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to delete question:", error);
    throw error;
  }
};
