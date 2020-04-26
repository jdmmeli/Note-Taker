
const express = require("express");
const path = require("path");
const fs = require("fs");

// sets the server
const app = express();
const PORT = process.env.PORT || 3000;

let notesData = [];

// data parsing for express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Develop/public")));

// reads the notes from db
app.get("/api/notes", function(err, res) {
  try {
   
    notesData = fs.readFileSync("Develop/db/db.json", "utf8");
    console.log("success");
   
    notesData = JSON.parse(notesData);

   
  } catch (err) {
    console.log(err);
  }
  res.json(notesData);
});

// writes the notes to db
app.post("/api/notes", function(req, res) {
  try {
    
    notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
    console.log(notesData);
    notesData = JSON.parse(notesData);
    req.body.id = notesData.length;
    notesData.push(req.body); 
    notesData = JSON.stringify(notesData);
   
    fs.writeFile("./Develop/db/db.json", notesData, "utf8", function(err) {
     
      if (err) throw err;
    });
    res.json(JSON.parse(notesData));

}
   catch (err) {
    throw err;
    console.error(err);
  }
});


// deletes the notes from db
app.delete("/api/notes/:id", function(req, res) {
  try {
    notesData = fs.readFileSync("./Develop/db/db.json", "utf8");
    notesData = JSON.parse(notesData);
    notesData = notesData.filter(function(note) {
      return note.id != req.params.id;
    });
   
    notesData = JSON.stringify(notesData);
   
    fs.writeFile("./Develop/db/db.json", notesData, "utf8", function(err) {
    
      if (err) throw err;
    });

    res.send(JSON.parse(notesData));
  } catch (err) {
    throw err;
    console.log(err);
  }
});



// sends to notes.html
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "../Develop/public/notes.html"));
});

// sends to index.html
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../Develop/public/index.html"));
});
// sends to db
app.get("/api/notes", function(req, res) {
  return res.sendFile(path.json(__dirname, "Develop/db/db.json"));
});

// starts server
app.listen(PORT, function() {
  console.log("SERVER IS LISTENING: " + PORT);
});