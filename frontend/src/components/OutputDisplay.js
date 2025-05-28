import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const OutputDisplay = ({ sessionId, language }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [graphicsOutput, setGraphicsOutput] = useState(null);
  const [canvasOutput, setCanvasOutput] = useState(null);

  useEffect(() => {
    // Check for graphics output
    const checkForOutput = setInterval(() => {
      // Check for matplotlib output (Python)
      if (language === 'python') {
        fetch(`/api/output/${sessionId}/output.png`)
          .then(response => {
            if (response.ok) {
              setGraphicsOutput(`/api/output/${sessionId}/output.png`);
            }
          })
          .catch(() => {});
      }
    }, 1000);

    return () => clearInterval(checkForOutput);
  }, [sessionId, language]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="output-display">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Console Output" />
          <Tab label="Graphics Output" />
          <Tab label="Help & Tips" />
        </Tabs>
      </Box>

      <div className="tab-content">
        {activeTab === 0 && (
          <div className="console-output">
            <p>Console output appears in the terminal above</p>
          </div>
        )}

        {activeTab === 1 && (
          <div className="graphics-output">
            {graphicsOutput ? (
              <img 
                src={graphicsOutput} 
                alt="Graphics output" 
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            ) : (
              <div className="no-graphics">
                <p>No graphics output yet</p>
                <p className="hint">Try using matplotlib in Python or canvas in JavaScript!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="help-tips">
            <h3>🎯 Quick Tips for Young Coders</h3>
            <ul>
              <li><strong>Run Code:</strong> Press Ctrl+Enter or click the Run button</li>
              <li><strong>Input:</strong> When prompted, type in the terminal and press Enter</li>
              <li><strong>Graphics:</strong> Use matplotlib (Python) to create charts!</li>
              <li><strong>Debug:</strong> Read error messages carefully - they tell you what went wrong</li>
            </ul>

            <h3>🚀 Try These Challenges</h3>
            <div className="challenges">
              <div className="challenge">
                <h4>Challenge 1: Calculator</h4>
                <p>Create a simple calculator that can add, subtract, multiply, and divide</p>
              </div>
              <div className="challenge">
                <h4>Challenge 2: Pattern Maker</h4>
                <p>Use loops to create interesting patterns with asterisks (*)</p>
              </div>
              <div className="challenge">
                <h4>Challenge 3: Guessing Game</h4>
                <p>Make a number guessing game where the computer picks a random number</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;