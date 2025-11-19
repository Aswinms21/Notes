import { useState, useEffect } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  const addNote = () => {
    fetch("http://localhost:5000/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newNote }),
    })
      .then((res) => res.json())
      .then((note) => setNotes([...notes, note]));
    setNewNote("");
  };

  const deleteNote = (id) => {
    fetch(`http://localhost:5000/notes/${id}`, { method: "DELETE" }).catch(
      (err) => console.error("Error deleting note:", err)
    );
    setNotes(notes.filter((note) => note._id !== id));
  };

  return (
    <div>
            <h1>Notes</h1>     
      <input
        placeholder="Add Note"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
      />
            <button onClick={addNote}>Add</button>     
      <ul>
               
        {notes.map((note) => (
          <li key={note._id}>
                        {note.text}    
            <button onClick={() => deleteNote(note._id)}>Delete</button>       
             
          </li>
        ))}
             
      </ul>
         
    </div>
  );
}

export default App;
