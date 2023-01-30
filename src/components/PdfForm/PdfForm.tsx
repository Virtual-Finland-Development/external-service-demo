import { useCallback, useEffect, useState } from 'react';
import {
  Flex,
  useBreakpointValue,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import { SizeMe } from 'react-sizeme';
import { createPdfFrom } from '../../services/PdfService';
import { ProfileFormData } from '../../@types';

import Loading from '../Loading/Loading';

import api from '../../api';

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
  disableModalClose: (isDisabled: boolean) => void;
  sendCallback: () => void;
}

export default function PdfForm(props: Props) {
  const { profileData, disableModalClose, sendCallback } = props;

  const [file, setFile] = useState<Blob>();
  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast();

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

  const onSendClick = useCallback(
    async (download: boolean) => {
      disableModalClose(true);
      setLoading(true);

      try {
        await api.user.sendRegStatus({
          statusName: 'foreigner_reg_form',
          statusValue: 'SENT',
        });

        toast({
          title: 'Registration form was sent successfully',
          status: 'success',
          position: 'top-right',
          duration: 5000,
          isClosable: true,
        });

        if (file && download) {
          downloadPdf(file);
        }

        sendCallback();
      } catch (error: any) {
        disableModalClose(false);
        setLoading(false);
        toast({
          title: 'Registration form could not be sent',
          description: error?.message || 'Something went wrong',
          status: 'error',
          position: 'top-right',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [disableModalClose, file, sendCallback, toast]
  );

  useEffect(() => {
    loadDataFromApiAndFillPdf();
  }, [loadDataFromApiAndFillPdf]);

  return (
    <Flex flexDirection="column" position="relative">
      {loading && <Loading asOverlay data-testid="loading" />}
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
