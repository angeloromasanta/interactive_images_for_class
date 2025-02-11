import React, { useState } from 'react';
import Replicate from 'replicate';

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    const replicate = new Replicate({
      auth: import.meta.env.REPLICATE_API_TOKEN,
    });

    const input = {
      size: "1024x1024",
      style: "any",
      prompt: "Design a minimalist, propaganda-style poster encouraging Earth's citizens to \"Join the Asteroid Mining Revolution,\" with bold, geometric illustrations of futuristic mining equipment and a stark, contrasting color palette"
    };

    try {
      const output = await replicate.run("recraft-ai/recraft-v3", { input });
      setImageUrl(output[0]);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Replicate Image Generator</h1>
      <button onClick={generateImage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
}

export default App;
