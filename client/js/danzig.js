document.getElementById("map").style.height = window.innerHeight - 32 + 'px';
let map = L.map('map').setView([54.382, 18.598], 18)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
fetch("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json")
    .then(resp => resp.json())
    .then(stops => {
        stops[today()].stops.forEach((stop, i) => {
            if (stop.zoneName == "Gdańsk" || stop.zoneName == "Sopot") {
                let marker = L.marker([stop.stopLat, stop.stopLon])
                    .addTo(map)
                    .bindPopup(`<b>${stop.stopDesc}</b> ${stop.stopCode}<br><b>ID</b> ${stop.stopId}<br><button onclick="load(${stop.stopId}, '${stop.stopDesc}')">Pokaż</button>`)
            }
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
document.getElementById("clocc").innerText = timed();

setInterval(function() {
    document.getElementById("clocc").innerText = timed();
}, 500)
function load(stop, name) {
    document.getElementsByClassName("message")[0].innerText = "Ładowanie..."
    fetch("http://localhost:3069/stop/" + stop)
        .then(resp => resp.json())
        .then(data => {
            document.getElementById("select").style.display = 'none';
            document.getElementById("info").style.display = 'block';
            let infoB = document.getElementById("tramwajas");
            
            while (infoB.firstChild) {
                infoB.removeChild(infoB.firstChild);
            }
            document.getElementById("stop").innerText = name;
            if (data.length > 0) {
                data.forEach(route => {
                    let n = document.createElement("div");
                    n.className = "odjazd"

                    let b = document.createElement("b");
                    b.className = "bLinia"
                    b.innerText = route.route;
                    n.appendChild(b);

                    let kierunek = document.createElement("span");
                    kierunek.className = "bKierunek"
                    kierunek.innerText = route.headsign;
                    n.appendChild(kierunek);

                    // route.est: czas w ktorym spodziewamy sie
                    // za: za ile ma przyjechac
                    let t1 = moment(timed(), "hh:mm");
                    let t2 = moment(route.est, "hh:mm");
                    let t3 = moment(t2.diff(t1)).format("mm");
                    let spodz = document.createElement("span");
                    spodz.className = "bEst"
                    spodz.innerText = t3+" min";
                    if(t3 == 0 || t3 == 59 || t3 == 58) {
                        spodz.innerText = ">>>>>>"
                    }
                    n.appendChild(spodz)

                    infoB.appendChild(n)

                    // i tu sie zaczyna
                    
                    let c = setInterval(function() {
                        let t1 = moment(timed(), "hh:mm");
                        let t2 = moment(route.est, "hh:mm");
                        let t3 = moment(t2.diff(t1)).format("mm");
                        
                        spodz.innerText = t3+" min";
                        if(t3 == "00" || t3 == "59" || t3 == "58") {
                            spodz.innerText = ">>>>>>"
                        }
                        if((moment(t2.diff(t1))) < 0) {
                            clearInterval(c);
                            load(stop, name);
                        }
                    }, 500)
                    
                })
            } else {
                let n = document.createElement("div");
                n.innerText = "Pusto"
                infoB.appendChild(n)
            }

        })
}

function timed() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();

    h = checkTime(h);
    m = checkTime(m);

    return h+":"+m;
}
function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }
    return i;
}
