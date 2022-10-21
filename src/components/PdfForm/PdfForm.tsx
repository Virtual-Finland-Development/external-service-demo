import { useEffect, useState, useCallback } from 'react';
import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { Document, Page, pdfjs } from 'react-pdf';
import { SizeMe } from 'react-sizeme';
import { createPdfFrom } from '../../services/PdfService';
import { ProfileFormData } from '../../@types';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  profileData: ProfileFormData | undefined;
}

export default function PdfForm(props: Props) {
  const [file, setFile] = useState<Blob>();

  const pdfScale = useBreakpointValue(
    {
      base: 1.1,
      md: 0.8,
    },
    {
      fallback: 'base',
    }
  );

  const loadDataFromApiAndFillPdf = useCallback(async () => {
    const bytes = await fetch('./form.pdf').then(res => res.arrayBuffer());
    const data = props.profileData as ProfileFormData;
    await createPdfFrom(bytes, data).then(result => {
      setFile(new Blob([result]));
    });
  }, [props.profileData]);

  useEffect(() => {
    loadDataFromApiAndFillPdf();
  }, [loadDataFromApiAndFillPdf]);

  return (
    <SizeMe>
      {({ size }) => (
        <Flex alignItems="center" justifyContent="center">
          <Document file={file ?? './form.pdf'}>
            <Page
              pageNumber={1}
              width={size.width ? size.width : 1}
              scale={pdfScale}
            />
          </Document>
        </Flex>
      )}
    </SizeMe>
  );
}
