import { useEffect } from 'react';
import { useStores } from 'hooks/useStores';

export const useSetTitle = (title: string) => {
  const { uiStore: { setTitle } } = useStores();
  useEffect(() => {
    setTitle(title);
    return setTitle('');
  }, [title]);
  return null;
};
