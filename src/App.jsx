import { useState } from 'react'

function App() {
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generateImage = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // First, create the prediction
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
        throw new Error('Failed to generate image');
      }

      const prediction = await response.json()
      console.log('Prediction:', prediction);
      
      // Poll for the result
      const intervalId = setInterval(async () => {
        const response = await fetch(
          `https://api.replicate.com/v1/predictions/${prediction.id}`,
          {
            headers: {
              Authorization: `Token ${import.meta.env.VITE_REPLICATE_API_TOKEN}`,
            },
          }
        )
        const result = await response.json()
        console.log('Result:', result);

        if (result.status === 'succeeded') {
          setImage(result.output[0])
          setLoading(false)
          clearInterval(intervalId)
        } else if (result.status === 'failed') {
          setError('Image generation failed')
          setLoading(false)
          clearInterval(intervalId)
        }
      }, 1000)
    } catch (err) {
      console.error('Error:', err);
      setError(err.message)
      setLoading(false)
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
