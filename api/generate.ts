// api/generate.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    
    if (!REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_TOKEN is not defined');
    }

    // Create prediction
    const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "c12ea729388c18b67fef009106f85d42e167fd0d14f0dc6c70e28e268b837137",
        input: {
          prompt: request.body.prompt,
          size: "1024x1024",
          style: "any",
        },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.detail || 'Failed to create prediction');
    }

    const prediction = await createResponse.json();
    
    // Poll for the result
    let result;
    for (let i = 0; i < 30; i++) { // Maximum 30 attempts (30 seconds)
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_TOKEN}`,
          },
        }
      );
      
      if (!pollResponse.ok) {
        throw new Error('Failed to poll prediction');
      }
      
      result = await pollResponse.json();
      
      if (result.status === 'succeeded') {
        return response.status(200).json(result);
      } else if (result.status === 'failed') {
        throw new Error('Image generation failed');
      }
      
      // Wait 1 second before next poll
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error('Timeout waiting for image generation');
    
  } catch (error) {
    console.error('Error:', error);
    return response.status(500).json({ error: error.message });
  }
}