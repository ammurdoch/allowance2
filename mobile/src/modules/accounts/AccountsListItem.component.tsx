import { Icon, ListItem, Text, Card } from '@ui-kitten/components';
import * as React from 'react';
import { ListRenderItemInfo, View } from 'react-native';
import { Account, AccountsScreenNavProp } from './types';
import formatMoney from '../../utils/format-money.utils';

interface Props extends ListRenderItemInfo<Account> {
  navigation: AccountsScreenNavProp;
}

const AccountsListItem: React.FunctionComponent<Props> = props => {
  const { item, navigation } = props;

  const renderItemHeader = (headerProps: any): React.ReactElement => (
    <View
      {...headerProps}
      style={{
        ...headerProps.style,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Text category="h6">{item.name}</Text>
      <Text>{formatMoney(item.currentBalance)}</Text>
    </View>
  );

  return (
    <Card
      style={{ margin: 8 }}
      status="basic"
      onPress={(): void =>
        navigation.navigate('AccountDetails', {
          title: item.name,
          accountId: item.id,
        })
      }
      header={(headerProps: any): React.ReactElement =>
        renderItemHeader(headerProps)
      }
    >
      <Text appearance="hint">{item.description}</Text>
    </Card>
  );
};

export default AccountsListItem;
