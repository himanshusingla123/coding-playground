const Docker = require('dockerode');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const docker = new Docker();

const languageConfig = {
  python: {
    image: 'coding-playground-python',
    cmd: ['python', '/code/main.py'],
    extension: '.py'
  },
  javascript: {
    image: 'coding-playground-javascript',
    cmd: ['node', '/code/main.js'],
    extension: '.js'
  },
  cpp: {
    image: 'coding-playground-cpp',
    cmd: ['/bin/sh', '-c', 'g++ /code/main.cpp -o /code/main && /code/main'],
    extension: '.cpp'
  },
  java: {
    image: 'coding-playground-java',
    cmd: ['/bin/sh', '-c', 'cd /code && javac Main.java && java Main'],
    extension: '.java'
  }
};

async function executeCode({ code, language, input, sessionId, onOutput }) {
  const config = languageConfig[language];
  if (!config) {
    throw new Error('Unsupported language');
  }

  const tempDir = path.join(__dirname, '../../temp', sessionId);
  await fs.mkdir(tempDir, { recursive: true });

  const fileName = language === 'java' ? 'Main' : 'main';
  const filePath = path.join(tempDir, fileName + config.extension);
  await fs.writeFile(filePath, code);

  if (input) {
    const inputPath = path.join(tempDir, 'input.txt');
    await fs.writeFile(inputPath, input);
  }

  try {
    const container = await docker.createContainer({
      Image: config.image,
      Cmd: config.cmd,
      WorkingDir: '/code',
      HostConfig: {
        AutoRemove: true,
        Memory: 512 * 1024 * 1024, // 512MB
        CpuQuota: 50000, // 50% CPU
        Binds: [`${tempDir}:/code`]
      },
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      OpenStdin: true,
      StdinOnce: false
    });

    const stream = await container.attach({
      stream: true,
      stdin: true,
      stdout: true,
      stderr: true
    });

    let output = '';
    let error = '';

    stream.on('data', (chunk) => {
      const data = chunk.toString();
      if (chunk[0] === 1) { // stdout
        output += data.slice(8);
        onOutput({ type: 'stdout', data: data.slice(8) });
      } else if (chunk[0] === 2) { // stderr
        error += data.slice(8);
        onOutput({ type: 'stderr', data: data.slice(8) });
      }
    });

    await container.start();

    if (input) {
      stream.write(input);
      stream.end();
    }

    await container.wait();

    // Cleanup
    await fs.rm(tempDir, { recursive: true, force: true });

    return { output, error };
  } catch (error) {
    // Cleanup on error
    await fs.rm(tempDir, { recursive: true, force: true });
    throw error;
  }
}

module.exports = { executeCode };