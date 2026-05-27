const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY;
};

const BASE_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

let cachedModelName = null;

async function getAvailableModel(apiKey) {
  if (cachedModelName) return cachedModelName;
  
  try {
    const response = await fetch(`${BASE_API_URL}?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models) {
      // Prefer gemini-1.5-flash, then gemini-1.5-pro
      const validModel = data.models.find(m => m.name === 'models/gemini-1.5-flash') 
                      || data.models.find(m => m.name === 'models/gemini-1.5-pro')
                      || data.models.find(m => m.supportedGenerationMethods.includes('generateContent') && m.name.includes('gemini-1.5'));
      
      if (validModel) {
        cachedModelName = validModel.name; // usually "models/gemini-1.5-flash"
        return cachedModelName;
      }
    }
    // Fallback to strict standard
    return 'models/gemini-1.5-flash';
  } catch (e) {
    return 'models/gemini-1.5-flash';
  }
}

/**
 * Helper function to call Gemini API
 */
async function callGeminiAPI(systemPrompt, userPrompt) {
  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('Google Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file or Vercel Environment Variables.');
  }

  const modelName = await getAvailableModel(apiKey);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [{
        parts: [{ text: userPrompt }]
      }],
      generationConfig: {
        response_mime_type: "application/json",
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API Error: ${errorData?.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const text = data.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Failed to parse AI response as JSON.');
  }
}

/**
 * Parses raw text from a draft resume into structured JSON.
 */
export async function parseResumeWithAI(rawText) {
  const systemPrompt = `You are an expert Resume Parser. Your task is to take raw, unformatted text extracted from a draft resume document and convert it into a strictly formatted JSON object matching the exact structure requested. 
Extract as much information as possible accurately. If a field is missing in the text, leave it as an empty string.
JSON Structure:
{
  "personalInfo": {
    "fullName": "string",
    "jobTitle": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "summary": "string"
  },
  "experience": [
    { "id": "uuid-string", "company": "string", "title": "string", "startDate": "string", "endDate": "string", "description": "string" }
  ],
  "education": [
    { "id": "uuid-string", "school": "string", "degree": "string", "startDate": "string", "endDate": "string", "description": "string" }
  ],
  "skills": ["string", "string"]
}

Important Rules:
- Generate unique UUID-like strings for the 'id' fields in arrays.
- Keep the description fields detailed, preserving bullet points as plain text or newlines.
- Format dates cleanly (e.g., "Jan 2020", "Present").
`;

  return await callGeminiAPI(systemPrompt, `Here is the raw resume text:\n\n${rawText}`);
}

/**
 * Enhances an existing structured resume based on a user prompt.
 */
export async function enhanceResumeWithAI(currentData, userPrompt) {
  const systemPrompt = `You are an expert Resume Writer and Career Coach AI assistant. 
You will be provided with a user's current resume in JSON format, and a prompt from the user asking you to modify, rewrite, or enhance it.
Your task is to apply the user's instructions to the resume data, and return the ENTIRE updated resume data as a strictly formatted JSON object that matches the exact original structure.

Return ONLY the updated JSON.

JSON Structure:
{
  "personalInfo": {
    "fullName": "string",
    "jobTitle": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "summary": "string"
  },
  "experience": [
    { "id": "string", "company": "string", "title": "string", "startDate": "string", "endDate": "string", "description": "string" }
  ],
  "education": [
    { "id": "string", "school": "string", "degree": "string", "startDate": "string", "endDate": "string", "description": "string" }
  ],
  "skills": ["string", "string"]
}`;

  const prompt = `User Prompt: ${userPrompt}\n\nCurrent Resume JSON:\n${JSON.stringify(currentData, null, 2)}`;
  
  return await callGeminiAPI(systemPrompt, prompt);
}
