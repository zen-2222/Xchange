// TODO:
// 1> make the logic understandable, understand the logic
// 2> add a readme
// 3> fix the logic > 
// 4> fix HTML
// 5> fix swap arrow



const selectBoxFrom=document.querySelector('.form__select--base');
const selectBoxTo=document.querySelector('.form__select--target');

const btn=document.querySelector('.button--swap');

const currencyValueFrom=document.querySelector('.form__input--base');
const currencyValueTo=document.querySelector('.form__input--target');

const textShowcase=document.querySelector('.showcase__currencies');

const currencies= await getCurrencies();
textShowcase.textContent=`${Object.keys(currencies).length} currencies.`
let exchangeRates,exchangeRate,swapFlag=0;
//////////////////////////////////

async function getCurrencies() {
    try{
    const currenciesPromise = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json');
    return currenciesPromise.json();
    }
    catch(err) {alert("API Currently Offline");}

}



function makeOptionsHTML(currencies) {
    let html='';

    for(const [key,e] of Object.entries(currencies)){
        html+=`<option value="${key}">(${key.toUpperCase()}) - ${e}</option>`;
    }
    return html;
}

function addSelectOptions(){
    const html=makeOptionsHTML(currencies);
    selectBoxFrom.insertAdjacentHTML("beforeend",html);
    selectBoxTo.insertAdjacentHTML("beforeend",html);

};

addSelectOptions();

async function getExchangeRates(from,to){
    try{
    if(!from) {currencyValueFrom.value="Please select a valid currency";return;}
    if(!to) {currencyValueTo.value="Please select a valid currency";}

    const exchangeRatesPromise = await Promise.any([fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`),fetch(`https://latest.currency-api.pages.dev/v1/currencies/${from}.json`)]);
    
    exchangeRates = await exchangeRatesPromise.json();
    
    exchangeRate = exchangeRates[from][to];
    
}catch(err){} 
}


selectBoxFrom.addEventListener('input',(e)=>{
    if(!e.target.closest('.form__select')) return;
    
    getExchangeRates(selectBoxFrom.value,selectBoxTo.value);
    swapFlag=0;
    calculateExchangeValue(currencyValueTo,currencyValueFrom);

});

function getRate(from,to){
    if(!from) return;

    exchangeRate = exchangeRates[from][to];
}

selectBoxTo.addEventListener('change',(e)=>{
    if(!e.target.closest('.form__select')) return;
    
    getRate(selectBoxFrom.value,selectBoxTo.value);
    swapFlag=0;

    calculateExchangeValue(currencyValueFrom,currencyValueTo);
});


// Swap Functionality
btn.addEventListener('click',(e)=>{

    if(!e.target.closest('.button--swap')) return;

    // Swap fields
    [selectBoxFrom.value,selectBoxTo.value,currencyValueFrom.value,currencyValueTo.value] = [selectBoxTo.value,selectBoxFrom.value,currencyValueTo.value,currencyValueFrom.value];

 
    swapFlag= !swapFlag;
});


function calculateExchangeValue(input1,input2,directionFlag){

    input1.value= (directionFlag ^ swapFlag) ? ((+input2.value) * exchangeRate) : ((+input2.value) / exchangeRate); 
    
    if(!+input1.value && +input1.value!=0 ) {input1.value="Please enter a valid currency";return;};
    input1.value=Number.parseFloat(input1.value).toFixed(3);



}
function addInputListeners(){
currencyValueFrom.addEventListener('input',e=>{


    calculateExchangeValue(currencyValueTo,currencyValueFrom,1);
});

currencyValueTo.addEventListener('input',e=>{

    calculateExchangeValue(currencyValueFrom,currencyValueTo,0);


});
};

addInputListeners();



document.querySelectorAll('.form__select-styling').forEach(e=>e.addEventListener('click',x=>{
    const tar=x.target.closest('.form__select-styling');
    if(!tar) return;

    tar.querySelector('.form__select').showPicker();
}));