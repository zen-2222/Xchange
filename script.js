
const selectBoxFrom=document.querySelector('.form__select--base');
const selectBoxTo=document.querySelector('.form__select--target');

const btn=document.querySelector('.button--swap');

const currencyValueFrom=document.querySelector('.form__input--base');
const currencyValueTo=document.querySelector('.form__input--target');

const textShowcase=document.querySelector('showcase__currencies');

const currencies= await getCurrencies();
let exchangeRates,exchangeRate,swapFlag=0;
//////////////////////////////////

async function getCurrencies() {
    const currenciesPromise = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json');
    return currenciesPromise.json();
    

}



function makeOptionsHTML(currencies) {
    let html='';
    for(const [key,e] of Object.entries(currencies)){
        html+=`<option value="${key}">(${key.toUpperCase()}) - ${e}</option>`;
    


}
    return html;
}

(function addSelectOptions(){
    selectBoxFrom.insertAdjacentHTML("beforeend",makeOptionsHTML(currencies));
    selectBoxTo.insertAdjacentHTML("beforeend",makeOptionsHTML(currencies));

})();

async function getExchangeRates(from,to){
    if(!from) {currencyValueFrom.value="Please select a valid currency";return;}
    if(!to) {currencyValueTo.value="Please select a valid currency";return;}

    const exchangeRatesPromise = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`);
    exchangeRates = await exchangeRatesPromise.json();
    exchangeRate = exchangeRates[from][to];
    return exchangeRate; 
}


selectBoxFrom.addEventListener('change',(e)=>{
    if(!e.target.closest('.form__select')) return;
    
    getExchangeRates(selectBoxFrom.value,selectBoxTo.value);

});


selectBoxTo.addEventListener('change',(e)=>{
    if(!e.target.closest('.form__select')) return;
    
    getExchangeRates(selectBoxFrom.value,selectBoxTo.value);
});


// Swap Functionality
btn.addEventListener('click',(e)=>{

    if(!e.target.closest('.button--swap')) return;
// Swap fields
 [selectBoxFrom.value,selectBoxTo.value,currencyValueFrom.value,currencyValueTo.value]= [selectBoxTo.value,selectBoxFrom.value,currencyValueTo.value,currencyValueFrom.value];

 
 swapFlag= !swapFlag;
});

(function addInputListeners(){
currencyValueFrom.addEventListener('input',e=>{
    if(!e.target.closest('.form__input--base'))return;

    currencyValueTo.value= !swapFlag ? (+currencyValueFrom.value) * exchangeRate :(+currencyValueFrom.value) / exchangeRate; 
    if(!+currencyValueTo.value) currencyValueTo.value="Please enter a valid currency";

});

currencyValueTo.addEventListener('input',e=>{
    if(!e.target.closest('.form__input--target'))return;

    currencyValueFrom.value= !swapFlag ? (+currencyValueTo.value) / exchangeRate :(+currencyValueTo.value) * exchangeRate; 
    if(!+currencyValueFrom.value) currencyValueFrom.value="Please enter a valid currency";


});
})();

document.querySelectorAll('.form__select-styling').forEach(e=>e.addEventListener('click',x=>{
    const tar=x.target.closest('.form__select-styling');
    if(!tar) return;

    tar.querySelector('.form__select').showPicker();
}));