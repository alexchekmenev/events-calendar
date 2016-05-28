var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/calendar", {
    "server": {
        "socketOptions": {
            "keepAlive": 1
        }
    }
});

module.exports = mongoose;