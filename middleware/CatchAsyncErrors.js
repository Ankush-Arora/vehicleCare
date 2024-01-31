module.exports = (theFunction) => (req, resp, next) => {
    Promise.resolve(theFunction(req, resp, next)).catch(next);
}