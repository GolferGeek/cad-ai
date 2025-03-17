'use client';

import { useState, FormEvent } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper,
  CircularProgress
} from '@mui/material';

// Define a proper type for the design data
interface DesignData {
  success: boolean;
  modelData?: string;
  error?: string;
  raw?: unknown;
}

interface CadDesignFormProps {
  onDesignGenerated?: (data: DesignData) => void;
  onSubmitStart?: () => void;
}

export default function CadDesignForm({ onDesignGenerated, onSubmitStart }: CadDesignFormProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a description for your CAD design');
      return;
    }

    // Save the current prompt for display
    const currentPrompt = prompt.trim();
    setLastPrompt(currentPrompt);
    
    // Set loading state and clear errors
    setIsLoading(true);
    setError(null);
    setApiKeyMissing(false);
    
    // Notify parent that submission has started
    if (onSubmitStart) {
      onSubmitStart();
    }
    
    try {
      const response = await fetch('/api/cad-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentPrompt }),
      });
      
      const data = await response.json() as DesignData;
      
      if (!response.ok) {
        if (data.error === 'OpenAI API key is not configured') {
          setApiKeyMissing(true);
        } else {
          setError(data.error || 'Failed to generate CAD design');
        }
        return;
      }
      
      // Clear the form after successful submission
      setPrompt('');
      
      // Call the callback function with the generated design data
      if (onDesignGenerated) {
        onDesignGenerated(data);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: '100%' }}>
      {apiKeyMissing && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold">API Key Not Configured</Typography>
          <Typography variant="body2">
            Please add your OpenAI API key to the .env.local file to enable CAD design generation.
          </Typography>
          <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
            <code>OPENAI_API_KEY=your_api_key_here</code>
          </Box>
        </Alert>
      )}
      
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        Generate CAD Design
      </Typography>
      
      {lastPrompt && !error && !isLoading && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Successfully generated design for: <strong>{lastPrompt}</strong>
          </Typography>
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          id="prompt"
          label="Describe your design"
          multiline
          rows={4}
          fullWidth
          placeholder="e.g. A paper airplane with 200mm wingspan, or a simple gear with 12 teeth, 50mm diameter"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          margin="normal"
          required
          sx={{ mb: 2 }}
        />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {!error && !isLoading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Try these example prompts:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => setPrompt("A paper airplane with blue paper and delta wing design")}
              >
                Paper Airplane
              </Button>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => setPrompt("A gear with 16 teeth and 60mm diameter")}
              >
                Gear
              </Button>
              <Button 
                size="small" 
                variant="outlined"
                onClick={() => setPrompt("A cylinder with 30mm diameter and 100mm height")}
              >
                Cylinder
              </Button>
            </Box>
          </Box>
        )}
        
        <Button
          type="submit"
          disabled={isLoading}
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 1 }}
          color="primary"
        >
          {isLoading ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
              Generating Design...
            </>
          ) : 'Generate CAD Design'}
        </Button>
      </Box>
    </Paper>
  );
} 