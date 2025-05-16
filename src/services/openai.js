import { getOpenAIKey, OPENAI_MODEL } from '../config';

export async function getChatCompletion(messages) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getOpenAIKey()}`
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: messages,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to get response from OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function searchLandmarks(query) {
  const messages = [
    {
      role: "system",
      content: "You are a knowledgeable Barcelona tour guide. Provide relevant information about landmarks based on user queries. Keep responses concise and informative."
    },
    {
      role: "user",
      content: query
    }
  ];

  return getChatCompletion(messages);
} 