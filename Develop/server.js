const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
uuidv4();
const fs = require('fs');
const db = require("./db/db.json");
const PORT = process.env.PORT || 3001;
const app = express();
const util = require('util');

// Helper method for generating unique ids



// Middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// Promise version of fs.readFile
// const readFromFile = util.promisify(fs.readFile);



// // GET Route for retrieving all the notes
//for raw data its good practice to put a /api route in front
app.get('/api/notes', (req, res)=> {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
          console.log(err);
      } else {
          const parsed = JSON.parse(data);
          res.json(parsed);
      }
  });
});

// // POST Route for a new note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const note = {
      title,
      text,
      id: uuidv4(),
    };
    fs.readFile("./db/db.json", 'utf8', (err, data)=> {
        if (err) {
            console.error(err);

        } else {
            const show = JSON.parse(data);
            show.push(note);

            fs.writeFile("./db/db.json", JSON.stringify(show), (err) => {
                if (err) {
                    console.err(err);
                } else {
                    console.info("Note added");
                }
            })
        }
    });

    const update = {
        status: "confirmed",
        body: note,
    };

    console.log(update);
    res.json(update);
   } else {
       res.json("error");
   }
});

// // GET Route for retrieving all the feedback
// app.get('/api/feedback', (req, res) => {
//   console.info(`${req.method} request received for feedback`);


app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});