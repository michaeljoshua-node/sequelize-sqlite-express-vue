// server.js

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Users API Sqlite",
      description: "Customer API Information",
      contact: {
        name: "Amazing Developer"
      },
      //servers: ["http://localhost:3000"]
      servers: [
        {
          "url": "http://localhost:3000",
          "description": "Development server"
        },
        {
          "url": "http://123.0.0.1:3000",
          "description": "Staging server"
        },
        {
          "url": "http://localhost:3000",
          "description": "Production server"
        }
      ]
    }
  },
  // ['.routes/*.js']
  apis: ["server.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));


/**
 * @swagger
 * /api/contacts:
 *  get:
 *    description: Use to request all contacts
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get('/api/contacts', (req, res) => {
  return db.Contact.findAll()
    .then((contacts) => res.send(contacts))
    .catch((err) => {
      console.log('There was an error querying contacts', JSON.stringify(err))
      return res.send(err)
    });
});


/**
 * @swagger
 * /api/contacts:
 *  post:
 *    description: Creates a new contact
 *    consumes:
 *     - "application/json"
 *    produces:
 *     - application/json
 *    parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "New Contact object to be stored"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/Contact"
 *    responses:
 *      '200':
 *        description: A successful response
 * definitions: 
 *     Contact:
 *       type: "object"
 *       required:
 *       - "firstName"
 *       - "lastName"
 *       - "phone"
 *       properties:
 *        firstName:
 *          type: "string"
 *          example: "Sultan"
 *        lastName:
 *          type: "string"
 *          example: "Mehmed-II"
 *        phone:
 *          type: "string"
 *          example: "1234512345"  
 */
app.post('/api/contacts', (req, res) => {
  const { firstName, lastName, phone } = req.body
  return db.Contact.create({ firstName, lastName, phone })
    .then((contact) => res.send(contact))
    .catch((err) => {
      console.log('***There was an error creating a contact', JSON.stringify(contact))
      return res.status(400).send(err)
    })
});


app.put('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id)
  return db.Contact.findById(id)
  .then((contact) => {
    const { firstName, lastName, phone } = req.body
    return contact.update({ firstName, lastName, phone })
      .then(() => res.send(contact))
      .catch((err) => {
        console.log('***Error updating contact', JSON.stringify(err))
        res.status(400).send(err)
      })
  })
});



/**
 * @swagger
 * /api/contacts/{contactId}:
 *  delete:
 *    description: Deletes a new contact
 *    parameters:
 *     - in: "path"
 *       name: "contactId"
 *       required: true
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: "Invalid ID supplied"
 *      '404':
 *        description: "Contact not found"
 */
app.delete('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id)
  return db.Contact.findById(id)
    .then((contact) => contact.destroy({ force: true }))
    .then(() => res.send({ id }))
    .catch((err) => {
      console.log('***Error deleting contact', JSON.stringify(err))
      res.status(400).send(err)
    })
});



app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
