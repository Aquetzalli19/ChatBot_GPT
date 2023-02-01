async function generateText(prompt) {
    try {
      const response = await fetch(`https://api.openai.com/v1/engines/${MODEL_ENGINE}/completions`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 1024,
          n: 1,
          stop: null,
          temperature: 0.5
        })
      });
      const data = await response.json();
      return data.choices[0].text;
    } catch (error) {
      console.error(error);
    }
  }
  
  // Usage
  const prompt = received_message.text;