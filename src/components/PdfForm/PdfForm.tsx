import React, { useEffect, useState } from 'react';
import { AspectRatio, Box, Container, Flex } from '@chakra-ui/react';
import { Document, Page, pdfjs } from 'react-pdf';
import { createPdfFrom } from '../../services/PdfService';
import { ProfileFormData } from '../../@types';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  profileData: ProfileFormData | undefined;
}

export default function PdfForm(props: Props) {
  const [file, setFile] = useState<Blob>();

  async function loadDataFromApiAndFillPdf() {
    const bytes = await fetch('./form.pdf').then(res => res.arrayBuffer());
    const data = props.profileData as ProfileFormData;
    await createPdfFrom(bytes, data).then(result => {
      setFile(new Blob([result]));
    });
  }

  useEffect(() => {
    loadDataFromApiAndFillPdf();
  }, []);

  return (
    <Flex data-testid="PdfForm">
      <Container>
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
          <AspectRatio ratio={1 / 1.4142}>
            <Document file={file ?? './form.pdf'}>
              <Page key={1} pageNumber={1} />
            </Document>
          </AspectRatio>
        </Box>
      </Container>
    </Flex>
  );
}
