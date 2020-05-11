import * as React from 'react';
import * as firebase from 'firebase';
import { Account } from './types';
import YesNoDialog from '../common/YesNoDialog.modal';
import { View, StyleSheet } from 'react-native';
import { Text } from '@ui-kitten/components';
import { AccountDetailsScreenNavProp } from './types';
import { formatDate } from '../../utils/format-date.utils';
import formatMoney from '../../utils/format-money.utils';

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
  showDelete?: Account;
  setShowDelete: any;
  navigation: AccountDetailsScreenNavProp;
}

const DeleteAccount: React.FunctionComponent<Props> = props => {
  const { showDelete, setShowDelete, navigation } = props;

  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const handleDeleteAccount = React.useCallback(async (): Promise<void> => {
    if (showDelete) {
      setLoading(true);
      const db = firebase.firestore();
      try {
        await db
          .collection('accounts')
          .doc(showDelete.id)
          .delete();
        setErrorMsg('');
      } catch (err) {
        setErrorMsg(err.message);
      }
      setLoading(false);
      setShowDelete(null);
      navigation.navigate('Accounts');
    }
  }, [navigation, setShowDelete, showDelete]);

  const doCancel = (): void => {
    setShowDelete(null);
    setLoading(false);
    setErrorMsg('');
  };

  return (
    <YesNoDialog
      title="Delete Account"
      question={
        <View style={styles.question}>
          <Text style={styles.question1}>
            Are you sure you want to delete this account?
          </Text>
          {showDelete && (
            <Text style={styles.question2}>
              {`${showDelete.name} (${formatMoney(showDelete.currentBalance)})`}
            </Text>
          )}
        </View>
      }
      yesText="Delete"
      noText="Cancel"
      handleYes={handleDeleteAccount}
      handleNo={doCancel}
      handleCancel={doCancel}
      show={!!showDelete}
      loading={loading}
      loadingMsg={`Deleting "${showDelete && showDelete.name}"`}
      errorMsg={errorMsg}
    />
  );
};

export default DeleteAccount;
