const express = require('express');
const userRouter = require('./routes/user.routes');
const dotenv = require('dotenv');
const connectToDB = require('./config/db');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

const app = express();

const indexRouter = require('./routes/index.routes');
const fileRouter = require('./routes/file.routes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const dbConnection = connectToDB();

app.use(async (req, res, next) => {
    try {
        await dbConnection;
        next();
    } catch (error) {
        next(error);
    }
});

app.use('/', indexRouter);

app.use('/user', userRouter);

app.use('/', fileRouter);

if (require.main === module) {
    const port = process.env.PORT || 3010;

    dbConnection
        .then(() => {
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        })
        .catch(() => {
            process.exitCode = 1;
        });
}

module.exports = app;