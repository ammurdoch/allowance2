import { Transaction } from '../accounts/types';
import * as React from 'react';
import * as firebase from 'firebase';

type TransactionsAction = {
  type: string;
  data: any;
  accountId: string;
  nextCursor: any;
  error?: Error;
};

type TransactionsState = {
  loading: boolean;
  errorMsg: string;
  transactions: Transaction[] | null;
  nextCursor: any;
  accountId: string;
  hasMore: boolean;
};

type TransactionReducer = (
  state: TransactionsState,
  action: any,
) => TransactionsState;

type UserTransactionsResult = {
  doQuery: (limit: number, cursor: any) => Promise<void>;
  loading: boolean;
  errorMsg: string;
  transactions: Transaction[] | null;
  nextCursor: any;
  hasMore: boolean;
};

const initialState: TransactionsState = {
  loading: false,
  errorMsg: '',
  transactions: null,
  nextCursor: null,
  accountId: '',
  hasMore: true,
};

function transactionsReducer(
  state: TransactionsState,
  action: TransactionsAction,
): TransactionsState {
  switch (action.type) {
    case 'start-query':
      return {
        ...state,
        loading: true,
        errorMsg: '',
      };
    case 'pagination-query':
      if (action.accountId !== state.accountId) {
        return {
          loading: false,
          errorMsg: '',
          transactions: action.data,
          nextCursor: action.nextCursor,
          accountId: action.accountId,
          hasMore: !!action.data.length,
        };
      }
      return {
        loading: false,
        errorMsg: '',
        transactions: [...(state.transactions || []), ...action.data],
        nextCursor: action.nextCursor,
        accountId: action.accountId,
        hasMore: !!action.data.length,
      };
    case 'query-error':
      return {
        ...state,
        loading: false,
        errorMsg: (action.error && action.error.message) || '',
      };
    case 'change-create':
      if (action.accountId === state.accountId) {
        return {
          ...state,
          transactions: [action.data, ...(state.transactions || [])],
          accountId: action.accountId,
        };
      }
      return state;
    case 'change-update':
      if (action.accountId === state.accountId && state.transactions) {
        const index = state.transactions.findIndex(
          t => t.id === action.data.id,
        );
        return {
          ...state,
          transactions: [
            ...state.transactions.slice(0, index),
            action.data,
            ...state.transactions.slice(index + 1),
          ],
          accountId: action.accountId,
        };
      }
      return state;
    case 'change-delete':
      if (action.accountId === state.accountId && state.transactions) {
        return {
          ...state,
          transactions: state.transactions.filter(t => t.id !== action.data.id),
          accountId: action.accountId,
        };
      }
      return state;
    default:
      return state;
  }
}

export default function useTransactions(
  accountId: string,
  user: firebase.User | null,
): UserTransactionsResult {
  const [state, dispatch] = React.useReducer<TransactionReducer, any>(
    transactionsReducer,
    initialState,
    () => initialState,
  );

  const doQuery = React.useCallback(
    async (limit: number, cursor: any): Promise<void> => {
      if (user) {
        dispatch({
          type: 'start-query',
          accountId,
        });
        const db = firebase.firestore();
        try {
          const query = db
            .collection('transactions')
            .where('accountId', '==', accountId)
            .where('orgId', '==', user.uid)
            .orderBy('updatedAt', 'desc');
          let querySnapshot;
          if (cursor) {
            querySnapshot = await query
              .startAfter(cursor)
              .limit(limit)
              .get();
          } else {
            querySnapshot = await query.limit(limit).get();
          }
          const _transactions: Transaction[] = [];
          let _cursor = null;
          querySnapshot.forEach((doc: any): void => {
            _transactions.push(doc.data());
            _cursor = doc;
          });
          dispatch({
            type: 'pagination-query',
            data: _transactions,
            accountId,
            nextCursor: _cursor,
          });
        } catch (err) {
          dispatch({
            type: 'query-error',
            accountId,
            error: err,
          });
        }
      }
    },
    [user, accountId],
  );

  React.useEffect(() => {
    if (user) {
      const db = firebase.firestore();
      const unsubscribe = db
        .collection('transactions')
        .where('accountId', '==', accountId)
        .where('orgId', '==', user.uid)
        .orderBy('updatedAt', 'desc')
        .onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {
            if (change.type === 'added') {
              dispatch({
                type: 'change-create',
                data: change.doc.data(),
                accountId,
              });
            }
            if (change.type === 'modified') {
              dispatch({
                type: 'change-update',
                data: change.doc.data(),
                accountId,
              });
            }
            if (change.type === 'removed') {
              dispatch({
                type: 'change-delete',
                data: change.doc.data(),
                accountId,
              });
            }
          });
        });
      return (): void => unsubscribe();
    }
  }, [accountId, user]);

  return {
    doQuery,
    loading: state.loading,
    errorMsg: state.errorMsg,
    transactions: state.transactions,
    nextCursor: state.nextCursor,
    hasMore: state.hasMore,
  };
}
