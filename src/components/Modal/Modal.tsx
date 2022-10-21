import { ReactElement } from 'react';
import {
  Button,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: string | ReactElement;
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClose, title, content } = props;

  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent mx={{ base: 2, md: 0 }}>
        <ModalHeader>{title || ''}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={10}>{content || ''}</ModalBody>
        <ModalFooter>
          <Button colorScheme={'blue'} leftIcon={<EmailIcon />}></Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}
