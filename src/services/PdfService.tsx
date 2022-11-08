import { PDFDocument } from 'pdf-lib';
import { format, parseISO } from 'date-fns';
import {
  InformationRegistrationReason,
  ProfileFormData,
  RegistrationIdentityType,
  Sex,
} from '../@types';

export async function createPdfFrom(bytes: ArrayBuffer, data: ProfileFormData) {
  const pdfDoc = await PDFDocument.load(bytes),
    form = pdfDoc.getForm(),
    familyName = form.getTextField('Sukunimi  Släktnamn'),
    previousFamilyNames = form.getTextField(
      'Entiset sukunimet  Alla tidigare släktnamn'
    ),
    givenName = form.getTextField('Etunimet  Alla förnamn'),
    previousGivenNames = form.getTextField(
      'Entiset etunimet  Alla tidigare förnamn'
    ),
    dateOfBirth = form.getTextField(
      'Syntymäaika päiväkuukausivuosi  Födelsetid dagmånadår'
    ),
    sexCheckbox = form.getCheckBox('Mies  Man'),
    ssnCheckbox = form.getCheckBox('H'),
    ssn = form.getTextField('H-tunnus'),
    taxNoCheckbox = form.getCheckBox('V'),
    taxNo = form.getTextField('V-tunnus'),
    countryOfOrigin = form.getTextField('Syntymävaltio'),
    districtOfOrigin = form.getTextField('Ulkomainen syntymäpaikka'),
    nativeLanguage = form.getTextField('Äidinkieli  Modersmål'),
    occupation = form.getTextField('Ammatti  Yrke'),
    citizenship = form.getTextField('Kansalaisuus  Nationalitet'),
    addressInFinland = form.getTextField('Osoite Suomessa  Adress i Finland'),
    addressAbroad = form.getTextField('Osoite ulkomailla Adress på utlandet'),
    dateOfArrivalInFinland = form.getTextField(
      'Suomeentulopäivä päiväkkvuosi  Inresedag till Finland dagmånadår'
    ),
    endDateOfStayInFinland = form.getTextField(
      'Milloin arvioit Suomessa oleskelun viimeistään päättyvän päiväkkvuosi När ska vistelsen i Finland enligt din uppskattning senast sluta dagmånadår'
    ),
    workingInFinland = form.getCheckBox(
      'Työskentely Suomessa  Arbete i Finland'
    ),
    operationOfTradeProfessionInFinland = form.getCheckBox(
      'Ammatinharjoittaminen Suomessa Yrkesutövning i Finland'
    ),
    other = form.getCheckBox(
      'Muu erityinen syy selvitä  Annan särskild orsak förklara'
    ),
    reasonForRecordingInformationDescription = form.getTextField(
      'Työskentely Suomessa  Arbete i Finland Ammatinharjoittaminen Suomessa Yrkesutövning i Finland Muu erityinen syy selvitä  Annan särskild orsak förklara'
    );

  familyName.setText(data.lastName);
  previousFamilyNames.setText(data.previousFamilyNames);

  givenName.setText(data.firstName);
  previousGivenNames.setText(data.previousGivenNames);

  dateOfBirth.setText(
    data.dateOfBirth ? format(parseISO(data.dateOfBirth), 'dd.MM.yyyy') : ''
  );

  // Female cannot be set, because there is no checkbox field for it ":D"
  if (data.gender === Sex.Male) {
    sexCheckbox.check();
  }

  if (data.registrationIdentityType) {
    switch (data.registrationIdentityType) {
      case RegistrationIdentityType.PersonalIdentityCode:
        ssnCheckbox.check();
        ssn.setText(data.registrationIdentity);
        break;
      case RegistrationIdentityType.TaxIdentityNumber:
        taxNoCheckbox.check();
        taxNo.setText(data.registrationIdentity);
        break;
    }
  }

  countryOfOrigin.setText(data.countryOfBirthCode);
  districtOfOrigin.setText(data.districtOfOrigin);

  nativeLanguage.setText(data.nativeLanguageCode);
  occupation.setText(data.occupationCode);
  citizenship.setText(data.citizenshipCode);

  addressInFinland.setText(data.addressInFinland);
  addressAbroad.setText(data.address);

  dateOfArrivalInFinland.setText(
    data.dateOfArrivalInFinland
      ? format(parseISO(data.dateOfArrivalInFinland), 'dd.MM.yyyy')
      : ''
  );
  endDateOfStayInFinland.setText(
    data.endDateOfStayInFinland
      ? format(parseISO(data.endDateOfStayInFinland), 'dd.MM.yyyy')
      : ''
  );

  if (data.reasonForRecordingInformation) {
    switch (data.reasonForRecordingInformation) {
      case InformationRegistrationReason.WorkingInFinland:
        workingInFinland.check();
        break;
      case InformationRegistrationReason.OperationOfTradeProfessionInFinland:
        operationOfTradeProfessionInFinland.check();
        break;
      case InformationRegistrationReason.Other:
        other.check();
        reasonForRecordingInformationDescription.setText(
          data.reasonForRecordingInformationDescription
        );
        break;
    }
  }

  const printButton = form.getButton('Tulosta');
  form.removeField(printButton);
  const resetButton = form.getButton('Tyjenna');
  form.removeField(resetButton);

  const fields = form.getFields();

  // make all fields read only after filling, if user wish to download the pdf it will not be editable
  fields.forEach(field => {
    field.enableReadOnly();
  });

  return pdfDoc.save();
}
