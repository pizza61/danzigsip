const rp = require("request-promise");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(express.static(path.join(__dirname, "build")))

app.use(cors())

app.get("/stop/:id", (req, res) => {
    rp("http://87.98.237.99:88/delays?stopId="+req.params.id, {
        json: true,
    })
    .then(incoming => {
        rp("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/22313c56-5acf-41c7-a5fd-dc5dc72b3851/download/routes.json", {
            json: true,
        })
        .then(routes => {
            let o = [];
            incoming.delay.forEach((delay, i) => {
                let dat = routes[today()].routes.find(x => x.routeId == delay.routeId);
                let aunil = {
                    route: dat.routeShortName,
                    delay: delay.delayInSeconds,
                    est: delay.estimatedTime,
                    headsign: delay.headsign,
                    vehicleCode: delay.vehicleCode
                }
                o.push(aunil)
            })
            res.send(o);
        })
        
    })
})

function today() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // styczeń is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

app.listen(3069)
console.log("Działa na 3069")