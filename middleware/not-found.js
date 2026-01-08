const notFound = (req, res) => res.status(404).send("route doesn't exists");

module.exports = notFound;