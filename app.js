const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Brogrammer app is running at http://localhost:${port}/`)
})




app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(router)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});