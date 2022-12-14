import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useDisclosure } from '@chakra-ui/react';

// components
import Modal from '../../components/Modal/Modal';

interface IModal {
  title: string | null;
  content: string | ReactElement;
  onClose?: () => void;
  size?: string;
  useBodyPadding?: boolean;
  footerContent?: string | ReactElement;
  closeDisabled?: boolean;
}

interface IModalContext {
  openModal: (modal: IModal) => void;
  closeModal: () => void;
  setModalCloseDisabled: (disabled: boolean) => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

// context
const ModalContext = createContext<IModalContext | undefined>(undefined);

// provider
function ModalProvider({ children }: ModalProviderProps) {
  const [modal, setModal] = useState<IModal | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  /**
   * Handle open modal. Use chakra useDisclosure hook, set modal object to state.
   */
  const openModal = (modal: IModal) => {
    setModal(modal);
    onOpen();
  };

  /**
   * Handle open modal. Use chakra useDisclosure hook, remove modal object from state.
   */
  const closeModal = useCallback(async () => {
    onClose();

    if (modal && typeof modal.onClose === 'function') {
      modal.onClose();
    }

    setTimeout(() => {
      setModal(null);
    }, 500);
  }, [modal, onClose]);

  const setModalCloseDisabled = (disabled: boolean) => {
    setModal(modal => {
      if (modal) {
        return { ...modal, closeDisabled: disabled };
      }
      return null;
    });
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        setModalCloseDisabled,
      }}
    >
      <>
        {children}

        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={modal?.title || ''}
          content={modal?.content}
          size={modal?.size || undefined}
          useBodyPadding={
            modal?.useBodyPadding !== undefined ? modal.useBodyPadding : true
          }
          footerContent={modal?.footerContent || undefined}
          closeDisabled={modal?.closeDisabled || false}
        />
      </>
    </ModalContext.Provider>
  );
}

/**
 * useModal hook
 */
function useModal() {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}

export { ModalContext, ModalProvider, useModal };
