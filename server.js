const express = require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const app = express();
const mongoose=require('mongoose');
app.use(bodyParser.json())
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)
const mongoURI='mongodb+srv://admin:admin@myproject-k2mnz.mongodb.net/test?retryWrites=true&w=majority'
mongoose
    .connect(
        mongoURI,
        {  useUnifiedTopology: true  ,useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))
mongoose.connection.on('connected',()=>{
    console.log('Mongoose is connected');
})
var Users = require('./routes/User')

app.use('/users', Users)
// app.get('/users', (req, res) => {
//     const vusers = [
//         {id: 1, firstName: 'John', lastName: 'Doe'},
//         {id: 2, firstName: 'Brad', lastName: 'Traversy'},
//         {id: 3, firstName: 'Mary', lastName: 'Swanson'},
//     ];
//
//     res.json(users);
// });

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);