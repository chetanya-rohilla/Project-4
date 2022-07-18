// import express package(commonJS syntax)
const express = require('express')
const bodyParser = require('body-parser');
const route = require('./routes/route');
const  mongoose = require('mongoose');
// instatiate the express app  
const app = express()
app.use(bodyParser.json());  
   
mongoose.connect("mongodb+srv://mn-pandey:9219591303Am%40n@cluster0.mov0c.mongodb.net/group55Database")
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);

const PORT = process.env.PORT || 3000
// Listen for incoming requests
app.listen(PORT, () => console.log(`server started, listening PORT ${PORT}`))