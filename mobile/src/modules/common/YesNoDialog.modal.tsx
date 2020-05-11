import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Card, Text, Button } from '@ui-kitten/components';
import LoadingSpinner from './LoadingSpinner.component';

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
  },
  footerBtn: {
    marginHorizontal: 8,
  },
  loadingMsg: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

interface Props {
  title: string;
  question: any;
  yesText: string;
  noText: string;
  handleYes: any;
  handleNo: any;
  handleCancel: any;
  show: boolean;
  loading: boolean;
  loadingMsg: string;
  errorMsg: string;
  cardProps?: string;
}

const YesNoDialog = (props: Props): React.ReactElement => {
  const {
    title,
    question,
    yesText,
    noText,
    handleYes,
    handleNo,
    handleCancel,
    show,
    loading,
    loadingMsg,
    errorMsg,
    cardProps = {},
  } = props;

  const renderHeader = (): React.ReactElement => (
    <Text category="h4" style={styles.header}>
      {title}
    </Text>
  );

  const renderFooter = (): React.ReactElement => (
    <>
      {!loading && (
        <View style={styles.footer}>
          <Button status="basic" onPress={handleNo} style={styles.footerBtn}>
            {noText}
          </Button>
          <Button status="primary" onPress={handleYes}>
            {yesText}
          </Button>
        </View>
      )}
    </>
  );

  return (
    <Modal
      visible={show}
      backdropStyle={styles.backdrop}
      onBackdropPress={handleCancel}
    >
      <Card
        disabled={true}
        header={renderHeader}
        footer={renderFooter}
        {...cardProps}
      >
        {loading && (
          <View>
            <LoadingSpinner />
            {!!loadingMsg && (
              <Text style={styles.loadingMsg}>{loadingMsg}</Text>
            )}
          </View>
        )}
        {!loading && question}
        {!!errorMsg && <Text category="danger">{errorMsg}</Text>}
      </Card>
    </Modal>
  );
};

export default YesNoDialog;
