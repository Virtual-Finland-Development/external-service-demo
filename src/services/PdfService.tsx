import { ProfileData } from "../models/ProfileData";
import { PDFDocument } from "pdf-lib";

export async function createPdfFrom(bytes: ArrayBuffer, data: ProfileData) {
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();

  const firstNameField = form.getTextField("Sukunimi  Släktnamn");
  const lastnameField = form.getTextField("Etunimet  Alla förnamn");

  firstNameField.setText(data.Firstname);
  lastnameField.setText(data.Lastname);

  return pdfDoc.save();
}
