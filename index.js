const fs = require('fs')
const csv = require('csv-parser')
const fetch = require('cross-fetch');

var totalDeposit=Number(0);
var totalWithdrwal=Number(0);
var BTC=Number(0);
var ETH=Number(0);
var XRP=Number(0);
globalThis.fetch = fetch


fs.createReadStream('transactions.csv').pipe(csv())
.on('data', function(data){
        if(data.transaction_type.includes('DEPOSIT')){
            totalDeposit+=Number(data.amount);
            if(data.token.includes('BTC')){
                BTC+=Number(data.amount);
            }else if(data.token.includes('ETH')){
                ETH+=Number(data.amount);
            }
            else if(data.token.includes('XRP')){
                XRP+=Number(data.amount);
            }
        }else{
            totalWithdrwal+=Number(data.amount);
            if(data.token.includes('BTC')){
                BTC-=Number(data.amount);
            }else if(data.token.includes('ETH')){
                ETH-=Number(data.amount);
            }
            else if(data.token.includes('XRP')){
                XRP-=Number(data.amount);
            }
        }
})
.on('end',function(){
  const response=fetch('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,BTC,XRP&tsyms=USD&api_key=871a821982285e8b881ea19ef986c6c7cae8f01af9ccf58e6b553fcd273ca3c3');
    response .then((response) => response.json())
    .then((responseJSON) => {        
       console.log('Total BTC value (USD):'+BTC*responseJSON['BTC']['USD'])
       console.log('Total XRP value (USD):'+XRP*responseJSON['XRP']['USD'])
       console.log('Total ETH value (USD):'+ETH*responseJSON['ETH']['USD'])
       console.log('Total Portfolio Value (USD):'+(BTC*responseJSON['BTC']['USD']+XRP*responseJSON['XRP']['USD']+ETH*responseJSON['ETH']['USD']))
    });
});  
