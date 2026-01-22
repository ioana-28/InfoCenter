// src/services/driveService.js

const API_URL = `${import.meta.env.VITE_API_Base_URL}/drive`;

// TODO: Replace with the actual Google Drive Folder ID for official documents
const OFFICIAL_DOCS_FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Authorization": `Bearer ${token}`
  };
};

export const listOfficialDocuments = async () => {
  try {
    // We assume the backend expects a 'folderId' parameter
    const response = await fetch(`${API_URL}/list?folderId=${OFFICIAL_DOCS_FOLDER_ID}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error(`Failed to list files: ${response.statusText}`);
    }

    // Expecting List<DriveFileResponse> which should be JSON
    return await response.json();
  } catch (error) {
    console.error("Error listing official documents:", error);
    return [];
  }
};

export const uploadOfficialDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", OFFICIAL_DOCS_FOLDER_ID);

    // Note: The backend endpoint consumes Multipart properties, not JSON
    // We do NOT set Content-Type header manually for FormData, browser does it with boundary
    const token = localStorage.getItem("token");
    
    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
        // do not set Content-Type here
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload file: ${errorText}`);
    }

    // The backend returns a plain string message
    return await response.text();
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};
