import { useQuery } from '@tanstack/react-query';

// types
import { LanguageOption } from '../@types';

// api
import api from '../api';

export default function useLanguages() {
  const languagesQuery = useQuery(['languages'], async () => {
    const response = await api.codesets.getLanguages();
    return response.data as LanguageOption[];
  });

  return languagesQuery;
}
