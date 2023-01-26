import { useCallback, useEffect, useState } from 'react';
import {
  Flex,
  useBreakpointValue,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import { SizeMe } from 'react-sizeme';
import { createPdfFrom } from '../../services/PdfService';
import { ProfileFormData } from '../../@types';

import Loading from '../Loading/Loading';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function downloadPdf(file: Blob) {
  const fileURL = window.URL.createObjectURL(file);
  let alink = document.createElement('a');
  alink.href = fileURL;
  alink.download = 'Registration Form.pdf';
  alink.click();
}

interface Props {
  profileData: ProfileFormData | undefined;
  disableModalClose: () => void;
  sendCallback: () => void;
}

export default function PdfForm(props: Props) {
  const { profileData, disableModalClose, sendCallback } = props;

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

  const onSendClick = (download: boolean) => {
    disableModalClose();
    setLoading(true);

    setTimeout(() => {
      sendCallback();

      if (file && download) {
        downloadPdf(file);
      }
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
      <Menu>
        <MenuButton
          as={Button}
          colorScheme={'blue'}
          w="auto"
          mx={6}
          mb={6}
          alignSelf="end"
          leftIcon={<EmailIcon />}
        >
          Send
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => onSendClick(true)}>
            Send and download
          </MenuItem>
          <MenuItem onClick={() => onSendClick(false)}>Send only</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
