import React, { useState, useEffect } from 'react';
import SplitPane from 'react-split-pane';
import { Toaster } from 'react-hot-toast';
import CodeEditor from './components/CodeEditor';
import Terminal from './components/Terminal';
import OutputDisplay from './components/OutputDisplay';
import Navbar from './components/Navbar';
import { executeCode, getLanguages } from './services/api';
import './styles/App.css';

const sampleCode = {
  python: `# Welcome to Python Playground!
# Try this interactive example:

name = input("What's your name? ")
age = int(input("How old are you? "))

print(f"Hello {name}!")
print(f"In 10 years, you'll be {age + 10} years old!")

# Let's create a simple visualization
import matplotlib.pyplot as plt

# Create data for a simple bar chart
subjects = ['Math', 'Science', 'English', 'History']
scores = [85, 92, 78, 88]

# Create the plot
plt.figure(figsize=(8, 6))
plt.bar(subjects, scores, color=['blue', 'green', 'red', 'orange'])
plt.title(f"{name}'s Test Scores")
plt.ylabel('Score')
plt.ylim(0, 100)

# Save the plot
plt.savefig('/code/output.png')
print("Chart saved as output.png!")`,

  javascript: `// Welcome to JavaScript Playground!
// Try this interactive example:

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Welcome to JavaScript Playground! 🎮");

rl.question("What's your favorite programming language? ", (language) => {
  console.log(\`Great choice! \${language} is awesome! 🚀\`);
  
  // Let's create a simple pattern
  console.log("\\nHere's a cool pattern for you:");
  for (let i = 1; i <= 5; i++) {
    console.log("*".repeat(i).padStart(5));
  }
  
  rl.close();
});`,

  cpp: `// Welcome to C++ Playground!
// Try this interactive example:

#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    int num;
    
    cout << "Welcome to C++ Playground! 🎯" << endl;
    cout << "What's your name? ";
    getline(cin, name);
    
    cout << "Enter a number: ";
    cin >> num;
    
    cout << "\\nHello, " << name << "!" << endl;
    cout << "Here's the multiplication table for " << num << ":" << endl;
    
    for (int i = 1; i <= 10; i++) {
        cout << num << " x " << i << " = " << num * i << endl;
    }
    
    return 0;
}`,

  java: `// Welcome to Java Playground!
// Try this interactive example:

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Welcome to Java Playground! ☕");
        System.out.print("Enter your name: ");
        String name = scanner.nextLine();
        
        System.out.println("\\nHello, " + name + "!");
        System.out.println("Let's play a guessing game!");
        
        int secretNumber = (int)(Math.random() * 10) + 1;
        int guess;
        
        System.out.print("Guess a number between 1 and 10: ");
        guess = scanner.nextInt();
        
                if (guess == secretNumber) {
            System.out.println("🎉 Congratulations! You guessed it!");
        } else {
            System.out.println("Sorry! The number was " + secretNumber);
            System.out.println("Better luck next time!");
        }
        
        scanner.close();
    }
}`
};

function App() {
  const [code, setCode] = useState(sampleCode.python);
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [input, setInput] = useState('');
  const [languages, setLanguages] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    fetchLanguages();
    setupWebSocket();
  }, []);

  const fetchLanguages = async () => {
    try {
      const langs = await getLanguages();
      setLanguages(langs);
    } catch (error) {
      console.error('Failed to fetch languages:', error);
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket(`ws://localhost:5000/ws/${sessionId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'output') {
        setOutput(prev => prev + data.data.data);
      }
    };

    return ws;
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(sampleCode[newLanguage] || '');
    setOutput('');
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      const result = await executeCode(code, language, input, sessionId);
      if (result.error) {
        setOutput(prev => prev + '\n' + result.error);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleInputProvide = (value) => {
    setInput(value);
  };

  return (
    <div className="app">
      <Toaster position="top-right" />
      <Navbar 
        language={language}
        languages={languages}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        isRunning={isRunning}
        theme={theme}
        onThemeChange={setTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
      
      <div className="main-content">
        <SplitPane
          split="vertical"
          minSize={300}
          defaultSize="50%"
          resizerStyle={{
            background: '#2d2d2d',
            width: '8px',
            cursor: 'col-resize'
          }}
        >
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            theme={theme}
            fontSize={fontSize}
          />
          
          <div className="right-panel">
            <SplitPane
              split="horizontal"
              minSize={100}
              defaultSize="60%"
              resizerStyle={{
                background: '#2d2d2d',
                height: '8px',
                cursor: 'row-resize'
              }}
            >
              <Terminal
                output={output}
                onInputProvide={handleInputProvide}
                isRunning={isRunning}
              />
              <OutputDisplay
                sessionId={sessionId}
                language={language}
              />
            </SplitPane>
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;