import * as React from 'react';
import {
  OverflowMenu,
  IndexPath,
  TopNavigationAction,
} from '@ui-kitten/components';
import MenuIcon from './icons/MenuIcon.component';

interface Props {
  children: any;
  onSelect: (row: number) => void;
}

const MyOverflowMenu: React.FunctionComponent<Props> = props => {
  const { children, onSelect } = props;

  const [menuVisible, setMenuVisible] = React.useState(false);
  const toggleMenu = (): void => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = (): React.ReactElement => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const onMenuSelect = (index: IndexPath): void => {
    toggleMenu();
    onSelect(index.row);
  };

  return (
    <OverflowMenu
      anchor={renderMenuAction}
      visible={menuVisible}
      onBackdropPress={toggleMenu}
      onSelect={onMenuSelect}
    >
      {children}
    </OverflowMenu>
  );
};

export default MyOverflowMenu;
