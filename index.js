import express from 'express';
import { read } from './jsonFileStorage.js';

const PORT = 3004;

const app = express();

const whenIncomingRequest = (request, response) => {
  console.log('Request came in');

  read('data.json', (data, error) => {
    if (error) {
      response.send(`Error occurred: ${error}`);
      return;
    }

    const { index } = request.params;
    const chosenItem = data.sightings[index];
    // console.log(chosenItem);
    response.send(chosenItem);
  });
};

const createHTMLResponse = (request, response) => {
  console.log('Request came in');

  console.log('Request: ', request);
  console.log('Response: ', response);

  read('data.json', (data, error) => {
    if (error) {
      response.send(`Error occurred: ${error}`);
      return;
    }

    const { index } = request.params;
    const chosenItem = data.sightings[index];
    console.log(chosenItem);

    const content = `<html><body><h1>hello</h1><p>YEAR: ${chosenItem.YEAR}
    <br>STATE: ${chosenItem.STATE} <br> OBSERVED: ${chosenItem.OBSERVED}</p></body></html>`;

    response.send(content);
  });
};

const findReportsForAYear = (request, response) => {
  console.log('Request came in');

  read('data.json', (data, error) => {
    if (error) {
      response.send(`Error occurred: ${error}`);
      return;
    }

    let responseData = '';
    let counter = 0;
    const { year } = request.params;
    data.sightings.forEach((element) => {
      if (element.YEAR === year)
      {
        counter += 1;
        responseData += `YEAR: ${element.YEAR}, STATE: ${element.STATE} <br>`;
      }
    });

    const content = `<html><body><h1>hello</h1><p>${responseData}</p></body></html>`;
    console.log(responseData);
    console.log(`Found ${counter} matching items`);
    response.send(content);
  });
};

const sortDataByYear = (request, response) => {
  console.log('Request came in');

  read('data.json', (data, error) => {
    if (error) {
      response.send(`Error occurred: ${error}`);
      return;
    }

    const responseData = '';

    const query = request.query.sort;
    console.log(`Query received: ${query}`);

    // Filter out the objects that are not having year key
    const sightingsFiltered = data.sightings.filter((element) => (('YEAR' in element) && (!Number.isNaN(Number(element.YEAR))) && (element.YEAR !== null)));

    // Sorting the filtered sightings array
    sightingsFiltered.sort((first, second) => {
      if (query === 'asc') {
        return (Number(first.YEAR) - Number(second.YEAR));
      }
      if (query === 'desc')
      {
        return (Number(second.YEAR) - Number(first.YEAR));
      }
      return 0;
    });

    // create the html content
    let htmlContent = '';

    sightingsFiltered.forEach((element) => {
      htmlContent += `YEAR: ${element.YEAR} <br>`;
    });
    const content = `<html><body><h1>hello</h1><p>${htmlContent}</p></body></html>`;

    response.send(content);
  });
};

// app.get('/sightings/:index', whenIncomingRequest);
// app.get('/sightings/:index', createHTMLResponse);
// app.get('/year-sightings/:year', findReportsForAYear);

app.get('/year-sightings', sortDataByYear);
app.listen(PORT);
