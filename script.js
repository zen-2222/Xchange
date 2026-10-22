const selectLabelFrom=document.querySelector('.form__label--base');
const selectLabelTo=document.querySelector('.form__label--target');
const selectBoxFrom=document.querySelector('.form__select--base');
const selectBoxTo=document.querySelector('.form__select--target');

const btn=document.querySelector('.button--swap');

const currencyValueFrom=document.querySelector('.form__input--base');
const currencyValueTo=document.querySelector('.form__input--target');

const textShowcase=document.querySelector('showcase__currencies');

//////////////////////////////////

async function getCurrencies() {
    const currenciesPromise = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json');
    return currenciesPromise.json();
    

}

const currencies= await getCurrencies();
let exchangeRates,exchangeRate,swapFlag=0;
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

    const exchangeRatesPromise = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`);
    exchangeRates = await exchangeRatesPromise.json();
    exchangeRate = exchangeRates[from][to];
    return exchangeRate; 
}

selectBoxFrom.addEventListener('change',(e)=>{
    if(!e.target.closest('.form__select')) return;
    
    selectLabelFrom.remove();
    getExchangeRates(selectBoxFrom.value,selectBoxTo.value);

});


selectBoxTo.addEventListener('change',(e)=>{
    if(!e.target.closest('.form__select')) return;
    
    selectLabelTo.remove();
    getExchangeRates(selectBoxFrom.value,selectBoxTo.value);



});

// Swap Functionality
btn.addEventListener('click',(e)=>{

    if(!e.target.closest('.button--swap')) return;

 [selectBoxFrom.value,selectBoxTo.value]= [selectBoxTo.value,selectBoxFrom.value];
 swapFlag= !swapFlag;


});


currencyValueFrom.addEventListener('change',e=>{
    if(!e.target.closest('.form__input--base'))return;

    currencyValueTo.value= !swapFlag ? (+currencyValueFrom.value) * exchangeRate :(+currencyValueFrom.value) / exchangeRate; 


});

currencyValueTo.addEventListener('change',e=>{
    if(!e.target.closest('.form__input--target'))return;

    currencyValueFrom.value= !swapFlag ? (+currencyValueTo.value) / exchangeRate :(+currencyValueTo.value) * exchangeRate; 


});


