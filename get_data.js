const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");

function get_locate_data(url) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: "GET"
        }, 
        function(e,r,b) {
            if(e || !b) { reject(e); }
            resolve(String(b).match(/{'h':.*}/g).map(x => JSON.parse(x.replace(/\d,\d/g, x=>x.replace(/,/, '')).replace(/'/g, '"'))));
        });
    });
}

function get_hour(year, month, day, hour) {
    return new Promise((resolve, reject) => {
        request({
            url: "http://gox.colife.org.tw/wetprf_cosmic2013_gm.aspx?d=" + String(year) + "-" + String(month) + "-" + String(day) + "&h=" + String(hour),
            method: "GET"
        }, 
        function (e,r,b) {
            if(e || !b) { reject(e); }
            const target = String(b).match(/wetprf.*nc/g);
            const loc = String(b).match(/{lat:.*}/g).map(x => x.replace(/{/, '{"').replace(/:/g, '":').replace(/,/, ',"')).map(x => JSON.parse(x));
            loop(target, loc, target.length - 1);
        });
        const ret = [];

        function loop(target, loc, i) {
            if (i < 0) {
                console.log(ret);
                resolve(ret);
            }
            get_locate_data("http://gox.colife.org.tw/" + target[i])
                .then(value => ret.push(concat(value, loc[i])))
                .catch(err => console.log(err));
            setTimeout(loop, 1000, target, loc, i - 1);
        }

        function concat(a, loc) {
            a['lat'] = loc['lat'];
            a['lng'] = loc['lng'];
        }
    });
}
 
async function get_day(year, month, day) {
    const ret = {"year": year, "year": year, "month": month, "day": day};
    for (var i = 1;i <= 24;++i) {
        ret[String(i)] = await get_hour(year, month, day, i);
    }
    return ret;

}

/*
get_locate_data("http://gox.colife.org.tw/wetprf_cosmic2013_chart.aspx?fn=wetPrf_C002.2007.044.00.58.G02_2013.3520_nc").then(function(result) {
    console.log(result);
});
*/
get_hour(2010, 6, 2, 15)
    .then(value => console.log(value))
    .catch(err => console.log);
    
