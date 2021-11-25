const inputValue = document.querySelector('#input-form__value').value;
const inputInstallments = document.querySelector('#input-form__installments').value;
const inputMdr = document.querySelector('#input-form__mdr').value;
const inputFee = document.querySelector('#input-form__fee').value;

const value = inputValue.replace(",", ".");
const installments = inputInstallments.replace(",", ".");
const mdr = inputMdr.replace(",", ".");
const fee = inputFee.replace(",", ".");

const calculate = document.querySelector('#input-form__button');

const resultsSection = document.querySelector('#results');
const resultsOutput = document.querySelector('#results__output');
const resultsTable = document.querySelector('#results-table__body');

const recebivel = new Recebivel(value, installments, mdr, fee);

const feeFreeInstallments = recebivel.feeFreeInstallments();
const fullInstallment = recebivel.value / recebivel.installments;

calculate.addEventListener('click', abstractResult());


function errorsValidation(){
  let errors = [];
  if(!value === typeof Number || value <= 0 || undefined || null){
    errors.push("Didige um valor valido no campo 'Valor a ser antecipado'.")
  }
  if(!installments === typeof Number || installments <= 0 || installments > 12 || undefined || null){
    errors.push("Didige um numero de parcelas válido - Entre 1 e 12.")
  }
  if(!mdr === typeof Number || mdr <= 0 || mdr > 10 || undefined || null){
    errors.push("Didige um valor de MDR válido, apenas numeros.")
  }
  if(!fee === typeof Number || fee <= 0 || fee > 10 || undefined || null){
    errors.push("Didige um valor de taxa de antecipação valido, apenas numeros.")
  }
  return errors;
}

function efectiveCost(){
  let sum = 0;
  feeFreeInstallments.forEach(i => {
    sum += i;
  })
  let totalCost = recebivel.value - sum;
  return (totalCost / recebivel.value)*100;
}


function abstractResult(){
  resultsOutput.innerHTML = `O valor liquido a ser recebido seria de <span class="text-highlight"> R$ ${(recebivel.value - (recebivel.value * (efectiveCost()/100))).toFixed(2)} </span>, e o custo efetivo com a antecipação desta operação é <span class="text-highlight">${efectiveCost().toFixed(2)}%</span>.`
} 


function completeResult(){

  let errors = errorsValidation();

  if(errors.length > 0){
        resultsSection.classList.add('results--hide');

  } else{    
    resultsSection.classList.remove('results--hide');
    let installmentsSum = 0;
  
  for(let i = 0; i <= recebivel.installments; i++){

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
  }
  }  
}
