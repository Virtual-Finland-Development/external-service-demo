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
  immigrationDataConsent: boolean;
  countryOfBirthCode: string;
  occupationCode: string;
}

export interface ProfileFormData extends UserProfile {
  previousFamilyNames: string;
  previousGivenNames: string;
  dateOfBirth: string;
  sex: Sex;
  registrationIdentityType: RegistrationIdentityType;
  registrationIdentity: string;
  districtOfOrigin: string;
  nativeLanguage: string;
  citizenship: string;
  addressInFinland: string;
  dateOfArrivalInFinland: string;
  endDateOfStayInFinland: string;
  reasonForRecordingInformation: InformationRegistrationReason;
  reasonForRecordingInformationDescription: string;
}

export enum Sex {
  Male = 'male',
  Female = 'female',
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
