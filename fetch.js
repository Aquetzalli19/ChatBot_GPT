const API_KEY = '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';
const MODEL_ENGINE = 'text-davinci-003';

import axios from 'axios';

async function generateText(prompt) {
try {
const response = await axios({
method: 'post',
url: `https://api.openai.com/v1/engines/${MODEL_ENGINE}/completions`,
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${API_KEY}`
},
data: {
prompt: prompt,
max_tokens: 1024,
n: 1,
stop: null,
temperature: 0.5
}
});
return response.data.choices[0].text;
} catch (error) {
console.error(error);
}
}

// Usage
const prompt = "hola, como estás";

generateText(prompt).then(output => {
console.log(output);
});