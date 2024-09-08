import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import  'css-doodle';
import './ColorPaletteApp.css';

function ColorPaletteApp() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [colorPalette, setColorPalette] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getColorPalette = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      const response = await fetch("http://localhost:5000/process_image", {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
        body: arrayBuffer,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error while fetching the color palette:', error);
      return null;
    }
  };

  const handleCreatePalette = async () => {
    if (selectedFile) {
      const response = await getColorPalette(selectedFile);
      if (response && response.color_palette) {
        setColorPalette(response.color_palette);
      }
    } else {
      alert('Please select an image first.');
    }
  };

  return (
    <>
      {/* Add the <css-doodle> component for the body background effect */}
      {/* 
      <css-doodle>
        {`
          --color: #51eaea, #fffde1, #ff9d76, #FB3569;

          @grid: 30x1 / 100vw 100vh / #270f34; 

          :container {
            perspective: 30vmin;
            --deg: @p(-180deg, 180deg);
          }

          :after, :before {
            content: '';
            background: @p(--color); 
            @place: @r(100%) @r(100%);
            @size: @r(6px);
            @shape: heart;
          }

          @place: center;
          @size: 18vmin; 

          box-shadow: @m2(0 0 50px @p(--color));
          background: @m100(
            radial-gradient(@p(--color) 50%, transparent 0) 
            @r(-20%, 120%) @r(-20%, 100%) / 1px 1px
            no-repeat
          );

          will-change: transform, opacity;
          animation: scale-up 12s linear infinite;
          animation-delay: calc(-12s / @I * @i);

          @keyframes scale-up {
            0%, 95.01%, 100% {
              transform: translateZ(0) rotate(0);
              opacity: 0;
            }
            10% { 
              opacity: 1; 
            }
            95% {
              transform: 
                translateZ(35vmin) rotateZ(var(--deg));
            }
          }
        `}
      </css-doodle>
       */}

      {/* Header */}
      <header className="header">
        <div className="logo">OneClick</div>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Tools</a></li>
            <li><a href="#">Color</a></li>
          </ul>
        </nav>
      </header>      

      {/* Main container */}
      <div id="container">
        <div id="main-section">
          <h1>Create a Color Palette</h1>

          {/* Dropzone Area */}
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            {selectedFile ? (
              // Show the uploaded image inside the dropzone
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Uploaded" 
                className="uploaded-image"
              />
            ) : isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Drag and drop an image here, or click to select one</p>
            )}
          </div>

          {/* Button to generate color palette */}
          <button 
            className="image-preview-button" 
            onClick={handleCreatePalette} 
            style={{ marginTop: '20px' }}
          >
            Generate Color Palette
          </button>
        </div>

        {/* Result area */}
        <div id="result">
          {selectedFile && (
            <div className="image-and-swatches-container">
              {/* Display color swatches */}
              <div className="swatches-container-block">
                {colorPalette.map((color, index) => (
                  <div key={index} className="color-swatch" style={{ backgroundColor: color }}>
                    {color}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ColorPaletteApp;
