var express = require('express');
var app = express();
const hbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')
var bodyParser = require("body-parser");
var session = require('express-session')
const mongoose =require('mongoose');
const uri = "mongodb+srv://traz08102003:vrRJOA6nqwODzFmz@cp17303.4gzmzyt.mongodb.net/Cp17303?retryWrites=true&w=majority";
app.use(bodyParser.urlencoded({ extended: false }));
 mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(console.log('kết nối thành công'));
app.use(session({
    secret: 'trafdual',
    resave: false,
    saveUninitialized: true
}));

app.engine('.hbs', hbs.engine({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/layouts/",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', '.hbs');
app.set('views', './views');
const sanphamModal=require('./SanPhamModel')

app.get('/', async (req, res) => {
    const data = await sanphamModal.find().lean()
  
    res.render('home', { data })
  })
  app.get('/add', function(req, res){
    res.render('add')
})
  // Route to handle "Add" form submission
  app.post('/add', async (req, res) => {
    const {  tenSP, giaSP,soluongSP } = req.body
    const newDoc = new sanphamModal({  tenSP, giaSP,soluongSP })
    await newDoc.save()
    res.redirect('/')
  })
  
  // Route to handle "Edit" form submission
  app.post('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    // Update data in MongoDB based on ID
    sanphamModal.findByIdAndUpdate(id, newData)
      .then(() => {
        res.redirect('/');
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Internal server error');
      });

  })
  app.get('/edit/:id', async(req, res)=>{
    const id = req.params.id;
    // Retrieve data from MongoDB based on ID
    sanphamModal.findById(id)
      .then(data => {
        // Render the edit view template with the retrieved data
        res.render('edit', { data });
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Internal server error');
      });
})
  // Route to handle "Delete" request
  app.post('/delete/:id', async (req, res) => {
    const id = req.params.id
    await sanphamModal.findByIdAndDelete(id)
    res.redirect('/')
  })
  
  app.listen(8080, () => console.log('Server is running on port 8080...'))

  