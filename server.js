const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
mongoose.connect('<mongodb+srv://baki123:<password>@cluster0.74zymrj.mongodb.net/?retryWrites=true&w=majority>', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.log('Failed to connect to MongoDB Atlas', err));

// Define the project schema and model
const projectSchema = new mongoose.Schema({
  imgsrc: String,
  title: String,
  text: String,
  view: String,
});

const Project = mongoose.model('Project', projectSchema);

// Use bodyParser middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'my-portfolio', 'build')));

// Define API routes
app.get('/api/projects', (req, res) => {
  Project.find({}, (err, projects) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving projects');
    } else {
      res.json(projects);
    }
  });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'my-portfolio', 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
