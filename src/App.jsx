import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    try {
      setLoading(true);
      setError('');
      setImage('');
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const result = await response.json();
      if (result.output && Array.isArray(result.output) && result.output.length > 0) {
        setImage(result.output[0]);
      } else {
        throw new Error('Invalid response format');
      }
  
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Image Generator</h1>
      
      <div className="space-y-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="w-full p-3 border rounded-lg"
        />
        
        <button
          onClick={generateImage}
          disabled={loading || !prompt}
          className={`w-full p-3 rounded-lg ${
            loading || !prompt 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2">Generating image...</p>
        </div>
      )}
      
      {image && (
        <div className="mt-6">
          <img 
            src={image} 
            alt="Generated" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

export default App;