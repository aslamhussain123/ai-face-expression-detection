// import * as React from 'react';
// import { Box, Button, Typography, CircularProgress } from '@mui/material';
// import * as blazeface from '@tensorflow-models/blazeface';
// import '@tensorflow/tfjs';

// export default function Home() {
//   const videoRef = React.useRef<HTMLVideoElement>(null);
//   const canvasRef = React.useRef<HTMLCanvasElement>(null);
//   const [model, setModel] = React.useState<blazeface.BlazeFaceModel | null>(null);
//   const [loading, setLoading] = React.useState(true);
//   const [faceCount, setFaceCount] = React.useState(0);

//   // Load the BlazeFace model
//   React.useEffect(() => {
//     async function loadModel() {
//       const loadedModel = await blazeface.load();
//       setModel(loadedModel);
//       setLoading(false);
//     }
//     loadModel();
//   }, []);

//   // Start the webcam
//   const startVideo = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//       videoRef.current.play();
//     }
//   };

//   // Run face detection loop
//   const detectFaces = async () => {
//     if (!model || !videoRef.current || !canvasRef.current) return;

//     const ctx = canvasRef.current.getContext('2d');
//     if (!ctx) return;

//     const predictions = await model.estimateFaces(videoRef.current, false);
//     setFaceCount(predictions.length);

//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//     predictions.forEach((p) => {
//       const [x, y, width, height] = [
//         p.topLeft[0],
//         p.topLeft[1],
//         p.bottomRight[0] - p.topLeft[0],
//         p.bottomRight[1] - p.topLeft[1],
//       ];
//       ctx.beginPath();
//       ctx.rect(x, y, width, height);
//       ctx.lineWidth = 3;
//       ctx.strokeStyle = 'lime';
//       ctx.stroke();
//     });

//     requestAnimationFrame(detectFaces);
//   };

//   // Wait for video metadata (to fix invalid texture size)
//   React.useEffect(() => {
//     if (!model) return;

//     const start = async () => {
//       await startVideo();

//       if (videoRef.current) {
//         await new Promise<void>((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             if (canvasRef.current && videoRef.current) {
//               canvasRef.current.width = videoRef.current.videoWidth;
//               canvasRef.current.height = videoRef.current.videoHeight;
//             }
//             resolve();
//           };
//         });
//       }

//       detectFaces();
//     };

//     start();
//   }, [model]);

//   return (
//     <Box textAlign="center" sx={{ mt: 5 }}>
//       <Typography variant="h4" gutterBottom>
//         Next.js Face Detection
//       </Typography>

//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <Box sx={{ position: 'relative', display: 'inline-block' }}>
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             style={{ borderRadius: 8 }}
//           />
//           <canvas
//             ref={canvasRef}
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//             }}
//           />
//         </Box>
//       )}

//       <Box mt={2}>
//         <Button variant="contained" onClick={startVideo}>
//           Restart Camera
//         </Button>
//       </Box>

//       <Typography variant="h6" sx={{ mt: 2, color: 'green' }}>
//         {faceCount === 0
//           ? 'No faces detected'
//           : faceCount === 1
//           ? '1 face detected'
//           : `${faceCount} faces detected`}
//       </Typography>
//     </Box>
//   );
// }




/// ====================== working =====================///////////

// import * as React from 'react';
// import { Box, Button, Typography, CircularProgress } from '@mui/material';
// import * as faceapi from 'face-api.js';

// export default function Home() {
//   const videoRef = React.useRef<HTMLVideoElement>(null);
//   const canvasRef = React.useRef<HTMLCanvasElement>(null);
//   const [loading, setLoading] = React.useState(true);
//   const [faceCount, setFaceCount] = React.useState(0);
//   const [emotions, setEmotions] = React.useState<Record<string, number>>({});

//   // Load all face-api.js models
//   React.useEffect(() => {
//     async function loadModels() {
//       const MODEL_URL = '/models';
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//         faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
//       ]);
//       setLoading(false);
//     }
//     loadModels();
//   }, []);

//   // Start webcam
//   const startVideo = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//       videoRef.current.play();
//     }
//   };

//   // Detect faces and emotions
//   const detectFaces = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const displaySize = {
//       width: videoRef.current.videoWidth,
//       height: videoRef.current.videoHeight,
//     };

//     faceapi.matchDimensions(canvasRef.current, displaySize);

//     const detections = await faceapi
//       .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//       .withFaceExpressions();

//     setFaceCount(detections.length);

//     const resizedDetections = faceapi.resizeResults(detections, displaySize);

//     const ctx = canvasRef.current.getContext('2d');
//     if (!ctx) return;
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//     const emotionStats: Record<string, number> = {};

//     resizedDetections.forEach((det) => {
//       const { x, y, width, height } = det.detection.box;
//       const expressions = det.expressions;
//       const bestEmotion = Object.keys(expressions).reduce((a, b) =>
//         expressions[a] > expressions[b] ? a : b
//       );

//       ctx.beginPath();
//       ctx.rect(x, y, width, height);
//       ctx.lineWidth = 3;
//       ctx.strokeStyle = 'lime';
//       ctx.stroke();
//       ctx.fillStyle = 'lime';
//       ctx.font = '16px Arial';
//       ctx.fillText(bestEmotion, x + 5, y - 10);

//       emotionStats[bestEmotion] = (emotionStats[bestEmotion] || 0) + 1;
//     });

//     setEmotions(emotionStats);

//     requestAnimationFrame(detectFaces);
//   };

//   // Wait for video to load metadata
//   React.useEffect(() => {
//     const start = async () => {
//       await startVideo();
//       if (videoRef.current) {
//         await new Promise<void>((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             if (canvasRef.current && videoRef.current) {
//               canvasRef.current.width = videoRef.current.videoWidth;
//               canvasRef.current.height = videoRef.current.videoHeight;
//             }
//             resolve();
//           };
//         });
//       }
//       detectFaces();
//     };
//     if (!loading) start();
//   }, [loading]);

//   return (
//     <Box textAlign="center" sx={{ mt: 5 }}>
//       <Typography variant="h4" gutterBottom>
//         Next.js Face & Emotion Detection
//       </Typography>

//       {loading ? (
//         <CircularProgress />
//       ) : (
//         <Box sx={{ position: 'relative', display: 'inline-block' }}>
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             style={{ borderRadius: 8 }}
//           />
//           <canvas
//             ref={canvasRef}
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//             }}
//           />
//         </Box>
//       )}

//       <Box mt={2}>
//         <Button variant="contained" onClick={startVideo}>
//           Restart Camera
//         </Button>
//       </Box>

//       <Typography variant="h6" sx={{ mt: 2, color: 'green' }}>
//         {faceCount === 0
//           ? 'No faces detected'
//           : faceCount === 1
//           ? '1 face detected'
//           : `${faceCount} faces detected`}
//       </Typography>

//       {Object.keys(emotions).length > 0 && (
//         <Box mt={2}>
//           <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
//             Detected Emotions:
//           </Typography>
//           {Object.entries(emotions).map(([emo, count]) => (
//             <Typography key={emo} sx={{ textTransform: 'capitalize' }}>
//               {emo}: {count}
//             </Typography>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// }








// import * as React from 'react';
// import { Box, Button, Typography, CircularProgress, Grid, Paper } from '@mui/material';
// import * as faceapi from 'face-api.js';

// export default function Home() {
//   const videoRef = React.useRef<HTMLVideoElement>(null);
//   const canvasRef = React.useRef<HTMLCanvasElement>(null);
//   const [loading, setLoading] = React.useState(true);
//   const [faceCount, setFaceCount] = React.useState(0);
//   const [emotions, setEmotions] = React.useState<Record<string, number>>({});

//   // Load models
//   React.useEffect(() => {
//     async function loadModels() {
//       const MODEL_URL = '/models';
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//         faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
//       ]);
//       setLoading(false);
//     }
//     loadModels();
//   }, []);

//   // Start webcam
//   const startVideo = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//       videoRef.current.play();
//     }
//   };

//   // Detect faces & emotions
//   const detectFaces = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const displaySize = {
//       width: videoRef.current.videoWidth,
//       height: videoRef.current.videoHeight,
//     };

//     faceapi.matchDimensions(canvasRef.current, displaySize);

//     const detections = await faceapi
//       .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//       .withFaceExpressions();

//     setFaceCount(detections.length);

//     const resized = faceapi.resizeResults(detections, displaySize);
//     const ctx = canvasRef.current.getContext('2d');
//     if (!ctx) return;
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//     const emotionStats: Record<string, number> = {};

//     resized.forEach((det) => {
//       const { x, y, width, height } = det.detection.box;
//       const expressions = det.expressions;
//       const bestEmotion = Object.keys(expressions).reduce((a, b) =>
//         expressions[a] > expressions[b] ? a : b
//       );

//       ctx.beginPath();
//       ctx.rect(x, y, width, height);
//       ctx.lineWidth = 3;
//       ctx.strokeStyle = 'lime';
//       ctx.stroke();
//       ctx.fillStyle = 'lime';
//       ctx.font = '16px Arial';
//       ctx.fillText(bestEmotion, x + 5, y - 10);

//       emotionStats[bestEmotion] = (emotionStats[bestEmotion] || 0) + 1;
//     });

//     setEmotions(emotionStats);
//     requestAnimationFrame(detectFaces);
//   };

//   // Wait for video to load metadata
//   React.useEffect(() => {
//     const start = async () => {
//       await startVideo();
//       if (videoRef.current) {
//         await new Promise<void>((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             if (canvasRef.current && videoRef.current) {
//               canvasRef.current.width = videoRef.current.videoWidth;
//               canvasRef.current.height = videoRef.current.videoHeight;
//             }
//             resolve();
//           };
//         });
//       }
//       detectFaces();
//     };
//     if (!loading) start();
//   }, [loading]);

//   return (
//     <Box sx={{ mt: 4, px: 4 }}>
//       <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
//         Next.js Face & Emotion Detection
//       </Typography>

//       {loading ? (
//         <Box textAlign="center" mt={6}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Grid container spacing={4} justifyContent="center">
//           {/* Left: Camera Feed */}
//           <Grid item xs={12} md={7}>
//             <Box sx={{ position: 'relative', display: 'inline-block' }}>
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 muted
//                 playsInline
//                 style={{ borderRadius: 8, width: '100%', maxWidth: '640px' }}
//               />
//               <canvas
//                 ref={canvasRef}
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   width: '100%',
//                   height: '100%',
//                 }}
//               />
//             </Box>

//             <Box textAlign="center" mt={2}>
//               <Button variant="contained" onClick={startVideo}>
//                 Restart Camera
//               </Button>

//               <Typography variant="h6" sx={{ mt: 2, color: 'green' }}>
//                 {faceCount === 0
//                   ? 'No faces detected'
//                   : faceCount === 1
//                   ? '1 face detected'
//                   : `${faceCount} faces detected`}
//               </Typography>
//             </Box>
//           </Grid>

//           {/* Right: Emotions Panel */}
//           <Grid item xs={12} md={4}>
//             <Paper
//               elevation={3}
//               sx={{
//                 p: 3,
//                 borderRadius: 3,
//                 background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
//               }}
//             >
//               <Typography variant="h6" gutterBottom fontWeight={600}>
//                 Detected Emotions
//               </Typography>

//               {Object.keys(emotions).length === 0 ? (
//                 <Typography color="text.secondary">No emotions detected</Typography>
//               ) : (
//                 <Box>
//                   {Object.entries(emotions).map(([emo, count]) => (
//                     <Box
//                       key={emo}
//                       sx={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         py: 0.5,
//                         px: 1,
//                         borderRadius: 1,
//                         '&:hover': { backgroundColor: '#f1f3f5' },
//                       }}
//                     >
//                       <Typography sx={{ textTransform: 'capitalize' }}>{emo}</Typography>
//                       <Typography fontWeight={600}>{count}</Typography>
//                     </Box>
//                   ))}
//                 </Box>
//               )}
//             </Paper>
//           </Grid>
//         </Grid>
//       )}
//     </Box>
//   );
// }






// 'use client';
// import * as React from 'react';
// import { Box, Button, Typography, CircularProgress, Grid } from '@mui/material';
// import * as faceapi from 'face-api.js';

// export default function Home() {
//   const videoRef = React.useRef<HTMLVideoElement>(null);
//   const canvasRef = React.useRef<HTMLCanvasElement>(null);
//   const [loading, setLoading] = React.useState(true);
//   const [faceCount, setFaceCount] = React.useState(0);
//   const [emotions, setEmotions] = React.useState<Record<string, number>>({});
//   const [maskLoaded, setMaskLoaded] = React.useState(false);
//   const maskImgRef = React.useRef<HTMLImageElement | null>(null);

//   React.useEffect(() => {
//     async function loadModels() {
//       const MODEL_URL = '/models';
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//         faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
//       ]);
//       setLoading(false);
//     }
//     loadModels();

//     // Load mask image safely
//     const img = new Image();
//     img.src = '/mask.png';
//     img.onload = () => setMaskLoaded(true);
//     img.onerror = () => console.warn('⚠️ Failed to load mask image from /mask.png');
//     maskImgRef.current = img;
//   }, []);

//   const startVideo = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//       videoRef.current.play();
//     }
//   };

//   const detectFaces = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const displaySize = {
//       width: videoRef.current.videoWidth,
//       height: videoRef.current.videoHeight,
//     };

//     faceapi.matchDimensions(canvasRef.current, displaySize);

//     const detections = await faceapi
//       .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
//       .withFaceExpressions();

//     setFaceCount(detections.length);
//     const resizedDetections = faceapi.resizeResults(detections, displaySize);

//     const ctx = canvasRef.current.getContext('2d');
//     if (!ctx) return;
//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

//     const emotionStats: Record<string, number> = {};

//     resizedDetections.forEach((det) => {
//       const { x, y, width, height } = det.detection.box;
//       const expressions = det.expressions;
//       const bestEmotion = Object.keys(expressions).reduce((a, b) =>
//         expressions[a] > expressions[b] ? a : b
//       );

//       // Draw bounding box
//       ctx.beginPath();
//       ctx.rect(x, y, width, height);
//       ctx.lineWidth = 3;
//       ctx.strokeStyle = 'lime';
//       ctx.stroke();

//       // Draw emotion label
//       ctx.fillStyle = 'lime';
//       ctx.font = '16px Arial';
//       ctx.fillText(bestEmotion, x + 5, y - 10);

//       // 🟩 Draw mask overlay (safe)
//       if (maskLoaded && maskImgRef.current) {
//         const maskHeight = height * 0.6;
//         ctx.drawImage(maskImgRef.current, x, y + height * 0.4, width, maskHeight);
//       } else {
//         ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
//         ctx.fillRect(x, y + height * 0.4, width, height * 0.6);
//       }

//       emotionStats[bestEmotion] = (emotionStats[bestEmotion] || 0) + 1;
//     });

//     setEmotions(emotionStats);
//     requestAnimationFrame(detectFaces);
//   };

//   React.useEffect(() => {
//     const start = async () => {
//       await startVideo();
//       if (videoRef.current) {
//         await new Promise<void>((resolve) => {
//           videoRef.current.onloadedmetadata = () => {
//             if (canvasRef.current && videoRef.current) {
//               canvasRef.current.width = videoRef.current.videoWidth;
//               canvasRef.current.height = videoRef.current.videoHeight;
//             }
//             resolve();
//           };
//         });
//       }
//       detectFaces();
//     };
//     if (!loading) start();
//   }, [loading]);

//   return (
//     <Grid container spacing={4} sx={{ mt: 5, px: 4 }}>
//       {/* LEFT SIDE */}
//       <Grid item xs={12} md={7} sx={{ textAlign: 'center' }}>
//         <Typography variant="h5" gutterBottom>
//           Face & Emotion Detection
//         </Typography>

//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <Box sx={{ position: 'relative', display: 'inline-block' }}>
//             <video
//               ref={videoRef}
//               autoPlay
//               muted
//               playsInline
//               style={{ borderRadius: 8, width: '100%' }}
//             />
//             <canvas
//               ref={canvasRef}
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//               }}
//             />
//           </Box>
//         )}

//         <Box mt={2}>
//           <Button variant="contained" onClick={startVideo}>
//             Restart Camera
//           </Button>
//         </Box>

//         <Typography variant="h6" sx={{ mt: 2, color: 'green' }}>
//           {faceCount === 0
//             ? 'No faces detected'
//             : faceCount === 1
//             ? '1 face detected'
//             : `${faceCount} faces detected`}
//         </Typography>
//       </Grid>

//       {/* RIGHT SIDE */}
//       <Grid
//         item
//         xs={12}
//         md={5}
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//         }}
//       >
//         <Typography variant="h6" gutterBottom>
//           Detected Emotions
//         </Typography>
//         {Object.keys(emotions).length > 0 ? (
//           Object.entries(emotions).map(([emo, count]) => (
//             <Typography
//               key={emo}
//               sx={{
//                 textTransform: 'capitalize',
//                 mb: 1,
//                 fontSize: '1.1rem',
//                 color: 'primary.main',
//               }}
//             >
//               {emo}: {count}
//             </Typography>
//           ))
//         ) : (
//           <Typography color="text.secondary">No emotions detected yet.</Typography>
//         )}
//       </Grid>
//     </Grid>
//   );
// }



import * as React from 'react';
import { Box, Button, Typography, CircularProgress, Grid, Paper, Card, Chip, Switch, FormControlLabel } from '@mui/material';
import * as faceapi from 'face-api.js';

export default function Home() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = React.useState(true);
  const [faceCount, setFaceCount] = React.useState(0);
  const [emotions, setEmotions] = React.useState<Record<string, number>>({});
  const [showMask, setShowMask] = React.useState(true);

  // Load models
  React.useEffect(() => {
    async function loadModels() {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      setLoading(false);
    }
    loadModels();
  }, []);

  // Start webcam
  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  };

  // Draw stylish mask overlay
  const drawMaskOverlay = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.save();
    
    // Create gradient for mask
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, 'rgba(74, 144, 226, 0.4)');
    gradient.addColorStop(1, 'rgba(106, 76, 147, 0.4)');
    
    // Draw mask background
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    // Draw mask border with glow effect
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#4a90e2';
    ctx.shadowBlur = 10;
    ctx.strokeRect(x, y, width, height);
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Draw corner accents
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    const cornerSize = 15;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(x, y + cornerSize);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cornerSize, y);
    ctx.stroke();
    
    // Top-right corner
    ctx.beginPath();
    ctx.moveTo(x + width - cornerSize, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + cornerSize);
    ctx.stroke();
    
    // Bottom-left corner
    ctx.beginPath();
    ctx.moveTo(x, y + height - cornerSize);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + cornerSize, y + height);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(x + width - cornerSize, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y + height - cornerSize);
    ctx.stroke();
    
    ctx.restore();
  };

  // Detect faces & emotions
  const detectFaces = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    };

    faceapi.matchDimensions(canvasRef.current, displaySize);

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    setFaceCount(detections.length);

    const resized = faceapi.resizeResults(detections, displaySize);
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    const emotionStats: Record<string, number> = {};

    resized.forEach((det) => {
      const { x, y, width, height } = det.detection.box;
      const expressions = det.expressions;
      const bestEmotion = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
      );

      // Draw mask overlay if enabled
      if (showMask) {
        drawMaskOverlay(ctx, x, y, width, height);
      }

      // Draw face bounding box
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Draw emotion label with modern styling
      const text = `${bestEmotion} (${(expressions[bestEmotion] * 100).toFixed(1)}%)`;
      const textWidth = ctx.measureText(text).width;
      
      // Background for text
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(x - 5, y - 35, textWidth + 10, 25);
      
      // Text
      ctx.fillStyle = '#00ff88';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(text, x, y - 15);

      emotionStats[bestEmotion] = (emotionStats[bestEmotion] || 0) + 1;
    });

    setEmotions(emotionStats);
    requestAnimationFrame(detectFaces);
  };

  // Wait for video to load metadata
  React.useEffect(() => {
    const start = async () => {
      await startVideo();
      if (videoRef.current) {
        await new Promise<void>((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            if (canvasRef.current && videoRef.current) {
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;
            }
            resolve();
          };
        });
      }
      detectFaces();
    };
    if (!loading) start();
  }, [loading]);

  const emotionColors = {
    happy: '#4CAF50',
    sad: '#2196F3',
    angry: '#F44336',
    fearful: '#9C27B0',
    disgusted: '#795548',
    surprised: '#FF9800',
    neutral: '#607D8B'
  };

  const emotionIcons = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fearful: '😨',
    disgusted: '🤢',
    surprised: '😲',
    neutral: '😐'
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
      px: 2
    }}>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom 
          fontWeight={700}
          sx={{ 
            color: 'white',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          AI Face & Emotion Detection
        </Typography>

        {loading ? (
          <Box textAlign="center" mt={6}>
            <CircularProgress size={60} sx={{ color: 'white' }} />
            <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>
              Loading AI Models...
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {/* Left: Camera Feed */}
            <Grid item xs={12} lg={7}>
              <Card sx={{ 
                borderRadius: 3, 
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}>
                <Box sx={{ p: 3, pb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Live Camera Feed
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showMask}
                          onChange={(e) => setShowMask(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Mask Overlay"
                    />
                  </Box>
                  
                  <Box sx={{ 
                    position: 'relative', 
                    display: 'inline-block',
                    borderRadius: 2,
                    overflow: 'hidden',
                    width: '100%'
                  }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{ 
                        width: '100%', 
                        height: 'auto',
                        display: 'block',
                        maxWidth: '100%'
                      }}
                    />
                    <canvas
                      ref={canvasRef}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 2,
                    p: 2,
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                    borderRadius: 2
                  }}>
                    <Button 
                      variant="contained" 
                      onClick={startVideo}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontWeight: 600
                      }}
                    >
                      🔄 Restart Camera
                    </Button>

                    <Chip
                      label={
                        faceCount === 0
                          ? 'No faces detected'
                          : faceCount === 1
                          ? '1 face detected'
                          : `${faceCount} faces detected`
                      }
                      color={faceCount > 0 ? "success" : "default"}
                      variant="filled"
                      sx={{ 
                        fontWeight: 600,
                        fontSize: '1rem',
                        px: 2
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>

            {/* Right: Enhanced Emotions Panel */}
            <Grid item xs={12} lg={5}>
              <Card sx={{ 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                height: 'fit-content'
              }}>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom fontWeight={700} sx={{ color: '#333' }}>
                    Emotion Analysis
                  </Typography>
                  
                  {Object.keys(emotions).length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 6,
                      color: 'text.secondary'
                    }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No emotions detected
                      </Typography>
                      <Typography variant="body2">
                        Faces will appear here when detected
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2 }}>
                      {Object.entries(emotions).map(([emotion, count]) => (
                        <Box
                          key={emotion}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2.5,
                            mb: 2,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${emotionColors[emotion] || '#9e9e9e'}15, ${emotionColors[emotion] || '#9e9e9e'}08)`,
                            border: `2px solid ${emotionColors[emotion] || '#9e9e9e'}20`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                              border: `2px solid ${emotionColors[emotion] || '#9e9e9e'}40`,
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: emotionColors[emotion] || '#9e9e9e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 2,
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                              }}
                            >
                              {emotionIcons[emotion] || '😊'}
                            </Box>
                            <Box>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  textTransform: 'capitalize',
                                  fontWeight: 600,
                                  color: '#333',
                                  mb: 0.5
                                }}
                              >
                                {emotion}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: 'text.secondary',
                                  fontSize: '0.875rem'
                                }}
                              >
                                Detected {count} time{count > 1 ? 's' : ''}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box
                            sx={{
                              background: emotionColors[emotion] || '#9e9e9e',
                              color: 'white',
                              borderRadius: '50%',
                              width: 40,
                              height: 40,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '1.1rem',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}
                          >
                            {count}
                          </Box>
                        </Box>
                      ))}
                      
                      {/* Summary Card */}
                      <Paper
                        sx={{
                          p: 2,
                          mt: 3,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderRadius: 2,
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h6" fontWeight={600}>
                          Total Emotions Detected
                        </Typography>
                        <Typography variant="h4" fontWeight={700}>
                          {Object.values(emotions).reduce((sum, count) => sum + count, 0)}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Across {Object.keys(emotions).length} different emotions
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}