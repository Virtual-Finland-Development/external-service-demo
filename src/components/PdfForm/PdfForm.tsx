import React, { useState } from 'react';
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { Document, Page, pdfjs } from 'react-pdf';
import { createPdfFrom } from '../../services/PdfService';
import { ProfileData } from '../../@types';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfForm() {
  const [file, setFile] = useState<Blob>();

  async function loadDataFromApiAndFillPdf() {
    const profileData: ProfileData = {
      Firstname: 'Aku',
      Lastname: 'Ankka',
    };

    const bytes = await fetch('./form.pdf').then(res => res.arrayBuffer());

    await createPdfFrom(bytes, profileData).then(result => {
      setFile(new Blob([result]));
    });
  }

  return (
    <Box data-testid="PdfForm">
      <Container>
        <Heading as="h1" size="md">
          <Container>
            Registration information on a foreigner staying in Finland
            temporarily
          </Container>
        </Heading>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          <AspectRatio ratio={1 / 1.4142}>
            <Document file={file ?? './form.pdf'}>
              <Page key={1} pageNumber={1} />
            </Document>
          </AspectRatio>
        </Box>

        <Stack direction="column">
          <Button
            colorScheme="blue"
            size="md"
            onClick={loadDataFromApiAndFillPdf}
          >
            Load data from Profile API
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
