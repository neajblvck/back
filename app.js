   require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/config');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');



// app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);


// // Middleware rate limit pour limiter les requêtes
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 15 minutes
  max: 500, // Limite de requêtes par IP pendant la période spécifiée
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
});

// Middleware pour limiter les requêtes
app.use(limiter);

// Utilisation de Helmet pour la sécurité
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdnjs.cloudflare.com'],
    },
  })
);

mongoose.set('strictQuery', false);  // Pour désactiver strictQuery


// Gestion de CORS
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:8080';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Configuration de la base de données MongoDB
mongoose
  .connect(`mongodb+srv://${config.db.user}:${config.db.password}@${config.db.name}.${config.db.host}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée.. !', err));

// Utilisation de bodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Routes
const productRoute = require('./router/product');
const printRoute = require('./router/print');
const userRoute = require('./router/user');
const contentRoute = require('./router/content');
const serviceRoute = require('./router/service');
const chatRoute = require('./router/chat');

app.use('/api/content', contentRoute);
app.use('/api/auth', userRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/print', printRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/service', serviceRoute);
app.use('/chat', chatRoute);

// Middleware Multer
const multer = require('multer');
app.use(multer().single('photos'));

module.exports = app;
