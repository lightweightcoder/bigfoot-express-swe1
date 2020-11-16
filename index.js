import express from 'express';
import { add, read } from './jsonFileStorage.js';

const PORT = 3004;

const app = express();

// set the library (template engine || view engine) to use for all requests
app.set('view engine', 'ejs');

// config to accept request form data
app.use(express.urlencoded({ extended: false }));

// start of functions for 3.ICE.1 and 3.ICE.2 =====================================
// ================================================================================

// callback to render all the data from data.json to base-index-page.ejs
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

// callback to render the sighting data coressponding to the sighting index requested
// render to sightings.ejs
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
    // OR like this
    // const templateData = {};
    // templateData.sighting = { ...sighting };

    // the above 2 lines are like this:
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

// callback to render the sighting data (reports) coressponding to the sighting year requested
// render to year-sightings.ejs
const findReportsForAYear = (request, response) => {
  console.log('Request came in');

  read('data.json', (data, error) => {
    if (error) {
      response.send(`Error occurred: ${error}`);
      return;
    }

    // to count how many sightings are there for the requested year
    let counter = 0;

    const { year } = request.params;

    // data to render to ejs file
    const templateData = { sightings: [] };

    data.sightings.forEach((arrayElement) => {
      if (arrayElement.YEAR === year)
      {
        counter += 1;

        // stores the keys (year, state, observed)
        // and values of the sighting in an object in another object
        const sighting = {
          year: arrayElement.YEAR,
          state: arrayElement.STATE,
          observed: arrayElement.OBSERVED,
        };

        templateData.sightings.push(sighting);
      }
    });

    console.log(`Found ${counter} matching items`);

    response.render('year-sightings', templateData);
  });
};

// sort data by year (ascending or descending) according to query
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
app.get('/year-sightings/:year', findReportsForAYear);
app.get('/year-sightings', sortDataByYear);

// end of functions for 3.ICE.1 and 3.ICE.2 =====================================
// ==============================================================================

// app.post - accept form request
app.post('/update-json', (request, response) => {
  console.log(request.body);

  // add the new sighting to the array of sightings in data.json
  add('data.json', 'sightings', request.body, (data, error) => {
    // check for errors
    if (error) {
      response.status(500).send('sorry this didnt work');
      return;
    }

    // send back an acknowledgement
    response.send('done adding new sighting!');
  });
});

// render the form that will create the request
app.get('/update-json', (request, response) => {
  response.render('form');
});

app.listen(PORT);
