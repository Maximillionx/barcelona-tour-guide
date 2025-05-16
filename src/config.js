export const getOpenAIKey = () => {
  const key = process.env.REACT_APP_OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API key not found. Please set REACT_APP_OPENAI_API_KEY in your environment.');
  }
  return key;
};

export const OPENAI_MODEL = 'gpt-3.5-turbo';  // You can change this to gpt-4 if you have access 