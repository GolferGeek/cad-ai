'use client';

import { useState } from 'react';
import CadDesignForm from '@/components/CadDesignForm';
import CadViewer from '@/components/CadViewer';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper 
} from '@mui/material';

// Define interface for the design data
interface DesignData {
  success: boolean;
  modelData?: string;
  error?: string;
  raw?: unknown;
}

export default function Home() {
  const [generatedModel, setGeneratedModel] = useState<DesignData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDesignGenerated = (data: DesignData) => {
    setGeneratedModel(data);
    setIsLoading(false);
  };

  const handleSubmitStart = () => {
    setIsLoading(true);
  };

  return (
    <Box component="main" sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            CAD AI Designer
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Generate 3D models from text descriptions using AI
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <CadDesignForm 
              onDesignGenerated={handleDesignGenerated}
              onSubmitStart={handleSubmitStart}
            />
            
            {generatedModel && (
              <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Generated Design Info
                </Typography>
                <Box 
                  component="pre"
                  sx={{ 
                    bgcolor: 'grey.100', 
                    p: 2, 
                    borderRadius: 1, 
                    overflow: 'auto', 
                    maxHeight: 240,
                    fontSize: '0.875rem'
                  }}
                >
                  {generatedModel.modelData}
                </Box>
              </Paper>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'sticky', top: 32 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                3D Viewer
              </Typography>
              <CadViewer 
                modelData={generatedModel?.modelData} 
                isLoading={isLoading} 
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
