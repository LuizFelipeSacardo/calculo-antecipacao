class Recebivel{
  constructor(value, installments, mdr, fee){    
    this.value = value;
    this.installments = installments;
    this.mdr = mdr;
    this.fee = fee;
  }
  
  mdrFreeInstallment(){
    const netInstallment = (this.value - (this.value * (this.mdr/100)))/installments;
    return netInstallment
  }

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