module.exports = function(req, res, next) {
    console.log(req.headers);
    req.rawBody = '';
    req.setEncoding('utf8');

      req.on('data', function(chunk) { 
        req.rawBody += chunk;
      });

      req.on('end', function() {
        console.log(req.rawBody);  
        next();
      });
}