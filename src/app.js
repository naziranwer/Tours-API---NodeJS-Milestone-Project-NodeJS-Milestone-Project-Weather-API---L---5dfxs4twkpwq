const fs = require('fs');
const express = require('express');
const app = express();

//Middleware
app.use(express.json());

const tourDetails = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`));
// const tourDetails=[];

app.get('/tours', (req, res) => {
  //write a code here to get all the tours from tours.json
  try{
    if(tourDetails.length){
        res.status(200).json({"status": 200,
        "message": "Success",
        "data":tourDetails
      });
    }
    else{
      res.status(404).json({"message":"Not Found"});
    }
  }
  catch(err){
    res.status(500).json({"message":"Internal Server Error"});
  }
   
});

app.post('/tours', (req, res) => {
  const { name, description, duration, price } = req.body;
  //Write a code here for creating new tour from data/tours.json
  //For creating new id use this logic
  if(!name || !description || !duration || !price||  isNaN(price)){
     res.send(500).json({"message":"Bad Request"});
     return;
  }

  const newId =tourDetails.length === 0? 1 : tourDetails[tourDetails.length - 1].id + 1;
  
  const newTour={
    id:newId,
    name:name,
    description:description,
    duration:duration,
    price:price,
  }

  tourDetails.push(newTour);
  fs.writeFileSync(`${__dirname}/data/tours.json`,JSON.stringify(tourDetails,null,2));

  res.status(200).json({"status": 200,
  "message": "Tour added successfully"});
});

app.put('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);
  const updatedTour = req.body;

  //write a code here for updating a tour
  const tourIndex = tourDetails.findIndex(tour => tour.id === tourId);

  if (tourIndex !== -1) {
    // Update tour details
    tourDetails[tourIndex] = {
      ...tourDetails[tourIndex],
      ...updatedTour
    };

    // Write updated data back to the JSON file
    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails, null, 2));

    res.status(200).json({
      "status": 200,
      "message": "Tour updated successfully"
    });
  } else {
    res.status(404).json({
      "message": "Tour not found"
    });
  }
});

app.delete('/tours/:id', (req, res) => {
  const tourId = parseInt(req.params.id);
  //Write a code here for deleting a tour from data/tours.json

  const tourIndex = tourDetails.findIndex(tour => tour.id === tourId);

  if (tourIndex !== -1) {
    // Remove the tour from the array
    tourDetails.splice(tourIndex, 1);

    // Write updated data back to the JSON file
    fs.writeFileSync(`${__dirname}/data/tours.json`, JSON.stringify(tourDetails, null, 2));

    res.status(200).json({
      "status": 200,
      "message": "Tour deleted successfully"
    });
  } else {
    res.status(404).json({
      "message": "Tour not found"
    });
  }
 


});

module.exports = app;
