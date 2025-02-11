// src/app.jsx
import { useState } from 'react'

function App() {
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateImage = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Design a minimalist, propaganda-style poster encouraging Earth's citizens to Join the Asteroid Mining Revolution"
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const result = await response.json();
      
      if (result.output && result.output[0]) {
        setImage(result.output[0]);
      } else {
        throw new Error('No image generated');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App" style={{ padding: '20px' }}>
      <button 
        onClick={generateImage} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}
      
      {image && (
        <div style={{ marginTop: '20px' }}>
          <img 
            src={image} 
            alt="Generated image" 
            style={{ maxWidth: '100%', borderRadius: '8px' }} 
          />
        </div>
      )}
    </div>
  )
}

export default App