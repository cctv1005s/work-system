var request = require('request');

request.post("http://58.246.1.146:59800/Uniwork/web/app.php/CommonAction/4B474742-170A-4D37-83F5-8DE94524444A/2/CommonSync",function(err,req,data){
    console.log(data);
})
.form(JSON.stringify({"TokenID":"57ea292783ba8825088b4567","LastSyncTimestamp":1474965040.4394}));