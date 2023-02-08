const express = require("express");
require("./db/mongoose");
const subs = require("./routers/subs");
const users = require("./routers/users");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(subs);
app.use(users);

app.listen(port, () => {
    console.log(`Server is up in ${port}`)
});