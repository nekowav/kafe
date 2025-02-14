import useSWR from 'swr';
import routes from '../routes';
import { useTutorialProgram } from './index';

export const useGetTutorialBySlug = <D>(slug: string) => {
  const tutorialProgram = useTutorialProgram();

  const { data, error } = useSWR(routes.tutorialBySlug(slug), async () =>
    tutorialProgram?.getTutorialBySlug(slug),
  );

  return {
    tutorial: data,
    loading: !error && !data,
    error,
  };
};
