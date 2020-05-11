import { Account } from './types';
import * as React from 'react';
import * as firebase from 'firebase';
import { AuthContextType } from '../auth/types';

function useSubcribeAccount(
  authContext: AuthContextType,
  accountId: string,
  setLoading: any,
  setErrorMsg: any,
): Account | undefined {
  const [account, setAccount] = React.useState<Account>();
  React.useEffect(() => {
    let unsubscribe: () => void | undefined;
    async function asyncBootstrap(): Promise<void> {
      setLoading(true);
      const db = firebase.firestore();
      try {
        unsubscribe = db
          .collection('accounts')
          .doc(accountId)
          .onSnapshot(doc => {
            setAccount(doc.data() as Account);
          });
      } catch (err) {
        setErrorMsg(err.message);
      }
      setLoading(false);
    }
    if (authContext.state.user) {
      asyncBootstrap();
    }
    return (): void => unsubscribe && unsubscribe();
  }, [authContext.state.user, setErrorMsg, setLoading, accountId]);
  return account;
}

export default useSubcribeAccount;
