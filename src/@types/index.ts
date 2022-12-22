export enum AuthProvider {
  TESTBED = 'testbed',
  SINUNA = 'sinuna',
  SUOMIFI = 'suomifi',
}

export type LoggedInState = {
  idToken: string;
  expiresAt: string;
  profileData: {
    userId: string; // sub, inum etc.
    email: string; // Email is not always available
    [key: string]: any;
  };
};

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  address: {
    streetAddress: string;
    zipCode: string;
    city: string;
    country: string;
  };
  jobTitles: string[];
  regions: string[];
  created: string;
  modified: string;
  jobsDataConsent: boolean;
  countryOfBirthCode: string;
  occupationCode: string;
  citizenshipCode: string;
  nativeLanguageCode: string;
  gender: string;
  dateOfBirth: string;
  immigrationDataConsent: boolean;
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
  addressFormatted: string;
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

export interface CountryOption {
  displayName: string;
  englishName: string;
  id: string;
  nativeName: string;
  threeLetterISORegionName: string;
  twoLetterISORegionName: string;
}

export interface OccupationOption {
  notation: string;
  prefLabel: {
    en: string;
  };
}

export interface LanguageOption {
  id: string;
  englishName: string;
}
