import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();
const PORT = 3004;
app.set('view engine', 'ejs');

const whenIncomingRequest = (request, response) => {
  // console.log('response is...');
  // console.log(response);
  // read the JSON file
  read('data.json', (data, error) => {
    const selectedYear = request.params.year;
    console.log(selectedYear);
    let content = '';
    for (let i = 0; i < data.sightings.length; i += 1) {
      // console.log(data.sightings[i].YEAR);
      if (data.sightings[i].YEAR === selectedYear) {
        content += `Year of sighting: ${data.sightings[i].YEAR}, State: ${data.sightings[i].STATE}<br>`;
      }
    }
    response.send(content);
    console.log('done with reading');
  });
};

const getSightingDetails = (request, response) => {
  const chosenIndex = request.params.index;
  console.log(chosenIndex);
  read('data.json', (data, error) => {
    const sightingsDataForGivenIndex = data.sightings[chosenIndex];
    const content = `<html><body> <h1> Year: ${sightingsDataForGivenIndex.YEAR}</h1> <p> State: ${sightingsDataForGivenIndex.STATE}</p><p>${sightingsDataForGivenIndex.OBSERVED}</p> </body></html>`;
    response.send(content);
  });
};

app.get('/', (request, response) => {
  read('data.json', (data, error) => {
    response.render('kenrick-sightings', data);
  });
});

app.get('/years', (request, response) => {
  read('data.json', (data, error) => {
    response.render('years', data);
    // keep all the years in object, look at every single sighting
    // and keep all the years, if  the year is a dupliucate, nothing will happen
    const years = [];
    data.sightings.forEach((element) => {

    });
  });
});

app.get('/year-sightings/:year', whenIncomingRequest);
app.get('/sightings/:index', getSightingDetails);
app.listen(PORT);
