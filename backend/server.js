require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
// const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());

// Add CSP headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:*"
  );
  next();
});
// app.use(express.static(path.join("__dirname", "dist")));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
});
const Note = mongoose.model("Note", noteSchema);

app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});
app.post("/notes", async (req, res) => {
  const note = new Note({ text: req.body.text });
  await note.save();
  res.status(201).json(note);
});
app.put("/notes/:id", async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true }
  );
  if (!note) return res.status(404).send("Note not found");
  res.json(note);
});
app.delete("/notes/:id", async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) return res.status(404).send("Note not found");
  res.status(204).send();
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
