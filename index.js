require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");
const { response } = require("express");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/contacts", (req, res) => {
  Contact.find({}).then((contacts) => {
    res.json(contacts);
  });
});

app.post("/api/contacts", (req, res) => {
  const { name, number } = req.body;
  const contact = new Contact({name, number});

  contact.save().then((savedContact) => {
    res.status(200).json(savedContact);
  });
});

app.get("/api/contacts/:id", (req, res, next) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.put("/api/contacts/:id", (req, res, next) => {
  const { name, number } = req.body;
  Contact.findByIdAndUpdate(req.params.id, { name, number }, { new: true })
    .then((updatedContact) => {
      res.json(updatedContact);
    })
    .catch((err) => next(err));
});

app.delete("/api/contacts/:id", (req, res, next) => {
  Contact.findByIdAndRemove(req.params.id)
    .then((response) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

const errHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "Malformatted ID" });
  }
  next(err);
};

app.use(errHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
