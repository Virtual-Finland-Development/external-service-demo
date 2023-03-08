import { useQuery } from '@tanstack/react-query';

// types
import { OccupationOption } from '../@types';

// api
import api from '../api';

export default function useOccupations() {
  const occupationsQuery = useQuery(['occupations'], async () => {
    const response = await api.codesets.getOccupations();
    return response.data as OccupationOption[];
  });

  return occupationsQuery;
}
