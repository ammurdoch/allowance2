import { Account } from './types';
import * as React from 'react';
import * as firebase from 'firebase';
import { AuthContextType } from '../auth/types';

function useAccount(
  authContext: AuthContextType,
  accountId: string,
  setLoading: any,
  setErrorMsg: any,
): Account | undefined {
  const [account, setAccount] = React.useState<Account>();
  React.useEffect(() => {
    async function asyncBootstrap(): Promise<void> {
      setLoading(true);
      const db = firebase.firestore();
      try {
        const doc = await db
          .collection('accounts')
          .doc(accountId)
          .get();
        setAccount(doc.data() as Account);
      } catch (err) {
        setErrorMsg(err.message);
      }
      setLoading(false);
    }
    if (authContext.state.user) {
      asyncBootstrap();
    }
  }, [authContext.state.user, setErrorMsg, setLoading, accountId]);
  return account;
}

export default useAccount;
