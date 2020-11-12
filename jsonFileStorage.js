// get the node libraries
import { readFile, writeFile } from 'fs';

export function read(fileName, callbackFileRead) {
  console.log('jsonFileStorage.js - inside read');

  // set the file read callback
  const whenFileIsRead = (error, JsonContent) => {
    console.log('jsonFileStorage.js - inside read, inside whenFileIsRead');

    // check for reading errors
    if (error) {
      console.log('reading error', error);
    }
    // console.log(JsonContent);
    const dataContent = JSON.parse(JsonContent);
    console.log('jsonFileStorage.js - inside whenFileIsRead, calling callbackFileRead');
    callbackFileRead(dataContent);
  };

  console.log('jsonFileStorage.js - inside read, calling readFile');

  // read the file
  readFile(fileName, 'utf-8', whenFileIsRead);
}

// write a file with the object passed in
export function write(filename, content, callback) {
  const outputContent = JSON.stringify(content);

  writeFile(filename, outputContent, (error) => {
    if (error) {
      console.log('error writing', outputContent, error);
      callback(null, error);
    } else {
      // file written successfully
      console.log('success!');
      callback(outputContent, null);
    }
  });
}

// add an object to an array of objects in a JSON file
export function add(filename, key, input, callback) {
  // set the file read callback
  const whenFileIsRead = (readingError, JsonContent) => {
    // check for reading errors
    if (readingError) {
      console.log('reading error', readingError);
      callback(null, readingError);
      return;
    }

    // parse the string into a JavaScript object
    const content = JSON.parse(JsonContent);

    if (content[key]) {
      content[key].push(input);
    } else {
      return;
    }

    // turn it into a string
    const outputContent = JSON.stringify(content);

    writeFile(filename, outputContent, (writingError) => {
      if (writingError) {
        console.log('error writing', outputContent, writingError);
        callback(null, writingError);
      } else {
        // file written successfully
        console.log('success!');
        callback(content, null);
      }
    });
  };

  // read the file
  readFile(filename, 'utf-8', whenFileIsRead);
}
