ds = deepstream('52.29.184.11:6020').login({}, onConnected );
var symbols = [
	"MMM",
	"ABT",
	"ABBV",
	"ACN",
	"ACE",
	"ATVI",
	"ADBE",
	"ADT",
	"AAP",
	"AES",
	"AET",
	"AFL",
	"AMG",
	"A",
	"GAS",
	"APD",
	"ARG",
	"AKAM",
	"AA",
	"AGN",
	"ALXN",
	"ALLE",
	"ADS",
	"ALL",
	"GOOGL",
	"GOOG",
	"ALTR",
	"MO",
	"AMZN",
	"AEE",
	"AAL",
	"AEP",
	"AXP",
	"AIG",
	"AMT",
	"AMP",
	"ABC",
	"AME",
	"AMGN",
	"APH",
	"APC",
	"ADI",
	"AON",
	"APA",
	"AIV",
	"AAPL",
	"AMAT",
	"ADM",
  "AIZ"];

function onConnected() {
  var count = 20;

  for(var i = 0; i < symbols.length; i++){
    var symbol = symbols[i];
    var record = ds.record.getRecord( 'sp500/'+symbol);
    record.subscribe( 'company_name', function( companyName ){
        console.log("company-name: "+companyName);
        //$( '.company-name' ).text( companyName );
           
        record.subscribe( 'last_price', function( lastPrice ){
            console.log("lastPrice: "+lastPrice);
            //$( '.price' ).text( Number( lastPrice ).toFixed( 2 ) );
          });


      });

     }
  }