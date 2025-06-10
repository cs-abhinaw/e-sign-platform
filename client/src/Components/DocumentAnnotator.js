// src/components/DocumentAnnotator.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { 
  Type, Edit3, MousePointer, Undo, Redo, Trash2, Download 
} from 'lucide-react';

const DocumentAnnotator = ({ canvasRef, document, setDocument }) => {
  const [tool, setTool] = useState('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatures, setSignatures] = useState([]);
  const [textElements, setTextElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textInputPos, setTextInputPos] = useState({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [zoom] = useState(1); // Zoom not implemented in UI, kept for consistency
  const [pan] = useState({ x: 0, y: 0 }); // Pan not implemented in UI

  // Save state for undo/redo
  const saveState = useCallback(() => {
    const state = {
      signatures: JSON.parse(JSON.stringify(signatures)),
      textElements: JSON.parse(JSON.stringify(textElements))
    };
    setUndoStack(prev => [...prev.slice(-19), state]);
    setRedoStack([]);
  }, [signatures, textElements]);

  // Draw annotations
  const drawElements = useCallback((ctx) => {
    // Draw signatures
    signatures.forEach((sig, index) => {
      if (sig.type === 'drawn') {
        ctx.strokeStyle = sig.color || '#000';
        ctx.lineWidth = sig.lineWidth || 2;
        ctx.beginPath();
        
        sig.points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
      
      // Draw selection border
      if (selectedElement?.type === 'signature' && selectedElement?.index === index) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(sig.bounds.x - 5, sig.bounds.y - 5, sig.bounds.width + 10, sig.bounds.height + 10);
        ctx.setLineDash([]);
      }
    });
    
    // Draw text elements
    textElements.forEach((text, index) => {
      ctx.fillStyle = text.color || '#000';
      ctx.font = `${text.fontSize || 16}px ${text.fontFamily || 'Arial'}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(text.text, text.x, text.y);
      
      // Draw selection border
      if (selectedElement?.type === 'text' && selectedElement?.index === index) {
        const metrics = ctx.measureText(text.text);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(text.x - 5, text.y - 5, metrics.width + 10, (text.fontSize || 16) + 10);
        ctx.setLineDash([]);
      }
    });
    
    // Draw current path while drawing
    if (currentPath.length > 0 && tool === 'signature') {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      currentPath.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();
    }
  }, [signatures, textElements, selectedElement, currentPath, tool]);

  // Redraw annotations on canvas
  const redrawAnnotations = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);
    drawElements(ctx);
    ctx.restore();
  }, [canvasRef, drawElements, zoom, pan]);

  // Update annotations when state changes
  useEffect(() => {
    redrawAnnotations();
  }, [signatures, textElements, selectedElement, currentPath, redrawAnnotations]);

  // Mouse event handlers
  const getMousePos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    };
  }, [canvasRef, pan, zoom]);

  const handleMouseDown = useCallback((e) => {
    const pos = getMousePos(e);
    
    if (tool === 'signature') {
      setIsDrawing(true);
      setCurrentPath([pos]);
      saveState();
    } else if (tool === 'select') {
      let foundElement = null;
      
      textElements.forEach((text, index) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.font = `${text.fontSize || 16}px ${text.fontFamily || 'Arial'}`;
        const metrics = ctx.measureText(text.text);
        
        if (pos.x >= text.x && pos.x <= text.x + metrics.width &&
            pos.y >= text.y && pos.y <= text.y + (text.fontSize || 16)) {
          foundElement = { type: 'text', index, element: text };
        }
      });
      
      signatures.forEach((sig, index) => {
        if (sig.bounds && 
            pos.x >= sig.bounds.x && pos.x <= sig.bounds.x + sig.bounds.width &&
            pos.y >= sig.bounds.y && pos.y <= sig.bounds.y + sig.bounds.height) {
          foundElement = { type: 'signature', index, element: sig };
        }
      });
      
      setSelectedElement(foundElement);
      if (foundElement) {
        setDragStart({ x: pos.x - foundElement.element.x, y: pos.y - foundElement.element.y });
      }
    } else if (tool === 'text') {
      setTextInputPos(pos);
      setShowTextInput(true);
      setTextInput('');
    }
  }, [tool, getMousePos, textElements, signatures, saveState]);

  const handleMouseMove = useCallback((e) => {
    const pos = getMousePos(e);
    
    if (isDrawing && tool === 'signature') {
      setCurrentPath(prev => [...prev, pos]);
      redrawAnnotations();
    } else if (selectedElement && dragStart) {
      const newPos = {
        x: pos.x - dragStart.x,
        y: pos.y - dragStart.y
      };
      
      if (selectedElement.type === 'text') {
        const newTextElements = [...textElements];
        newTextElements[selectedElement.index] = {
          ...newTextElements[selectedElement.index],
          ...newPos
        };
        setTextElements(newTextElements);
      } else if (selectedElement.type === 'signature') {
        const newSignatures = [...signatures];
        const sig = newSignatures[selectedElement.index];
        const deltaX = newPos.x - sig.x;
        const deltaY = newPos.y - sig.y;
        
        newSignatures[selectedElement.index] = {
          ...sig,
          x: newPos.x,
          y: newPos.y,
          points: sig.points.map(p => ({ x: p.x + deltaX, y: p.y + deltaY })),
          bounds: {
            ...sig.bounds,
            x: sig.bounds.x + deltaX,
            y: sig.bounds.y + deltaY
          }
        };
        setSignatures(newSignatures);
      }
    }
  }, [isDrawing, tool, selectedElement, dragStart, getMousePos, textElements, signatures, redrawAnnotations]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentPath.length > 0) {
      const xs = currentPath.map(p => p.x);
      const ys = currentPath.map(p => p.y);
      const bounds = {
        x: Math.min(...xs) - 5,
        y: Math.min(...ys) - 5,
        width: Math.max(...xs) - Math.min(...xs) + 10,
        height: Math.max(...ys) - Math.min(...ys) + 10
      };
      
      const newSignature = {
        type: 'drawn',
        points: [...currentPath],
        bounds,
        x: bounds.x,
        y: bounds.y,
        color: '#000',
        lineWidth: 2,
        timestamp: Date.now()
      };
      
      setSignatures(prev => [...prev, newSignature]);
      setCurrentPath([]);
    }
    
    setIsDrawing(false);
    setDragStart(null);
  }, [isDrawing, currentPath]);

  // Add text element
  const addTextElement = useCallback(() => {
    if (textInput.trim()) {
      saveState();
      const newText = {
        text: textInput.trim(),
        x: textInputPos.x,
        y: textInputPos.y,
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000',
        timestamp: Date.now()
      };
      setTextElements(prev => [...prev, newText]);
      setShowTextInput(false);
      setTextInput('');
    }
  }, [textInput, textInputPos, saveState]);

  // Delete selected element
  const deleteSelected = useCallback(() => {
    if (selectedElement) {
      saveState();
      if (selectedElement.type === 'text') {
        setTextElements(prev => prev.filter((_, i) => i !== selectedElement.index));
      } else if (selectedElement.type === 'signature') {
        setSignatures(prev => prev.filter((_, i) => i !== selectedElement.index));
      }
      setSelectedElement(null);
    }
  }, [selectedElement, saveState]);

  // Clear all
  const clearAll = useCallback(() => {
    if (signatures.length > 0 || textElements.length > 0) {
      saveState();
      setSignatures([]);
      setTextElements([]);
      setSelectedElement(null);
    }
  }, [signatures.length, textElements.length, saveState]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (undoStack.length > 0) {
      const currentState = {
        signatures: [...signatures],
        textElements: [...textElements]
      };
      setRedoStack(prev => [...prev, currentState]);
      
      const prevState = undoStack[undoStack.length - 1];
      setSignatures(prevState.signatures);
      setTextElements(prevState.textElements);
      setUndoStack(prev => prev.slice(0, -1));
      setSelectedElement(null);
    }
  }, [undoStack, signatures, textElements]);

  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const currentState = {
        signatures: [...signatures],
        textElements: [...textElements]
      };
      setUndoStack(prev => [...prev, currentState]);
      
      const nextState = redoStack[redoStack.length - 1];
      setSignatures(nextState.signatures);
      setTextElements(nextState.textElements);
      setRedoStack(prev => prev.slice(0, -1));
      setSelectedElement(null);
    }
  }, [redoStack, signatures, textElements]);

  // Export as image
  const exportDocument = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `signed-document-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }, [canvasRef]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 's':
            e.preventDefault();
            exportDocument();
            break;
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement) {
          e.preventDefault();
          deleteSelected();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, exportDocument, deleteSelected, selectedElement]);

  const toolButtonStyle = (isActive) => ({
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    backgroundColor: isActive ? '#3b82f6' : '#f1f5f9',
    color: isActive ? '#fff' : '#64748b',
    boxShadow: isActive ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 1px 2px rgba(0,0,0,0.05)'
  });

  const buttonStyle = {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    backgroundColor: '#f8fafc',
    color: '#374151'
  };

  return (
    <>
      {/* Toolbar */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px', 
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setTool('select')}
          style={toolButtonStyle(tool === 'select')}
        >
          <MousePointer size={16} />
          Select
        </button>
        <button
          onClick={() => setTool('signature')}
          style={toolButtonStyle(tool === 'signature')}
        >
          <Edit3 size={16} />
          Draw Signature
        </button>
        <button
          onClick={() => setTool('text')}
          style={toolButtonStyle(tool === 'text')}
        >
          <Type size={16} />
          Add Text
        </button>
        <div style={{ width: '1px', backgroundColor: '#e2e8f0', margin: '0 8px' }} />
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          style={{
            ...buttonStyle,
            opacity: undoStack.length === 0 ? 0.5 : 1,
            cursor: undoStack.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <Undo size={16} />
        </button>
        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          style={{
            ...buttonStyle,
            opacity: redoStack.length === 0 ? 0.5 : 1,
            cursor: redoStack.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <Redo size={16} />
        </button>
        <button
          onClick={clearAll}
          disabled={signatures.length === 0 && textElements.length === 0}
          style={{
            ...buttonStyle,
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            opacity: (signatures.length === 0 && textElements.length === 0) ? 0.5 : 1
          }}
        >
          <Trash2 size={16} />
          Clear All
        </button>
        {selectedElement && (
          <button
            onClick={deleteSelected}
            style={{
              ...buttonStyle,
              backgroundColor: '#fef2f2',
              color: '#dc2626'
            }}
          >
            <Trash2 size={16} />
            Delete Selected
          </button>
        )}
        <div style={{ width: '1px', backgroundColor: '#e2e8f0', margin: '0 8px' }} />
        <button
          onClick={exportDocument}
          style={{
            ...buttonStyle,
            backgroundColor: '#16a34a',
            color: '#fff'
          }}
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Text Input Modal */}
      {showTextInput && (
        <div style={{
          position: 'absolute',
          left: textInputPos.x + 10,
          top: textInputPos.y + 10,
          backgroundColor: '#fff',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 10,
          minWidth: '250px'
        }}>
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTextElement();
              if (e.key === 'Escape') setShowTextInput(false);
            }}
            placeholder="Enter text..."
            autoFocus
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              marginBottom: '12px',
              outline: 'none'
            }}
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowTextInput(false)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: '#f1f5f9',
                color: '#374151',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={addTextElement}
              disabled={!textInput.trim()}
              style={{
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: textInput.trim() ? '#3b82f6' : '#9ca3af',
                color: '#fff',
                cursor: textInput.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div style={{ 
        marginTop: '16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <div>
          Tool: <strong>{tool}</strong>
          {selectedElement && (
            <span style={{ marginLeft: '16px' }}>
              Selected: <strong>{selectedElement.type}</strong>
            </span>
          )}
        </div>
        <div>
          Signatures: <strong>{signatures.length}</strong> • 
          Text: <strong>{textElements.length}</strong>
        </div>
      </div>
    </>
  );
};

export default DocumentAnnotator;