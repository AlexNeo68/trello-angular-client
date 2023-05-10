import { environment } from 'src/environments/environment';

export const generateApiUrl = (url: string): string => {
  return `${environment.apiUrl}/${url}`;
};
