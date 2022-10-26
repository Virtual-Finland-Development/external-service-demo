import { Flex, Spinner } from '@chakra-ui/react';

export default function Loading({ asOverlay }: { asOverlay?: boolean }) {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      {...(asOverlay && {
        position: 'absolute',
        h: '100%',
        w: '100%',
        bg: 'rgba(255,255,255,0.7)',
        color: '#000',
      })}
      zIndex={9999}
    >
      <Spinner thickness="4px" size="xl" mt={asOverlay ? 6 : 0} />
    </Flex>
  );
}
