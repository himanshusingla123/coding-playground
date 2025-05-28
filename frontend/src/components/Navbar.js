import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Select, 
  MenuItem, 
  Button, 
  IconButton,
  Tooltip,
  Slider
} from '@mui/material';
import {
  PlayArrow,
  Brightness4,
  Brightness7,
  Add,
  Remove
} from '@mui/icons-material';

const Navbar = ({ 
  language, 
  languages, 
  onLanguageChange, 
  onRun, 
  isRunning,
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange
}) => {
  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <div className="navbar-brand">
          <h1>🚀 Coding Playground</h1>
          <span className="tagline">Learn to code, one line at a time!</span>
        </div>

        <div className="navbar-controls">
          <Select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="language-selector"
            size="small"
          >
            {languages.map(lang => (
              <MenuItem key={lang.id} value={lang.id}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>

          <div className="font-size-control">
            <IconButton onClick={() => onFontSizeChange(Math.max(12, fontSize - 2))}>
              <Remove />
            </IconButton>
            <span>{fontSize}px</span>
            <IconButton onClick={() => onFontSizeChange(Math.min(24, fontSize + 2))}>
              <Add />
            </IconButton>
          </div>

          <Tooltip title="Toggle theme">
            <IconButton onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Button
            id="run-button"
            variant="contained"
            color="primary"
            onClick={onRun}
            disabled={isRunning}
            startIcon={<PlayArrow />}
            className="run-button"
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;