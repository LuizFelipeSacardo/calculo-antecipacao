const inputValue = document.querySelector('#input-form__value').value;
const inputInstallments = document.querySelector('#input-form__installments').value;
const inputMdr = document.querySelector('#input-form__mdr').value;
const inputFee = document.querySelector('#input-form__fee').value;

const stringValue = inputValue.replace(",", ".");
const stringInstallments = inputInstallments.replace(",", ".");
const stringMdr = inputMdr.replace(",", ".");
const stringFee = inputFee.replace(",", ".");

value = Number(stringValue);
installments = Number(stringInstallments);
mdr = Number(stringMdr);
fee = Number(stringFee);


const resultsSection = document.querySelector('#results');
const resultsOutput = document.querySelector('#results__output');
const resultsTable = document.querySelector('#results-table__body');

const recebivel = new Recebivel(value, installments, mdr, fee);

const feeFreeInstallments = recebivel.feeFreeInstallments();
const fullInstallment = recebivel.value / recebivel.installments;

//const calculate = document.querySelector('#input-form__button');
//calculate.addEventListener('click', completeResult());

function errorsValidation(){
  let errors = [];
  if(!value === typeof Number || value <= 0){
    errors.push("Didige um valor valido no campo 'Valor a ser antecipado'.")
  }
  if(!installments === typeof Number || installments <= 0 || installments > 12){
    errors.push("Didige um numero de parcelas válido - Entre 1 e 12.")
  }
  if(!mdr === typeof Number || mdr <= 0 || mdr > 10){
    errors.push("Didige um valor de MDR válido, apenas numeros.")
  }
  if(!fee === typeof Number || fee <= 0 || fee > 10){
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
  let errorsList = errorsValidation();

  if(errorsList.length > 0){
    resultsSection.classList.add('results--hide');
    console.log(errorsList.length)        

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
