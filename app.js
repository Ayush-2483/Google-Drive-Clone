const express = require('express');
const userRouter = require('./routes/user.routes');
const dotenv = require('dotenv');
const connectToDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

const indexRouter = require('./routes/index.routes');
const fileRouter = require('./routes/file.routes');

app.set('view engine', 'ejs');

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);

app.use('/user', userRouter);

app.use('/', fileRouter);

const port = process.env.PORT || 3010;

connectToDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(() => {
        process.exitCode = 1;
    });