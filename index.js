if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');

const cookieParser = require('cookie-parser');

const session = require('express-session');

const path = require('path');

const flash = require('connect-flash');

const formRoute = require('./routes/addMovie');
const postFormRoute = require('./routes/postAddMovie');
const editFormRoute = require('./routes/editMovie');
const getProducts = require('./routes/products');
const postEditRoute = require('./routes/postEdit');
// const getLangRoute = require('./routes/getLanguage');
const loginRoute = require('./routes/login');
const postLoginRoute = require('./routes/postLogin');
const registerRoute = require('./routes/register');
const postRegisterRoute = require('./routes/postRegister');
const postLogoutRoute = require('./routes/logout');

const cors = require('cors'); // Import the cors middleware

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Use cors middleware
app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.set('views', 'views');

const baseUrl = "https://mateys.xyz/h4kig_api/connection/";

let selectFunction = (item) => {
  let options = {
    method: "POST",
    url: baseUrl + "select.php",
    formData: {
      select_query: item,
    },
  };
  return options;
};

app.enable("trust proxy");

app.use(cookieParser());

app.use(session({
  secret: 'jsfuytweyftwy@1234#',
  resave: false,
  proxy: true,
  saveUninitialized: true,
  cookie: { secure: true, sameSite: "none", httpOnly: true },
}));

// Middleware to set the default language to French ('fr')
app.use((req, res, next) => {
  req.cookies.email = req.cookies.email || '';
  // req.cookies.isLoggedIn = req.cookies.isLoggedIn || 'false';
  // req.session.isLoggedIn = req.session.isLoggedIn || req.cookies.isLoggedIn || 'false';
  req.session.user = req.session.user || req.cookies.email || '';
  req.session.isLoggedIn = req.session.isLoggedIn || 'false';
  // req.session.user = req.session.user || '';
  next();
});

app.use((req, res, next) => {
  // console.log(req.session.user);
  if (!req.session.user) {
    return next();
  }

  else {
    let opt1 = selectFunction(
      "select * from user where email = '"
      .concat(`${req.session.user}`)
      .concat("' limit 10 offset 0")
    );

    request(opt1, async (error, response) => {
      if (error) throw new Error(error);
      else {
        let x = JSON.parse(response.body);
        // console.log(x);

        if (x.length >= 1) {
          req.user = x[0];
          return next();
        }

        else {
          console.log("error");
        }
      }
    })
  }
})


app.use(flash());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/v1', formRoute);

app.use('/v1', postFormRoute);

app.use('/v1', getProducts);

app.use('/v1', editFormRoute);

app.use('/v1', postEditRoute);

// app.use('/v1', getLangRoute);

app.use('/', loginRoute);

app.use('/v1', postLoginRoute);

app.use('/v1', registerRoute);

app.use('/v1', postRegisterRoute);

app.use('/v1', postLogoutRoute);

app.listen(4000, () => {
    console.log("Listening to localhost PORT 4000...");
})