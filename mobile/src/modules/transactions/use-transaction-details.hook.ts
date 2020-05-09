import { Transaction } from '../accounts/types';
import * as React from 'react';
import * as firebase from 'firebase';
import { AuthContextType } from '../auth/types';

function useTransactionDetails(
  authContext: AuthContextType,
  transactionId: string,
  setLoading: any,
  setErrorMsg: any,
): Transaction | undefined {
  const [transaction, setTransaction] = React.useState<Transaction>();
  React.useEffect(() => {
    async function asyncBootstrap(): Promise<void> {
      setLoading(true);
      const db = firebase.firestore();
      try {
        const doc = await db
          .collection('transactions')
          .doc(transactionId)
          .get();
        setTransaction(doc.data() as Transaction);
      } catch (err) {
        setErrorMsg(err.message);
      }
      setLoading(false);
    }
    if (authContext.state.user) {
      asyncBootstrap();
    }
  }, [authContext.state.user, setErrorMsg, setLoading, transactionId]);
  return transaction;
}

export default useTransactionDetails;
