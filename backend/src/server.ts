import express from 'express';
import morgan from 'morgan';
import path from 'path'
import 'express-async-errors'
import errorHandler from './errors/handler'
import cors from 'cors'

import routes from './routes'

import './database/connection'

const app = express();

app.use(cors())
app.use(express.json())
app.use(morgan('combined'))
app.use(routes)
app.use('/uploads', express.static(path.join(__dirname,'..', 'uploads')))
app.use(errorHandler)



app.listen(3333);