import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';

// hooks
// import useErrorToast from './useErrorToast';

// api
import api from '../api';

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
        console.log(error);
        if (error.response.status !== 404) {
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
