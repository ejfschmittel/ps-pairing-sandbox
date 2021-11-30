var bodyParser = require('body-parser')

let list = ['Mike', 'Standish', 'hello_world'];

module.exports = function(app) {
    app.use(bodyParser.json())

    app.get('/list', (req, res) => {
        res.json(list)
    })

    app.post('/list', (req, res) => {
        if (Math.random() > .5) {
       
            list = req.body;
            res.json(list);
        } else {
            res.status(500);
            res.end();
        }
    })
}