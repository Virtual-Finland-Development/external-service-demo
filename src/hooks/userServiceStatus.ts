import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

// api
import api from '../api';

// only custom 'Status information not found' error should be silenced
function shouldShowError(error: any) {
  return (
    error.response.status !== 404 ||
    (error.message.status === 404 && !error?.response?.data?.data?.message) ||
    (error.response.data.data.message &&
      error.response.data.data.message !== 'Status information not found')
  );
}

export default function useServiceStatus() {
  const [error, setError] = useState<any>(null);
  const toast = useToast();

  const query = useQuery(
    ['service-status'],
    async () => await api.user.getRegStatus(),
    {
      refetchOnWindowFocus: false,
      retry: false,
      onError: (error: any) => {
        if (shouldShowError(error)) {
          setError(error);
        }
      },
    }
  );

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error?.message || 'Could not fetch status info!',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  return query;
}
