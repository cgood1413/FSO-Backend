const { response } = require("express");
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors());
app.use(express.json());
app.use(express.static('build'))
app.use(morgan('tiny'));

app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

app.post("/api/contacts", (req, res) => {
  const id = contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) : 0;
  const contact = req.body;
  const { name, number } = contact;
  const hasName = contacts.some((contact) => {
    const regex = new RegExp(name, "i");
    return regex.test(contact.name);
  });
  if (!name || !number) {
    return res
      .status(400)
      .send({ error: "Name and number are both required." });
  } else if (hasName) {
    return res.status(400).send({error: 'That name already exists in your contacts'})
  }

  contact.id = id + 1;
  contacts = contacts.concat(contact);
  res.status(200).json(contact);
});

app.put("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  let contact = contacts.find(contact => contact.id === id);
  if (contact) {
    contact = {...contact, number: req.body.number}
    return res.json(contact);
  }
  res.status(404).send(`No contacts found with ID of ${id}`);
});

app.get("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  const contact = contacts.find((contact) => contact.id === id);
  if (contact) {
    return res.json(contact);
  }
  res.status(404).send(`No contacts found with ID of ${id}`);
});

app.delete("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);
  res.status(204).end();
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${contacts.length} contacts</p>
    <p>${new Date()}</p>`);
});

app.listen(PORT, () => {
  `Server listening on port ${PORT}.`;
});
