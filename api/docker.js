const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
var dockerCLI = require("docker-cli-js");
var DockerOptions = dockerCLI.Options;
var Docker = dockerCLI.Docker;
var options = new DockerOptions(null, "./");
var docker = new Docker(options);
const getPort = require("get-port");
router.get("/", (req, res) => {
  docker
    .command("ps -a")
    .then(function(data) {
      res.json(data);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

router.post("/create", async (req, res) => {
  const name = req.body.name;
  const port = await getPort();
  if (!name) {
    res.send("No Container name provided");
  }
  docker
    .command(`run --name ${name} -d -p ${port}:80 nginx`)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

router.post("/stop", (req, res) => {
  const id = req.body.id;
  if (!id) {
    res.send("No Container id provided");
  }
  docker
    .command(`stop ${id}`)
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});
module.exports = router;
