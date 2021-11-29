function captureInformation(){
  const inputValue = document.querySelector('#input-form__value').value;
  const inputInstallments = document.querySelector('#input-form__installments').value;
  const inputMdr = document.querySelector('#input-form__mdr').value;
  const inputFee = document.querySelector('#input-form__fee').value;

  const stringValue = inputValue.replace(",", ".");
  const stringInstallments = inputInstallments.replace(",", ".");
  const stringMdr = inputMdr.replace(",", ".");
  const stringFee = inputFee.replace(",", ".");

  const value = Number(stringValue);
  const installments = Number(stringInstallments);
  const mdr = Number(stringMdr);
  const fee = Number(stringFee);

  const receivable = new Receivable(value, installments, mdr, fee);

  return receivable;
}

const resultsSection = document.querySelector('#results');
const resultsOutput = document.querySelector('#results__output');
const resultsTable = document.querySelector('#results-table__body');
const resultsComplete = document.querySelector('#results__complete');
const resultsTitle = document.querySelector('#results__title');


function errorsValidation(receivable){
  let errors = [];
  if(!receivable.value === typeof Number || receivable.value <= 0){
    errors.push("Didige um valor a ser antecipado valido")
  }
  if(!receivable.installments === typeof Number || receivable.installments <= 0 || receivable.installments > 12){
    errors.push("Didige um numero de parcelas válido - Entre 1 e 12.")
  }
  if(!receivable.mdr === typeof Number || receivable.mdr <= 0 || receivable.mdr > 10){
    errors.push("Didige um valor de MDR válido")
  }
  if(!receivable.fee === typeof Number || receivable.fee <= 0 || receivable.fee > 10){
    errors.push("Didige um valor de taxa de antecipação valido")
  }
  return errors;
}


function efectiveCost(receivable){
  let sum = 0;
  const feeFreeInstallments = receivable.feeFreeInstallments();
  feeFreeInstallments.forEach(i => {
    sum += i;
  })
  let totalCost = receivable.value - sum;
  return (totalCost / receivable.value)*100;
}


function abstractResult(receivable){
  resultsOutput.innerHTML = `O valor liquido a ser recebido seria de <span class="text-highlight"> R$ ${(receivable.value - (receivable.value * (efectiveCost(receivable)/100))).toFixed(2)} </span>, e o custo efetivo com a antecipação desta operação é <span class="text-highlight">${efectiveCost(receivable).toFixed(2)}%</span>.`
} 


//MAIN FUNCTION
function completeResult(){
   
  const receivable = captureInformation();   

  const feeFreeInstallments = receivable.feeFreeInstallments();
  const fullInstallment = receivable.value / receivable.installments;

  const errorsList = errorsValidation(receivable);

  if(errorsList.length > 0){
    resultsSection.classList.remove('results--hide');
    resultsOutput.classList.add('results--error');
    resultsComplete.classList.add('results--hide');
    resultsTitle.classList.add('results--hide');

    const resultsOutputDinamicHeight = errorsList.length * 25 + 20;
    resultsOutput.style.height = resultsOutputDinamicHeight + "px";    
    resultsOutput.innerHTML = `<span class="text--highlight">Erros:</span> <br>`

    for(let i = 0; i < errorsList.length; i++){
      resultsOutput.innerHTML += `<span class="text--highlight">&#10008</span> ${errorsList[i]}<br>`
    }      

  } else{    
    resultsOutput.classList.remove('results--error');
    resultsComplete.classList.remove('results--hide');
    resultsSection.classList.remove('results--hide');
    resultsTitle.classList.remove('results--hide');

    resultsOutput.style.height = "58px";

    let installmentsSum = 0;
  
     for(let i = 0; i <= receivable.installments; i++){

        installmentsSum += feeFreeInstallments[i];

        const tdInstallment = document.createElement('td');
        tdInstallment.innerText = `${i+1}x`;

        const tdFee = document.createElement('td');
        tdFee.innerText = `R$ ${(fullInstallment - feeFreeInstallments[i]).toFixed(2)}`;

        const tdNetValue = document.createElement('td');
        tdNetValue.innerText = `R$ ${(feeFreeInstallments[i]).toFixed(2)}`;

        const tdEfectiveCost = document.createElement('td');
        tdEfectiveCost.innerText = `${((((fullInstallment * (i+1) - installmentsSum))/ (fullInstallment * (i+1)))*100).toFixed(2)}%`
      
        const tr = document.createElement('tr');
        tr.appendChild(tdInstallment);
        tr.appendChild(tdFee);
        tr.appendChild(tdNetValue);
        tr.appendChild(tdEfectiveCost);  
        resultsTable.appendChild(tr);
        
        abstractResult(receivable);
    }
  }  
}
