//capturing the results elements to show the results
const resultsSection = document.querySelector('#results');
const resultsOutput = document.querySelector('#results__output');
const resultsTable = document.querySelector('#results-table__body');
const resultsComplete = document.querySelector('#results__complete');
const resultsTitle = document.querySelector('#results__title');

//Function that captures the input values every time it's called. Will be used in the main function to assure that the input values are realy being loaded.
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


//Function that validates the form fields and generates a list with the erros to be displayed to the user.
function errorsValidation(receivable){
  let errors = [];
  if(!receivable.value === typeof Number || receivable.value <= 0){
    errors.push("Digite um valor a ser antecipado válido")
  }
  if(!receivable.installments === typeof Number || receivable.installments <= 0 || receivable.installments > 24){
    errors.push("Selecione um numero de parcelas")
  }
  if(!receivable.mdr === typeof Number || receivable.mdr <= 0 || receivable.mdr > 10){
    errors.push("Digite um valor de MDR válido")
  }
  if(!receivable.fee === typeof Number || receivable.fee <= 0 || receivable.fee > 10){
    errors.push("Digite um valor de taxa de antecipação válido")
  }
  return errors;
}

//calculates the efective cost of the operation, will be used to display the results
function efectiveCost(receivable){
  let sum = 0;
  const feeFreeInstallments = receivable.feeFreeInstallments();
  feeFreeInstallments.forEach(i => {
    sum += i;
  })
  let totalCost = receivable.value - sum;
  return (totalCost / receivable.value)*100;
}


//shortened output, shows a abstract of the results, will be called in the main function as well
function abstractResult(receivable){
  resultsOutput.innerHTML = `O valor liquido a ser recebido seria de <span class="text--highlight">${(receivable.value - (receivable.value * (efectiveCost(receivable)/100))).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</span>, e o custo efetivo com a antecipação desta operação é <span class="text--highlight">${efectiveCost(receivable).toFixed(2)}%</span>.`
} 


//main function, trigered by the "calcular" button at the end of the form
function completeResult(){
   
  //capture the inputs and instance a new receivable object
  const receivable = captureInformation();   

  //using a method for the instanced receivable object
  const feeFreeInstallments = receivable.feeFreeInstallments();
  const fullInstallment = receivable.value / receivable.installments;

  //validates the inputs running the "erros validation function", uses the instanced receivable object as a entry paramether
  const errorsList = errorsValidation(receivable);

  //will run the "if" if the erros list has any content
  if(errorsList.length > 0){
    resultsSection.classList.remove('results--hide');
    resultsOutput.classList.add('results--error');
    resultsComplete.classList.add('results--hide');
    resultsTitle.classList.add('results--hide');

    //adjusts the output field for erros acordingly to the size of the erros list plus a minimus size
    const resultsOutputDinamicHeight = errorsList.length * 25 + 20;
    resultsOutput.style.height = resultsOutputDinamicHeight + "px";    
    resultsOutput.innerHTML = `<span class="text--highlight">Erro(s):</span> <br>`

    //runs the erros list generating the erros output
    for(let i = 0; i < errorsList.length; i++){
      resultsOutput.innerHTML += `<span class="text--highlight">&#10008</span> ${errorsList[i]}<br>`
    }      

    //will run the "else" if there is no erros in the "erros list"
  } else{    
    resultsOutput.classList.remove('results--error');
    resultsComplete.classList.remove('results--hide');
    resultsSection.classList.remove('results--hide');
    resultsTitle.classList.remove('results--hide');
    resultsTable.innerHTML = null;

    resultsOutput.style.height = "58px";

    let installmentsSum = 0;
  
    //this for is responsable for generating the table and the content for the "complete results output"
     for(let i = 0; i <= receivable.installments; i++){

        installmentsSum += feeFreeInstallments[i];

        const tdInstallment = document.createElement('td');
        tdInstallment.innerText = `${i+1}x`;

        const tdFee = document.createElement('td');
        tdFee.innerText = `${(fullInstallment - feeFreeInstallments[i]).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;

        const tdNetValue = document.createElement('td');
        tdNetValue.innerText = `${(feeFreeInstallments[i]).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;

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
