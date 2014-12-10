module.exports = function (req, res, next) {
    console.log("=== Request ===");
    console.log(req.url);
    console.log(req.headers);
    next();
/*
    req.rawBody = '';
    req.setEncoding('utf8');

    req.on('data', function (chunk) {
        req.rawBody += chunk;
    });

    req.on('end', function () {
        console.log(req.rawBody);
        next();
    });
*/

/*
    res.on('data', function (chunk) {
        console.log('RRRRR');
        res.rawBody += chunk;
    });
    
    res.on('finish', function () {
        console.log("=== Response ===");
        console.log(res.rawBody);
        next();
    });*/
}