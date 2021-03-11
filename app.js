const express = require('express');
const api=require('./api');
// const { urls }   = require('./urls_data');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({extended:true}))
// the above 2 commands are for post requests, its gives the response in json and string format respectively.
app.use(express.static('public')) // to use static files like index.html


app.use('/api', api);

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.listen(port, () => {
  console.log(`Server listening at port: ${port}`)
});