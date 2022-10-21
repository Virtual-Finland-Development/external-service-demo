export enum AuthProvider {
  TESTBED = 'testbed',
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
}

export type AuthTokens = {
  accessToken: string;
  idToken: string;
  expiresAt: string;
};

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  jobTitles: string[];
  regions: string[];
  created: string;
  modified: string;
  jobsDataConsent: boolean;
}

export interface ProfileFormData {
  FamilyName: string;
  PreviousFamilyNames: string;
  GivenName: string;
  PreviousGivenNames: string;
  DateOfBirth: string;
  Sex: Sex;
  RegistrationIdentityType: RegistrationIdentityType;
  RegistrationIdentity: string;
  CountryOfOrigin: string;
  DistrictOfOrigin: string;
  NativeLanguage: string;
  Occupation: string;
  Citizenship: string;
  AddressInFinland: string;
  AddressAbroad: string;
  DateOfArrivalInFinland: string;
  EndDateOfStayInFinland: string;
  ReasonForRecordingInformation: InformationRegistrationReason;
  ReasonForRecordingInformationDescription: string;
}

export interface ProfileData {
  Firstname: string;
  Lastname: string;
}

export enum Sex {
  Male = 'MALE',
  Female = 'FEMALE',
}

export enum RegistrationIdentityType {
  PersonalIdentityCode = 'PERSONAL_IDENTITY_CODE',
  TaxIdentityNumber = 'TAX_IDENTITY_NUMBER',
}

export enum InformationRegistrationReason {
  WorkingInFinland = 'WORKING_IN_FINLAND',
  OperationOfTradeProfessionInFinland = 'OPERATION_OF_TRADE_PROFESSION_IN_FINLAND',
  Other = 'OTHER',
}
