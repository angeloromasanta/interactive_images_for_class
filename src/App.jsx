import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });
  
      const result = await response.json();
      if (result.output) {
        setImage(result.output[0]);
      }
      setLoading(false);
  
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Image Generator</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          style={{ width: '100%', padding: '10px' }}
        />
        <button
          onClick={generateImage}
          disabled={loading || !prompt}
          style={{ marginTop: '10px', padding: '10px 20px' }}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
      
      {loading && <p>Generating image...</p>}
      
      {image && (
        <div>
          <img src={image} alt="Generated" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
}

export default App;
