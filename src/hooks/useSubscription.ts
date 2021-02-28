import { SubscriptionOptions, useApolloClient } from '@apollo/client';
import { GraphQLError } from 'graphql/error/GraphQLError';
import _ from 'lodash';
import { useEffect, useState } from 'react';

interface SubscriptionResult {
  data: any;
  loading: boolean;
  unSubscribe?: () => void;
}

export const useSubscription = (options: SubscriptionOptions, onErrors: (errors: readonly GraphQLError[] | undefined) => void): SubscriptionResult => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState<boolean>(true);
  const client = useApolloClient();
  useEffect(() => {
    const subscriber = client.subscribe(options).subscribe(({ data, errors }) => {
      if (!_.isEmpty(errors)) {
        onErrors(errors);
      }
      !_.isEmpty(data) && setData(data);
      setLoading(false);
    });
    return () => {
      console.log('unsubscribe now');
      subscriber.unsubscribe();
    };
  }, []);

  return { data, loading };
};
