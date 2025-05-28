import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onChange, language, theme, fontSize }) => {
  const options = {
    minimap: { enabled: false },
    fontSize: fontSize,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: 'on',
    lineNumbers: 'on',
    glyphMargin: true,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'all',
    scrollbar: {
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
    },
  };

  const handleEditorMount = (editor, monaco) => {
    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      document.getElementById('run-button')?.click();
    });
  };

  return (
    <div className="editor-container">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={onChange}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={options}
        onMount={handleEditorMount}
      />
    </div>
  );
};

export default CodeEditor;