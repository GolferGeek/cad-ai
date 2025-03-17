'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
import { Suspense, useMemo, useEffect } from 'react';
import { Box, CircularProgress, Typography, Paper, Alert } from '@mui/material';
import { ViewInAr } from '@mui/icons-material';
import { ModelRegistry, ModelInfo } from './models';

interface CadViewerProps {
  modelData?: string;
  isLoading?: boolean;
}

// This component parses the modelData and creates a 3D model
function Model({ modelData }: { modelData?: string }) {
  // Parse model data to determine the type of model and extract parameters
  const modelInfo = useMemo(() => {
    if (!modelData) return { type: 'unknown', parameters: {} };
    const info = ModelRegistry.parseModelData(modelData);
    console.log("Model info determined:", info);
    return info;
  }, [modelData]);
  
  // Get the appropriate renderer for this model type
  const renderer = useMemo(() => {
    const r = ModelRegistry.getRenderer(modelInfo.type);
    console.log(`Renderer for ${modelInfo.type}:`, r ? 'found' : 'not found');
    return r;
  }, [modelInfo.type]);
  
  // Debug log when no renderer is found
  useEffect(() => {
    if (!renderer) {
      console.warn(`No renderer found for model type: ${modelInfo.type}`);
    }
  }, [renderer, modelInfo.type]);
  
  // If no renderer is available for this type, return null
  if (!renderer) {
    return null;
  }
  
  // Render the model using the appropriate renderer
  return renderer.render(modelInfo.parameters);
}

// Component for displaying unsupported model types
function UnsupportedModel({ type }: { type: string }) {
  const supportedTypes = useMemo(() => {
    const types = ModelRegistry.getSupportedTypes();
    console.log("Supported model types:", types);
    return types.join(', ');
  }, []);
  
  return (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}
    >
      <Box sx={{ textAlign: 'center', p: 3, maxWidth: '80%' }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body1">
            {type === 'unknown' 
              ? 'Unrecognized model type' 
              : `"${type}" models are not yet supported for 3D rendering`}
          </Typography>
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Currently, only {supportedTypes} models can be visualized in 3D.
        </Typography>
      </Box>
    </Box>
  );
}

export default function CadViewer({ modelData, isLoading = false }: CadViewerProps) {
  // Determine model type and if it's supported
  const modelInfo = useMemo<ModelInfo>(() => {
    if (!modelData) return { type: 'none', parameters: {} };
    const info = ModelRegistry.parseModelData(modelData);
    console.log("CadViewer determined model info:", info);
    return info;
  }, [modelData]);

  // Check if this model type has a renderer
  const hasRenderer = useMemo(() => {
    const hasR = !!ModelRegistry.getRenderer(modelInfo.type);
    console.log(`CadViewer hasRenderer for ${modelInfo.type}: ${hasR}`);
    return hasR;
  }, [modelInfo.type]);

  // Debug current modelData
  useEffect(() => {
    if (modelData) {
      console.log("Current modelData:", modelData);
    }
  }, [modelData]);

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        height: 400, 
        width: '100%', 
        overflow: 'hidden',
        bgcolor: 'grey.100'
      }}
    >
      {isLoading ? (
        <Box 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress 
              size={48} 
              sx={{ mb: 2 }} 
              color="primary" 
            />
            <Typography variant="body1" color="text.secondary">
              Generating CAD model...
            </Typography>
          </Box>
        </Box>
      ) : modelData ? (
        hasRenderer ? (
          <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <Model modelData={modelData} />
              <OrbitControls />
              <Grid infiniteGrid position={[0, -0.5, 0]} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        ) : (
          <UnsupportedModel type={modelInfo.type} />
        )
      ) : (
        <Box 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <ViewInAr
              sx={{ 
                fontSize: 48, 
                mb: 2, 
                color: 'text.disabled'
              }} 
            />
            <Typography variant="body1" color="text.secondary">
              No CAD model to display
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Enter a description to generate a design
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}