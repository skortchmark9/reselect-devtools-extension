import React, { Component, PropTypes } from 'react';

import styles from 'remotedev-app/lib/styles';
import enhance from 'remotedev-app/lib/hoc';
import Button from 'remotedev-app/lib/components/Button';
import MdKeyboardArrowLeft from 'react-icons/lib/md/keyboard-arrow-left';
import MdHelp from 'react-icons/lib/md/help';
import RefreshIcon from 'react-icons/lib/md/refresh';

import SelectorInspector from '../components/SelectorInspector';
import SelectorGraph from '../components/SelectorGraph';
import StateTree from '../components/StateTree';

const contentStyles = {
  content: {
    display: 'flex',
    width: '100%',
    height: '100%',
    position: 'relative',
    flexDirection: 'column',
  },
  state: {
    flexShrink: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
    borderBottomWidth: '3px',
    borderBottomStyle: 'double',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    border: '1px solid rgb(79, 90, 101)',
    padding: '10px',
  },
  graph: {
    flexGrow: 1,
    border: '1px solid rgb(79, 90, 101)',
    position: 'relative',
    height: '100%'
  },
  refreshButton: {
    position: 'absolute',
    top: 0,
    left: 0,
  }
};


function renderMessage(message) {
  const centerText = { margin: 'auto' };
  return (
    <div style={contentStyles.content}>
      <h1 style={centerText}>{message}</h1>
    </div>
  );
}


const Dock = ({ isOpen, children }) => {
  const dockStyle = {
    position: 'absolute',
    background: 'rgb(0, 43, 54)',
    top: 0,
    border: '1px solid rgb(79, 90, 101)',
    transform: `translateX(${isOpen ? 0 : '-100%'})`,
    left: 0,
    height: '100%',
    padding: '10px',
    minWidth: '200px',
    zIndex: 1,
    transition: 'transform 200ms ease-out',
  };

  return (
    <div style={dockStyle}>
      {children}
    </div>
  );
};

const Subheader = ({ style, children, ...props }) => <h5 style={{ ...style, margin: '0.25em' }} {...props}>{children}</h5>;

function openGitRepo() {
  const url = 'https://github.com/skortchmark9/reselect-devtools-extension';
  window.open(url, '_blank');
}



@enhance
export default class App extends Component {
  static propTypes = {
    selectorGraph: PropTypes.func.isRequired,
    checkSelector: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      checkedSelectorData: null,
      checkedSelectorInfo: null,
      graph: 'loading',
      isVisible: true,
    };
    this.handleCheckSelector = this.handleCheckSelector.bind(this);
    this.refreshGraph = this.refreshGraph.bind(this);
    this.resetSelectorData = this.resetSelectorData.bind(this);
  }

  componentDidMount() {
    this.refreshGraph();
  }

  refreshGraph() {
    this.props.selectorGraph()
      .then(graph => this.setState({ graph }))
      .catch(() => this.setState({ graph: null }));
  }

  resetSelectorData() {
    this.setState({ checkedSelectorData: null });
  }

  handleCheckSelector(selectorToCheck) {
    this.setState({ checkedSelectorInfo: selectorToCheck });
    if (!selectorToCheck.isRegistered) {
      this.resetSelectorData();
      return;
    }
    this.props.checkSelector(selectorToCheck.name)
      .then((checkedSelectorData) => {
        this.setState({ checkedSelectorData });
      })
      .catch(this.resetSelectorData);
  }

  renderGraph(graph) {
    const { checkedSelectorData, checkedSelectorInfo } = this.state;

    return (
      <div style={contentStyles.content}>
        <SelectorInspector
          style={contentStyles.state}
          selector={checkedSelectorInfo}
        />
        <div style={contentStyles.graph}>
          <Dock isOpen={checkedSelectorData}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Subheader>checkSelector output</Subheader>
              <Subheader>
                <Button
                  Icon={MdKeyboardArrowLeft}
                  onClick={this.resetSelectorData}
                >hide</Button>
              </Subheader>
            </div>
            <StateTree data={checkedSelectorData} />
          </Dock>
          <SelectorGraph
            checkSelector={this.handleCheckSelector}
            {...graph}
          />
        </div>
      </div>
    );
  }

  renderContent() {
    const { graph } = this.state;
    if (graph === 'loading') {
      return renderMessage('Loading...');
    } else if (graph) {
      return this.renderGraph(graph);
    }
    return renderMessage('Could not load selector graph');
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.buttonBar}>
          <Button
            style={contentStyles.refreshButton}
            Icon={RefreshIcon}
            onClick={this.refreshGraph}
          >Refresh Selector Graph</Button>
          <Button
            Icon={MdHelp}
            onClick={openGitRepo}
          >Help</Button>
        </div>
        { this.renderContent() }
      </div>
    );
  }
}

