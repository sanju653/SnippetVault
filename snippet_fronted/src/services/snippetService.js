import api from "./api";

export const getAllSnippets = async () => {
  const response = await api.get("/snippets");
  return response.data;
};

export const getSnippetById = async (snippetId) => {
  const response = await api.get(`/snippets/${snippetId}`);
  return response.data;
};

export const createSnippet = async (snippetData) => {
  const response = await api.post("/snippets", snippetData);
  return response.data;
};

export const updateSnippet = async (snippetId, snippetData) => {
  const response = await api.put(`/snippets/${snippetId}`, snippetData);
  return response.data;
};

export const deleteSnippet = async (snippetId) => {
  const response = await api.delete(`/snippets/${snippetId}`);
  return response.data;
};

export const searchSnippets = async (filters) => {
  const response = await api.get("/snippets/search", {
    params: filters,
  });

  return response.data;
};

export const regenerateAiContent = async (snippetId) => {
  const response = await api.post(`/snippets/${snippetId}/generate-ai`);
  return response.data;
};
export const explainCode = async (snippetId) => {
   const response = await api.post(`/snippets/${snippetId}/explain`);
    return response.data;
   };