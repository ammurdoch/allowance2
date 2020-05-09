export type AccountsStackParamList = {
  Accounts: undefined;
  CreateAccount: undefined;
  AccountDetails: { title: string; accountId: string };
  EditAccount: undefined;
  CreateTransaction: { accountId: string };
  TransactionDetails: undefined;
};

export type Account = {
  id: string;
  name: string;
  description: string;
  startingBalance: number;
  currentBalance: number;
  orgId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountsScreenNavProp = StackNavigationProp<
  AccountsStackParamList,
  'Accounts'
>;

export type Transaction = {
  id: string;
  description: string;
  category: string;
  amount: number;
  accountId: string;
  orgId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountDetailsScreenNavProp = StackNavigationProp<
  AccountsStackParamList,
  'AccountDetails'
>;
