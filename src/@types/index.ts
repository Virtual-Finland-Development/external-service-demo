export interface ProfileFormData {
  FamilyName: string;
  PreviousFamilyNames: string;
  GivenName: string;
  PreviousGivenNames: string;
  DateOfBirth: string;
  Sex: string;
  RegistrationId: string;
  CountryOfOrigin: string;
  DistrictOfOrigin: string;
  NativeLanguage: string;
  Occupation: string;
  Citizenship: string;
  AddressInFinland: string;
  AddressAbroad: string;
  DateOfArrivalInFinland: string;
  EndDateOfStayInFinland: string;
  ReasonForRecordingInformation: string;
}

export interface ProfileData {
  Firstname: string;
  Lastname: string;
}

export enum Sex {
  Male = 'SEX_MALE',
  Female = 'SEX_FEMALE',
}

export enum IdentityType {
  PersonalIdentityCode = 'PERSONAL_IDENTITY_CODE',
  TaxIdentityNumber = 'TAX_IDENTITY_NUMBER',
}

export enum InformationRegistrationReason {
  WorkingInFinland = 'WORKING_IN_FINLAND',
  OperationOfTradeProfessionInFinland = 'OPERATION_OF_TRADE_PROFESSION_IN_FINLAND',
  Other = 'OTHER'
}