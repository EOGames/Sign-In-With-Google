const express = require('express');
require('dotenv').config();
const app = express();
const routes = require('./routes/routes')
const port = process.env.PORT_SERVER_BACKEND;


const cors = require('cors');




app.use(cors());
//adding middleware for routes
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server Is Up and Running On ${port}`);
});
