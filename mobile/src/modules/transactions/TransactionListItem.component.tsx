import { ListItem, Text, Icon } from '@ui-kitten/components';
import * as React from 'react';
import { View } from 'react-native';
import { formatDate } from '../../utils/format-date.utils';
import {
  AccountDetailsScreenNavProp,
  Transaction,
  Account,
} from '../accounts/types';
import ForwardIcon from '../common/icons/ForwardIcon.component';
import formatMoney from '../../utils/format-money.utils';
import { CategoryObject } from '../categories/types';
import { withStyles } from '@ui-kitten/components';

interface Props {
  item: Transaction;
  navigation: AccountDetailsScreenNavProp;
  categories: CategoryObject;
  account?: Account;
  eva?: any;
}

const TransactionListItem: React.FunctionComponent<Props> = props => {
  const { item, navigation, categories, account, eva } = props;

  const category = item && categories && categories[item.category];

  return (
    <ListItem
      accessoryRight={ForwardIcon}
      onPress={(): void =>
        navigation.navigate('TransactionDetails', {
          transactionId: item.id,
          account,
        })
      }
    >
      <View style={eva.style.item}>
        <View style={eva.style.left}>
          <Text style={eva.style.description}>{item.description}</Text>
          <Text appearance="hint" style={eva.style.date}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        {category && (
          <View style={eva.style.category}>
            <Icon
              style={eva.style.icon}
              name={category.icon}
              fill="white"
              pack={category.iconPack}
            />
            <Text appearance="alternative" style={eva.style.categoryLabel}>
              {category.label}
            </Text>
          </View>
        )}
        <View style={eva.style.right}>
          <Text style={eva.style.amount}>{formatMoney(item.amount)}</Text>
        </View>
      </View>
    </ListItem>
  );
};

const ThemedTransactionListItem = withStyles(TransactionListItem, theme => ({
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  left: {
    marginRight: 16,
  },
  right: {
    marginLeft: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  description: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
  },
  amount: {},
  category: {
    flexDirection: 'row',
    backgroundColor: theme['color-info-default'],
    alignSelf: 'center',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  icon: {
    height: 20,
    width: 20,
    marginRight: 4,
    color: 'white',
  },
  categoryLabel: {
    fontSize: 12,
  },
}));

export default ThemedTransactionListItem;
