import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PdfForm from "./PdfForm";

describe("<PdfForm />", () => {
  test("it should mount", () => {
    render(<PdfForm />);

    const pdfForm = screen.getByTestId("PdfForm");

    expect(pdfForm).toBeInTheDocument();
  });
});
