import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const executeCode = async (code, language, input, sessionId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/code/execute`,
      { code, language, input },
      {
        headers: {
          'X-Session-Id': sessionId
        }
      }
    );
    return response.data.result;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to execute code');
  }
};

export const getLanguages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/code/languages`);
    return response.data.languages;
  } catch (error) {
    throw new Error('Failed to fetch languages');
  }
};