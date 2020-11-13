import express from 'express';
import { read } from './jsonFileStorage.js';

const PORT = 3004;

const app = express();

// set the library (template engine || view engine) to use for all requests
app.set('view engine', 'ejs');

const whenBaseIndexPageRequest = (request, response) => {
  console.log('Request came in');

  read('data.json', (data, error) => {
    if (error) {
      response.send(`Error occurred: ${error}`);
      return;
    }

    // if no error, render the data of data.json
    response.render('base-index-page', data);
  });
};
const whenIncomingRequest = (request, response) => {
  console.log('Request came in');

  read('data.json', (data, error) => {
    if (error) {
      response.send(`Error occurred: ${error}`);
      return;
    }

    // get the index of the sighting
    const { index } = request.params;

    // get the sighting object coressponding to the index
    const sighting = data.sightings[index];

    // set the sighting object in another object
    const templateData = {
      sighting,
    };
    // it is like this:
    // templateData = {
    //   sighting: {
    //     key1: value1,
    //     key2: value2,
    //     etc
    //   }
    // }

    response.render('sightings', templateData);
  });
};

// not related to 3.ICE.1 yet
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

// not related to 3.ICE.1 yet
const findReportsForAYear = (request, response) => {
  console.log('Request came in');

  read('data.json', (data, error) => {
    if (error) {
      response.send(`Error occurred: ${error}`);
      return;
    }

    let counter = 0;
    const { year } = request.params;

    const templateData = {}; // {sighting { year: year-value}

    data.sightings.forEach((sighting) => {
      if (sighting.YEAR === year)
      {
        counter += 1;

        // stores all the keys and values of the sighting in an object in another object
        templateData.sightingData += { year: sighting.year };
        // templateData.sightingData = sighting;
      }
    });

    console.log(`Found ${counter} matching items`);

    response.render('year-sightings', templateData);
  });
};

// not related to 3.ICE.1 yet
const sortDataByYear = (request, response) => {
  console.log('Request came in');

  read('data.json', (data, error) => {
    if (error) {
      response.send(`Error occurred: ${error}`);
      return;
    }

    const query = request.query.sort;
    console.log(`Query received: ${query}`);

    // Filter out the objects that are not having year key
    const sightingsFiltered = data.sightings.filter((element) => (('YEAR' in element) && (!isNaN(Number(element.YEAR))) && element.YEAR != null));

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

app.get('/', whenBaseIndexPageRequest);
app.get('/sightings/:index', whenIncomingRequest);
// app.get('/sightings/:index', createHTMLResponse);
app.get('/year-sightings/:year', findReportsForAYear);
app.get('/year-sightings', sortDataByYear);

app.listen(PORT);
