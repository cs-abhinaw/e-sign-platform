// // components/Canvas.jsx
// import React, { useEffect } from 'react';

// const CANVAS_WIDTH = 800;
// const CANVAS_HEIGHT = 600;

// const Canvas = ({
//   canvasRef, canvasContent, signatures, textElements, selectedElement,
//   handleCanvasClick, handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp
// }) => {
//   const redrawCanvas = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = '#fff';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     if (canvasContent) {
//       if (canvasContent.type === 'image') {
//         const img = new window.Image();
//         img.onload = () => {
//           const { x, y, width, height } = canvasContent.bounds;
//           ctx.drawImage(img, x, y, width, height);
//           drawElements();
//         };
//         img.src = canvasContent.data;
//         return;
//       } else if (canvasContent.type === 'text') {
//         ctx.strokeStyle = '#e9ecef';
//         ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
//         ctx.fillStyle = '#000';
//         ctx.font = '16px Arial';
//         ctx.textAlign = 'left';
//         const lines = canvasContent.data.split('\n');
//         lines.forEach((line, i) => {
//           ctx.fillText(line, 40, 50 + i * 24);
//         });
//       } else if (canvasContent.type === 'pdf') {
//         ctx.fillStyle = "#f8f9fa";
//         ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
//         ctx.strokeStyle = '#dee2e6';
//         ctx.lineWidth = 2;
//         ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
//         ctx.fillStyle = '#6c757d';
//         ctx.font = '24px Arial';
//         ctx.textAlign = 'center';
//         ctx.fillText('PDF Document', canvas.width / 2, 150);
//         ctx.fillText('Preview not available', canvas.width / 2, 200);
//       }
//     }
//     drawElements();
//   };

//   const drawElements = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     textElements.forEach(textEl => {
//       ctx.fillStyle = textEl.color;
//       ctx.font = `${textEl.fontSize}px Arial`;
//       ctx.textAlign = 'left';
//       ctx.fillText(textEl.text, textEl.x, textEl.y);
//       if (selectedElement && selectedElement.element === textEl) {
//         ctx.strokeStyle = '#3b82f6';
//         ctx.lineWidth = 2;
//         ctx.setLineDash([5, 5]);
//         ctx.strokeRect(
//           textEl.x - 5,
//           textEl.y - textEl.height - 5,
//           textEl.width + 10,
//           textEl.height + 10
//         );
//         ctx.setLineDash([]);
//       }
//     });
//     signatures.forEach(sig => {
//       if (sig.data) {
//         const img = new window.Image();
//         img.onload = () => {
//           ctx.drawImage(img, sig.x, sig.y, sig.width, sig.height);
//           if (selectedElement && selectedElement.element === sig) {
//             ctx.strokeStyle = '#3b82f6';
//             ctx.lineWidth = 3;
//             ctx.setLineDash([8, 4]);
//             ctx.strokeRect(sig.x - 3, sig.y - 3, sig.width + 6, sig.height + 6);
//             ctx.setLineDash([]);
//           }
//         };
//         img.src = sig.data;
//       }
//     });
//   };

//   useEffect(() => {
//     redrawCanvas();
//     // eslint-disable-next-line
//   }, [canvasContent, signatures, textElements, selectedElement]);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{ border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff" }}
//       width={CANVAS_WIDTH}
//       height={CANVAS_HEIGHT}
//       onClick={handleCanvasClick}
//       onMouseDown={handleCanvasMouseDown}
//       onMouseMove={handleCanvasMouseMove}
//       onMouseUp={handleCanvasMouseUp}
//       onMouseLeave={handleCanvasMouseUp}
//     />
//   );
// };

// export default Canvas;
// components/Canvas.jsx
import React, { useEffect, useCallback, useState } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const Canvas = ({
  canvasRef, canvasContent, signatures, textElements, selectedElement,
  handleCanvasClick, handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const drawElements = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Draw text elements
    textElements.forEach(textEl => {
      ctx.fillStyle = textEl.color || '#000';
      ctx.font = `${textEl.fontSize || 16}px Arial`;
      ctx.textAlign = 'left';
      ctx.fillText(textEl.text, textEl.x, textEl.y);
      
      if (selectedElement && selectedElement.element === textEl) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          textEl.x - 5,
          textEl.y - (textEl.height || 20) - 5,
          (textEl.width || ctx.measureText(textEl.text).width) + 10,
          (textEl.height || 20) + 10
        );
        ctx.setLineDash([]);
      }
    });

    // Draw signatures
    signatures.forEach(sig => {
      if (sig.data) {
        const img = new window.Image();
        img.onload = () => {
          try {
            ctx.drawImage(img, sig.x, sig.y, sig.width, sig.height);
            
            if (selectedElement && selectedElement.element === sig) {
              ctx.strokeStyle = '#3b82f6';
              ctx.lineWidth = 3;
              ctx.setLineDash([8, 4]);
              ctx.strokeRect(sig.x - 3, sig.y - 3, sig.width + 6, sig.height + 6);
              ctx.setLineDash([]);
            }
          } catch (error) {
            console.error('Error drawing signature:', error);
          }
        };
        img.onerror = () => {
          console.error('Failed to load signature image:', sig.data.substring(0, 50) + '...');
        };
        img.src = sig.data;
      }
    });
  }, [canvasRef, textElements, signatures, selectedElement]);

  const redrawCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    setLoadError(null);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!canvasContent) {
      drawElements();
      return;
    }

    try {
      setIsLoading(true);

      if (canvasContent.type === 'image') {
        await loadImage(ctx, canvasContent);
      } else if (canvasContent.type === 'text') {
        drawTextContent(ctx, canvasContent);
      } else if (canvasContent.type === 'pdf') {
        drawPdfPlaceholder(ctx);
      }

      drawElements();
    } catch (error) {
      console.error('Error drawing canvas content:', error);
      setLoadError('Failed to load document');
      drawErrorState(ctx);
    } finally {
      setIsLoading(false);
    }
  }, [canvasContent, canvasRef, drawElements]);

  const loadImage = (ctx, content) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      
      img.onload = () => {
        try {
          let { x = 0, y = 0, width, height } = content.bounds || {};
          
          // Calculate dimensions if not provided
          if (!width || !height) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const maxWidth = CANVAS_WIDTH - 40;
            const maxHeight = CANVAS_HEIGHT - 40;
            
            if (aspectRatio > maxWidth / maxHeight) {
              width = maxWidth;
              height = maxWidth / aspectRatio;
            } else {
              height = maxHeight;
              width = maxHeight * aspectRatio;
            }
            
            x = (CANVAS_WIDTH - width) / 2;
            y = (CANVAS_HEIGHT - height) / 2;
          }
          
          ctx.drawImage(img, x, y, width, height);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${content.data?.substring(0, 50)}...`));
      };

      // Handle different data formats
      if (content.data) {
        if (content.data.startsWith('data:')) {
          img.src = content.data;
        } else if (content.data.startsWith('http')) {
          img.crossOrigin = 'anonymous';
          img.src = content.data;
        } else {
          // Assume base64 without prefix
          img.src = `data:image/jpeg;base64,${content.data}`;
        }
      } else {
        reject(new Error('No image data provided'));
      }
    });
  };

  const drawTextContent = (ctx, content) => {
    // Draw border
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);
    
    // Draw text
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    const lines = (content.data || '').split('\n');
    const lineHeight = 24;
    const startY = 50;
    const maxLines = Math.floor((CANVAS_HEIGHT - 80) / lineHeight);
    
    lines.slice(0, maxLines).forEach((line, i) => {
      ctx.fillText(line, 40, startY + i * lineHeight);
    });
    
    if (lines.length > maxLines) {
      ctx.fillStyle = '#6c757d';
      ctx.fillText('...', 40, startY + maxLines * lineHeight);
    }
  };

  const drawPdfPlaceholder = (ctx) => {
    const rectX = 50;
    const rectY = 50;
    const rectWidth = CANVAS_WIDTH - 100;
    const rectHeight = CANVAS_HEIGHT - 100;
    
    // Background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
    
    // Border
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 2;
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
    
    // Text
    ctx.fillStyle = '#6c757d';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PDF Document', CANVAS_WIDTH / 2, 150);
    ctx.font = '16px Arial';
    ctx.fillText('Preview not available', CANVAS_WIDTH / 2, 180);
    ctx.fillText('Click to view full document', CANVAS_WIDTH / 2, 200);
  };

  const drawErrorState = (ctx) => {
    ctx.fillStyle = "#ffebee";
    ctx.fillRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);
    
    ctx.strokeStyle = '#f44336';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);
    
    ctx.fillStyle = '#f44336';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Failed to Load Document', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    
    ctx.font = '14px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(loadError || 'Unknown error occurred', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
  };

  const drawLoadingState = (ctx) => {
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);
    
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, CANVAS_WIDTH - 40, CANVAS_HEIGHT - 40);
    
    ctx.fillStyle = '#666';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading Document...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  };

  useEffect(() => {
    if (isLoading) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        drawLoadingState(ctx);
      }
    } else {
      redrawCanvas();
    }
  }, [canvasContent, signatures, textElements, selectedElement, isLoading, redrawCanvas]);

  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ 
          border: "1px solid #e2e8f0", 
          borderRadius: 6, 
          background: "#fff",
          cursor: isLoading ? 'wait' : 'default'
        }}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      />
      {loadError && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: '#ffebee',
          color: '#f44336',
          padding: '8px 12px',
          borderRadius: 4,
          fontSize: '12px',
          border: '1px solid #f44336'
        }}>
          {loadError}
        </div>
      )}
    </div>
  );
};

export default Canvas;