const express = require("express");
const server = express();
const postsRouter = require("./routers/posts-router");

server.use(express.json());
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2>Lambda Posts API</h2>
    <p>Welcome to the Lambda Posts API</p>
  `);
});

server.listen(5000, () => {
  console.log("\n*** Server running on http://localhost:5000 ***\n");
});
