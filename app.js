const express = require('express');
const path = require('path');
const { getCityInfo, getJobs } = require('./util.js');

const app = express();

// Statically serve the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Declare the GET route /api/city/:city
app.get('/api/city/:city', async (req, res) => {
  const location = req.params.city;

  try {
    const cityInfo = await getCityInfo(location);
    const jobs = await getJobs(location);

    // If both cityInfo and jobs are falsy, return a 404.
    if (!cityInfo && !jobs) {
      return res.status(404).json({
        error: "City info and jobs not found for the given location."
      });
    }

    // Otherwise, return a 200 status with the available data.
    res.json({ cityInfo, jobs });

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      error: "An internal server error occurred."
    });
  }
});

module.exports = app;
