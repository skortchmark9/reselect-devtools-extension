import React, { PropTypes } from 'react';
import Button from 'remotedev-app/lib/components/Button';
import MdHelp from 'react-icons/lib/md/help';
import RefreshIcon from 'react-icons/lib/md/refresh';
import styles from 'remotedev-app/lib/styles';


const headerStyles = {
  refreshButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
};

export default function Header({ onRefresh, onHelp }) {
  return (
    <header style={styles.buttonBar}>
      <Button
        style={headerStyles.refreshButton}
        Icon={RefreshIcon}
        onClick={onRefresh}
      >Refresh Selector Graph</Button>
      <Button
        Icon={MdHelp}
        onClick={onHelp}
      >Help</Button>
    </header>
  );
}

Header.propTypes = {
  onRefresh: PropTypes.func,
  onHelp: PropTypes.func,
};
