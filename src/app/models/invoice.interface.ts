export interface Invoice {
  _id:            string;
  user:           string;
  documentNumber: string;
  status:         string;
  concepts:       Concept[];
  __v:            number;
  contact:        string;
  contactDetails: ContactDetails;
  date:           Date;
  expiration:     string;
  subtotal:       number;
  totalTaxes:     TotalTaxes;
  totalWithTaxes: number;
  userDetails:    UserDetails;
}

export interface Concept {
  concept:     string;
  description: string;
  units:       number;
  amount:      number;
  taxes:       string[];
  total:       number;
  _id:         string;
}

export interface ContactDetails {
  _id:      string;
  name:     string;
  lastname: string;
  email:    string;
  address:  Address;
  fiscal:   Fiscal;
  website:  string;
}

export interface Address {
  street:     string;
  number:     string;
  piso:       string;
  puerta:     string;
  postalCode: string;
  city:       string;
  province:   string;
  country:    string;
}

export interface Fiscal {
  type:   string;
  number: string;
}

export interface TotalTaxes {
  iva_21:  number;
  irpf_15: number;
}

export interface UserDetails {
  _id:   string;
  email: string;
}
