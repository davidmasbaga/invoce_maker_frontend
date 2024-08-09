  export interface Taxes {
  _id:        ID;
  type:       string;
  percentage: Percentage;
  name:       string;
}

export interface ID {
  $oid: string;
}

export interface Percentage {
  $numberDecimal: string;
}


