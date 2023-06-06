const express = require("express");
const app = express();
const port = process.env.PORT || 2000;

app.get("/", (req, res) => {
    res.send("old-school");
})

app.listen(port, ()=>{
    console.log(`Old-school listening on port: ${port}`);
})