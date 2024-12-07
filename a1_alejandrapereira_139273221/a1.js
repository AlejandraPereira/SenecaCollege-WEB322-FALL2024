/*********************************************************************************
*  WEB322 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites, GPT) or distributed to other students.
* 
* Name: Alejandra Pereira Leon
* Student ID: 139273221
* Date: 09/11/2024
*
********************************************************************************/ 
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let totalFileCount = 0;
let totalSize = 0;
let directoriesProcessed = 0;

function processFiles(files, directoryPath) {
  let fileCount = 0;
  let directorySize = 0;
 
  files.forEach((file) => {
    if (file.endsWith('.txt')) {
      fileCount++;
      
      fs.readFile(directoryPath + '/' + file, (err, fileData) => {
        if (err) {
          console.log(`Error reading file ${directoryPath + '/' + file}: ${err.message}`);
          return;
        }

        const data = fileData.toString();
        const namesArray = data.split(',');
        console.log(`File: ${file}`);
        console.log(namesArray);

        fs.stat(directoryPath + '/' + file, (err, stats) => {
          if (err) {
            console.log(`Error getting stats for file ${directoryPath + '/' + file}: ${err.message}`);
            return;
          }

          directorySize += stats.size;
          totalFileCount++;
          totalSize += stats.size;

          // Check if all files in this directory are processed
          if (--fileCount === 0) {
            directoriesProcessed++;
            if (directoriesProcessed === 2) {
              console.log(`Total number of .txt files: ${totalFileCount}`);
              console.log(`Cumulative size of all .txt files: ${totalSize} bytes`);
              askQuestion(); // Ask user to process something else or exit
            }
          }
        });
      });
    }
  });
}

// function for a single file
function processSingleFile(filePath) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      console.log(`Error reading file ${filePath}: ${err.message}`);
      return;
    }

    const data = fileData.toString();
    const namesArray = data.split(',');
    console.log(`File: ${filePath}`);
    console.log(namesArray);

    // Calculate metrics
    console.log(`Number of lines: ${calculateLines(data)}`);
    console.log(`Number of words: ${calculateWords(data)}`);
    console.log(`Number of characters: ${calculateCharacters(data)}`);
    console.log(`Letter frequency: ${JSON.stringify(calculateLetterFrequency(data))}`);

    // Ask again after processing the file
    askQuestion();
  });
}

function readTxtFiles(directoryPath) {
  
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.log(`Error reading directory ${directoryPath}: ${err.message}`);
      return;
    }
    processFiles(files, directoryPath);
  });
}

function processDirectory() {
  const mainDirectory = __dirname;
  const subDirectory = mainDirectory + '/data';

  readTxtFiles(mainDirectory);
  readTxtFiles(subDirectory);
}

function askQuestion() {
  rl.question("\nDo you wish to process a File (f) or directory (d), or exit (e): ", (choice) => {
    choice = choice.trim().toLowerCase();

    if (choice === 'f') { // process file
      console.log("Processing a file...");
      processSingleFile('log.txt'); 

    } else if (choice === 'd') {  // process directory
      console.log("Processing a directory...");
      processDirectory();
      
    } else if (choice === 'e') { // exit the program
      rl.close();
      
    } else {
      console.log('Invalid input, try again.');
      askQuestion(); 
    }
  });
}

// Calculate lines
function calculateLines(lines) {
  return lines.split('\n').length;
}

// Calculate words
function calculateWords(words) {
  return words.split(/\s+/).filter(word => /^[a-zA-Z]+$/.test(word)).length;
}

// Calculate characters
function calculateCharacters(characters) {
  return characters.length;
}

// Calculate letter frequency
function calculateLetterFrequency(text) {
  const freq = {};
  text.toLowerCase().replace(/[^a-z]/g, '').split('').forEach(char => {
    freq[char] = (freq[char] || 0) + 1;
  });
  return freq;
}

askQuestion();
