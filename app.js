require('dotenv').config();
 const express = require('express');
 const app = express();
 const mongoose = require('mongoose');
 const config = require('./config/config');
 const path = require('path');



//  const product = require('./models/product.js');
 const bodyParser = require('body-parser');
 const productRoute = require('./router/product');
 const userRoute = require ('./router/user');
 const contentRoute = require ('./router/content');
 const serviceRoute = require ('./router/service');
 const chatRoute = require ('./router/chat');

  
//  gestion de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

 mongoose.connect(`mongodb+srv://${config.db.user}:${config.db.password}@${config.db.name}.${config.db.host}`,
 { useNewUrlParser: true,
   useUnifiedTopology: true })
 .then(() => console.log('Connexion à MongoDB réussie !'))
 .catch(() => console.log('Connexion à MongoDB échouée.. !'));


 app.use(bodyParser.json());
 app.use('/api/content', contentRoute);
 app.use('/api/auth', userRoute);
 app.use('/api/users', userRoute)
 app.use('/api/products', productRoute);
 app.use('/images', express.static(path.join(__dirname, 'images')));

 app.use('/api/service', serviceRoute)
 app.use('/chat', chatRoute);


 // test
const multer = require('multer')
 app.use(multer().single('photos'))

      module.exports= app; 