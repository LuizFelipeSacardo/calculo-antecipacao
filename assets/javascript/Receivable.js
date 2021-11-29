class Receivable{
  constructor(value, installments, mdr, fee){    
    this.value = value;
    this.installments = installments;
    this.mdr = mdr;
    this.fee = fee;
  }
  
  //method to calculate the value of every installment minus the MDR(fee charged in credit card transactions over the total value of the sale)
  mdrFreeInstallment(){
    const netInstallment = (this.value - (this.value * (this.mdr/100)))/this.installments;
    return netInstallment
  }

  //this method calculates a installment value deducting the MDR and the FEE, considering the FEE % and the average time of the operation
  feeFreeInstallments(){
    const feeFreeInstallments = [];
    const mdrFreeInstallment = this.mdrFreeInstallment();
    const base = this.fee/100;

    for(let i = 0; i < this.installments; i++){
      let feeFreeInstallment = mdrFreeInstallment - mdrFreeInstallment * ((Math.pow((1 + base), i+1)) - 1 );
      feeFreeInstallments.push(feeFreeInstallment);
    }
    return feeFreeInstallments;
  }  
}