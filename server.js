const express = require("express")
const formController = require("./controllers/formController")

const app = express()

// Setting template engine
app.set('view engine', 'ejs')


// Serving static files
app.use(express.static('./public'))


// Controllers
formController(app)

// Listening to a port
app.listen(3000)
console.log('Server running at port 3000...')