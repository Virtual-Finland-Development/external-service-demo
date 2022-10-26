import { useCallback, useEffect, useState } from 'react';
import { Flex, useBreakpointValue, Button } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import { SizeMe } from 'react-sizeme';
import { createPdfFrom } from '../../services/PdfService';
import { ProfileFormData } from '../../@types';

import Loading from '../Loading/Loading';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
  profileData: ProfileFormData | undefined;
  sendCallback: () => void;
}

export default function PdfForm(props: Props) {
  const { profileData, sendCallback } = props;

  const [file, setFile] = useState<Blob>();
  const [loading, setLoading] = useState<boolean>(false);

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
    const data = profileData as ProfileFormData;
    await createPdfFrom(bytes, data).then(result => {
      setFile(new Blob([result]));
    });
  }, [profileData]);

  const onSendClick = () => {
    setLoading(true);

    setTimeout(() => {
      sendCallback();
    }, 1000);
  };

  useEffect(() => {
    loadDataFromApiAndFillPdf();
  }, [loadDataFromApiAndFillPdf]);

  return (
    <Flex flexDirection="column" position="relative">
      {loading && <Loading asOverlay />}
      <SizeMe monitorWidth>
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
      <Button
        colorScheme={'blue'}
        w="auto"
        mx={6}
        mb={6}
        alignSelf="end"
        leftIcon={<EmailIcon />}
        onClick={onSendClick}
      >
        Send
      </Button>
    </Flex>
  );
}
