const express = require("express")
const fileUpload = require("express-fileupload")
const morgan = require("morgan")
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser")
const _ = require("lodash")
const { response } = require("express")
const path = require('path')

const readXlsxFile = require('read-excel-file')
const mongoose = require("mongoose")
const router = require("./routes/routes")

// Mongoose modules
mongoose.connect('mongodb://localhost:27017/Vendor', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.once('open', () => {
    console.log("Connected to mongo db");
})

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(fileUpload({
    createParentPath: false,
    tempFileDir: true
}))
app.use(cors())
app.use("/api/v1", router)

app.listen(
    9000,
    () => console.log("Server is up and running")
)