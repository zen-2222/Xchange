const selectLabel=document.querySelectorAll('.form__label');
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


selectBoxFrom.addEventListener('change',(e)=>{
    if(!e.target.closest('.form__select')) return;
    
    



});





// Swap Functionality
btn.addEventListener('click',(e)=>{

    if(!e.target.closest('.button--swap')) return;

 [selectBoxFrom.value,selectBoxTo.value]= [selectBoxTo.value,selectBoxFrom.value];
 


});




