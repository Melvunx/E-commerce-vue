const router = require("express").Router();

router.get("/user", (req, res) => {
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ message: "Not autentificated" });
});

module.exports = router;
