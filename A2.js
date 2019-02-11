var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'application/json'});
    
    if (query['cmd'] == undefined)
      throw Error("A command must be specified");
      
    var result = {};
    if (query['cmd'] == 'CalcCharge')
    {
      result = CalcCharge(query);
    }
    else
    {
      throw Error("Invalid command: " + query['cmd']);
    }
 
    res.write(JSON.stringify(result));
    res.end('');
  }
  catch (e)
  {
    var error = {'error' : e.message};
    res.write(JSON.stringify(error));
    res.end('');
  }
}

function CalcCharge(query)
{
  if (query['checkBal'] == undefined || query['checkBal'] <= 0 || isNaN(query['checkBal']))
    throw Error("Invalid value for checking account balance");
  else if (query['savingsBal'] == undefined || query['savingsBal'] <= 0 || isNaN(query['savingsBal']))  
      throw Error("Invalid value for savings account balance"); 
  else if (query['checks'] == undefined || query['checks'] <= 0 || isNaN(query['checks']))  
      throw Error("Invalid value for number of checks used");
      
  var checkBal = parseInt(query['checkBal']);    
  var savingsBal = parseInt(query['savingsBal']);
  var checks = parseInt(query['checks']);   
  var charge;
  
  if(checkBal >= 1000 || savingsBal >= 1500)
  {
    charge = 0;
  } 
  else
  {
    charge = checks * 0.15;
  }
   
  var result = {'Charge' : charge}; 
  return result;
  
}

