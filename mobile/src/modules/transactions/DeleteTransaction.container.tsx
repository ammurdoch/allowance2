import * as React from 'react';
import * as firebase from 'firebase';
import { Transaction, Account } from '../accounts/types';
import YesNoDialog from '../common/YesNoDialog.modal';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { TransactionDetailsScreenNavProp } from './types';
import { formatDate } from '../../utils/format-date.utils';

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  question: {
    paddingVertical: 8,
  },
  question1: {
    marginBottom: 8,
    textAlign: 'center',
  },
  question2: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

interface Props {
  showDelete?: Transaction;
  setShowDelete: any;
  navigation: TransactionDetailsScreenNavProp;
  account: Account;
}

const DeleteTransaction: React.FunctionComponent<Props> = props => {
  const { showDelete, setShowDelete, navigation, account } = props;

  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const handleDeleteTransaction = React.useCallback(async (): Promise<void> => {
    if (showDelete) {
      setLoading(true);
      const db = firebase.firestore();
      try {
        await db
          .collection('transactions')
          .doc(showDelete.id)
          .delete();
        await db
          .collection('accounts')
          .doc(account.id)
          .update({
            currentBalance: account.currentBalance - showDelete.amount,
          });
        setErrorMsg('');
      } catch (err) {
        setErrorMsg(err.message);
      }
      setLoading(false);
      setShowDelete(null);
      navigation.goBack();
    }
  }, [
    account.currentBalance,
    account.id,
    navigation,
    setShowDelete,
    showDelete,
  ]);

  const doCancel = (): void => {
    setShowDelete(null);
    setLoading(false);
    setErrorMsg('');
  };

  return (
    <YesNoDialog
      title="Delete Activity"
      question={
        <View style={styles.question}>
          <Text style={styles.question1}>
            Are you sure you want to delete this activity?
          </Text>
          <Text style={styles.question2}>
            {showDelete &&
              `${formatDate(showDelete.createdAt)} "${showDelete.description}"`}
          </Text>
        </View>
      }
      yesText="Delete"
      noText="Cancel"
      handleYes={handleDeleteTransaction}
      handleNo={doCancel}
      handleCancel={doCancel}
      show={!!showDelete}
      loading={loading}
      loadingMsg={`Deleting "${showDelete && showDelete.description}"`}
      errorMsg={errorMsg}
    />
  );
};

export default DeleteTransaction;
