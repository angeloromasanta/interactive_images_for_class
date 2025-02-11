// api/generate.js
export default async function handler(request, response) {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
  
  if (!REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN is not defined');
  }

  try {
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "c12ea729388c18b67fef009106f85d42e167fd0d14f0dc6c70e28e268b837137",
        input: {
          size: "1024x1024",
          style: "any",
          prompt: request.body.prompt
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    response.status(200).json(data);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message });
  }
}
