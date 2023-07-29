import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import mongoose from 'mongoose';


const app = express();

app.use(cors({
	credentials: true
}));
app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

const port = 8080;

server.listen(port, () => {
	console.log(`Server listening on port http://localhost:${port}`);
})

const MONGO_URL = "mongodb+srv://femi:femi@cluster0.8pjgts3.mongodb.net/?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));