import * as React from 'react';
import * as firebase from 'firebase';
import { Transaction } from '../accounts/types';
import YesNoDialog from '../common/YesNoDialog.modal';

interface Props {
  transaction: Transaction;
}

const DeleteTransaction: React.FunctionComponent<Props> = props => {
  return null;
  // const { transaction } = props;
  // return (
  //   <YesNoDialog
  //     title="Remove Lan"
  //     question={
  //       <p>{`Are you sure you want to remove "${showDelete &&
  //         showDelete.label}"?`}</p>
  //     }
  //     yesText="Delete"
  //     noText="Cancel"
  //     handleYes={handleDeleteAnchorLan}
  //     handleNo={(): void => setShowDelete(null)}
  //     handleCancel={(): void => setShowDelete(null)}
  //     show={!!showDelete}
  //     loading={deleteLoading}
  //     loadingMsg={`Deleting ${showDelete && showDelete.label} ...`}
  //     errorMsg={deleteErrors.length ? deleteErrors[0] : ''}
  //   />
  // )
};

export default DeleteTransaction;
