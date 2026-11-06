const selectBoxFrom =document.querySelector('.form__select--base') as HTMLSelectElement;
const selectBoxTo=document.querySelector('.form__select--target') as HTMLSelectElement;

const btn=document.querySelector('.button--swap') as HTMLElement;

const currencyValueFrom=document.querySelector('.form__input--base') as HTMLInputElement;
const currencyValueTo=document.querySelector('.form__input--target') as HTMLInputElement;

const textShowcase=document.querySelector('.showcase__currencies') as HTMLElement;

const errorText = document.querySelector('.error') as HTMLParagraphElement;

const currencies : Record<string,string> | null = await getCurrencies(); // Record<string,string> will crate object with all string keys and string values


textShowcase.textContent=`${currencies ? Object.keys(currencies).length : '300'} currencies.`;






if(!currencies) throw new Error();

async function getCurrencies() {
    try{
        let currenciesPromise = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json');
        
        if (!currenciesPromise.ok) {
            currenciesPromise = await fetch(`https://latest.currency-api.pages.dev/v1/currencies.json`);
            
            if(!currenciesPromise.ok) throw new Error();
        }
        
        return currenciesPromise.json();
    }
    catch(err) {showError(`Couldnt connect to API!`,3)}

}

type ExchangeRates={
    date:string
} & {
    [key:string] : {[cur : string]:number},
}


let exchangeRates : ExchangeRates ,exchangeRate : number | undefined ,swapFlag:boolean=false,highestPriorty=0;
//////////////////////////////////////////
function makeOptionsHTML(currencies : Record<string,string>){
    let html='';

    for(const [shortName,fullName] of Object.entries(currencies)){
        html+=`<option value="${shortName}">(${shortName.toUpperCase()}) - ${fullName}</option>`;
    }
    return html;
}


const addSelectOptions = () => {
    const html=makeOptionsHTML(currencies);
    selectBoxFrom.insertAdjacentHTML("beforeend",html);
    selectBoxTo.insertAdjacentHTML("beforeend",html);

}

addSelectOptions();

// LOGIC ///////////////////////////////////////////////////////////////////////////////

// gets exchange rates for the base currency and attempts to get exchange rate for the provided target 
async function getExchangeRates(from : string,to : string){
    try{
        errorText.style.opacity=`0`;
        if(!from) {showError("Please select a valid currency",2);return;}
        if(!to) {showError("Please select a valid currency",2);}

        let exchangeRatesPromise = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`);
        
        if(!exchangeRatesPromise.ok){
            exchangeRatesPromise = await fetch(`https://latest.currency-api.pages.dev/v1/currencies/${from}.json`)
            if(!exchangeRatesPromise.ok) throw new Error("currency not found!");
        }
        exchangeRates = await exchangeRatesPromise.json();
        
        // number or undefined (to doesnt exist)
        
        exchangeRate = exchangeRates[from][to];
        
    }
    catch(error : any){
        showError(typeof error == "string" ? error : `Network error! : ${error.message}`,2);
    } 
}


selectBoxFrom.addEventListener('change',async (e)=>{
    if(!(e.target as HTMLElement).closest('.form__select')) return;
    
    await getExchangeRates(selectBoxFrom.value,selectBoxTo.value);
    swapFlag=false;
    calculateExchangeValue(currencyValueTo,currencyValueFrom,true);

});


function getRate(from : string,to : string){
    
    if(!from) {showError("Please select a valid currency",2); return;}
    errorText.style.opacity=`0`;

    exchangeRate = exchangeRates[from][to];
}


selectBoxTo.addEventListener('change',async (e)=>{
    if(!(e.target as HTMLElement).closest('.form__select')) return;
    

    swapFlag ? await getExchangeRates(selectBoxFrom.value,selectBoxTo.value)  : getRate(selectBoxFrom.value,selectBoxTo.value)
    swapFlag=false;
    calculateExchangeValue(currencyValueFrom,currencyValueTo,false);
});


// Swap Functionality
btn.addEventListener('click',(e)=>{

    if(!(e.target as HTMLElement).closest('.button--swap')) return;

    // Swap fields
    [selectBoxFrom.value,selectBoxTo.value,currencyValueFrom.value,currencyValueTo.value] = [selectBoxTo.value,selectBoxFrom.value,currencyValueTo.value,currencyValueFrom.value];
 
    if(exchangeRate == undefined) {showError('Please select valid currency',2);return;}
    exchangeRate=1/exchangeRate;
});


function calculateExchangeValue(input1 : HTMLInputElement,input2: HTMLInputElement,directionFlag:boolean){

    if(exchangeRate == undefined) {showError('Please select valid currency',2);return;}
    const result= (directionFlag) ? ((+input2.value) * exchangeRate) : ((+input2.value) / exchangeRate); 
    
    if(!result && result!=0) {showError("Please enter a valid amount",1);return;};
    
    input1.value=`${result}`;

    errorText.style.opacity=`0`;

}

function addInputListeners(){
currencyValueFrom.addEventListener('input',e=>{


    calculateExchangeValue(currencyValueTo,currencyValueFrom,true);
});

currencyValueTo.addEventListener('input',e=>{

    calculateExchangeValue(currencyValueFrom,currencyValueTo,false);


});
};

addInputListeners();



// Open picker upon pressing the green rectangle
document.querySelectorAll('.form__select-styling').forEach(e=>e.addEventListener('click',x=>{
    const tar=(x.target as HTMLElement).closest('.form__select-styling') as HTMLSelectElement;
    if(!tar) return;

    (tar.querySelector('.form__select') as HTMLSelectElement)!.showPicker();
}));

function showError(msg:string,priority:number){
if(priority > highestPriorty || errorText.style.opacity==`0`){
    errorText.style.opacity=`1`;
    errorText.textContent=msg;
    highestPriorty = priority;
}

}





export {}