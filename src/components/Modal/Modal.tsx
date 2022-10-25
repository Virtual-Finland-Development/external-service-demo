import { ReactElement } from 'react';
import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: string | ReactElement;
  size?: string;
  useBodyPadding?: boolean;
  footerContent?: string | ReactElement;
}

export default function Modal(props: ModalProps) {
  const {
    isOpen,
    onClose,
    title,
    content,
    size,
    useBodyPadding,
    footerContent,
  } = props;

  return (
    <ChakraModal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      {...(size && { size })}
    >
      <ModalOverlay />
      <ModalContent mx={{ base: 2, md: 0 }} maxH="100%" overflowY="auto">
        <ModalHeader>{title || ''}</ModalHeader>
        <ModalCloseButton />
        <ModalBody {...(!useBodyPadding ? { p: 0 } : { pb: 6 })}>
          {content || ''}
        </ModalBody>
        {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
      </ModalContent>
    </ChakraModal>
  );
}
