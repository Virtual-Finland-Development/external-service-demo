import { Box, Heading, Text } from '@chakra-ui/react';
import {
  WarningIcon,
  SettingsIcon,
  QuestionIcon,
  CheckCircleIcon,
} from '@chakra-ui/icons';

// types
import { StatusRecord, StatusValue } from '../../@types';

function getProgressSettings(statusValue: string) {
  switch (statusValue) {
    case StatusValue.PROCESSING:
      return {
        infoHeader: 'Processing!',
        infoText: 'Your registration has been received and is being processed.',
        Icon: <SettingsIcon boxSize="50px" color="blue.500" />,
      };
    case StatusValue.WAITING_FOR_COMPLETION:
      return {
        infoHeader: 'Waiting for completion!',
        infoText:
          'Your registration has been received and is waiting for completion, please contact the service provider for further instructions.',
        Icon: <WarningIcon boxSize="50px" color="orange.500" />,
      };
    case StatusValue.READY:
      return {
        infoHeader: 'Registration completed!',
        infoText: 'Your registration has been received and is completed.',
        Icon: <CheckCircleIcon boxSize="50px" color="green.500" />,
      };
    default:
      return {
        infoText: '',
        Icon: <QuestionIcon boxSize="50px" color="gray.200" />,
      };
  }
}

export default function StatusInfo(props: StatusRecord) {
  const { statusValue } = props;

  const { infoHeader, infoText, Icon } = getProgressSettings(statusValue);

  return (
    <Box textAlign="center" py={10}>
      {Icon}
      <Heading as="h2" size="xl" mt={4} mb={2}>
        {infoHeader}
      </Heading>
      <Text color="gray.500">{infoText}</Text>
    </Box>
  );
}
