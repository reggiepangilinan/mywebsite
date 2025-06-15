#!/usr/bin/env node

const { exec } = require('child_process');
const http = require('http');

// Function to find the Next.js dev server port
function findServerPort() {
  return new Promise((resolve) => {
    // Check common ports
    const ports = [3000, 3001, 3002, 3003];
    let checkedPorts = 0;
    
    ports.forEach(port => {
      const req = http.request({
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'GET',
        timeout: 1000
      }, (res) => {
        resolve(port);
      });

      req.on('error', () => {
        checkedPorts++;
        if (checkedPorts === ports.length) {
          resolve(3000); // fallback
        }
      });

      req.end();
    });
  });
}

// Function to check if server is running on specific port
function checkServer(port, retries = 30) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: '/',
      method: 'GET',
      timeout: 1000
    }, (res) => {
      console.log(`✅ Server is ready on port ${port}!`);
      resolve(port);
    });

    req.on('error', () => {
      if (retries > 0) {
        console.log(`⏳ Waiting for server on port ${port}... (${31 - retries}/30)`);
        setTimeout(() => {
          checkServer(port, retries - 1).then(resolve).catch(reject);
        }, 2000);
      } else {
        reject(new Error(`Server did not start on port ${port} within 60 seconds`));
      }
    });

    req.end();
  });
}

// Function to open Chrome
function openChrome(port) {
  const url = `http://localhost:${port}`;
  const command = process.platform === 'darwin' 
    ? `open -a "Google Chrome" ${url}`
    : process.platform === 'win32'
    ? `start chrome ${url}`
    : `google-chrome ${url}`;

  exec(command, (error) => {
    if (error) {
      console.error('❌ Could not open Chrome:', error.message);
      console.log(`🌐 Please manually open ${url} in your browser`);
    } else {
      console.log(`🚀 Chrome opened successfully with ${url}!`);
    }
  });
}

// Main execution with retry logic for port finding
async function main() {
  try {
    // First, try to find running server
    const port = await findServerPort();
    console.log(`🔍 Checking for server on port ${port}...`);
    
    // Then wait for it to be ready
    const readyPort = await checkServer(port);
    openChrome(readyPort);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('🔄 Trying to find server on different ports...');
    
    // Fallback: check all common ports
    for (const port of [3000, 3001, 3002, 3003]) {
      try {
        await checkServer(port, 5); // fewer retries for fallback
        openChrome(port);
        return;
      } catch (e) {
        // Continue to next port
      }
    }
    
    console.log('🌐 Please manually open http://localhost:3000 (or whatever port Next.js is using) in your browser');
  }
}

main();
