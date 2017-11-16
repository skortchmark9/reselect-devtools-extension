import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styles from 'remotedev-app/lib/styles';
import enhance from 'remotedev-app/lib/hoc';
import Button from 'remotedev-app/lib/components/Button';
import MdKeyboardArrowLeft from 'react-icons/lib/md/keyboard-arrow-left';
import MdKeyboardArrowRight from 'react-icons/lib/md/keyboard-arrow-right';
import MdHelp from 'react-icons/lib/md/help';
import RefreshIcon from 'react-icons/lib/md/refresh';

import * as SelectorActions from '../actions/graph';

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

const Subheader = ({ style, children, ...props }) => <h5 style={{ ...style, margin: 0 }} {...props}>{children}</h5>;

const Dock = ({ isOpen, toggleDock, children }) => {
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
  const showButtonStyle = {
    position: 'relative',
    right: 0,
    top: 0,
    transition: 'transform 200ms ease-out',
    transform: `translateX(${isOpen ? 0 : '100%'})`,
  };
  return (
    <div style={dockStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Subheader>checkSelector output</Subheader>
        <Subheader style={showButtonStyle}>
          <Button
            Icon={isOpen ? MdKeyboardArrowLeft : MdKeyboardArrowRight}
            onClick={toggleDock}
          >{isOpen ? 'hide output' : 'show output'}</Button>
        </Subheader>
      </div>
      {children}
    </div>
  );
};

function openGitRepo() {
  const url = 'https://github.com/skortchmark9/reselect-devtools-extension';
  window.open(url, '_blank');
}


@connect(
  state => ({
    graph: state.graph,
    checkedSelector: state.graph.nodes[state.graph.checkedSelectorId]
  }),
  dispatch => ({
    actions: bindActionCreators(SelectorActions, dispatch)
  })
)
@enhance
export default class App extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    graph: PropTypes.object,
    checkedSelector: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      dockIsOpen: true,
    };
    this.handleCheckSelector = this.handleCheckSelector.bind(this);
    this.refreshGraph = this.refreshGraph.bind(this);
    this.toggleDock = this.toggleDock.bind(this);
  }

  componentDidMount() {
    this.refreshGraph();
  }

  refreshGraph() {
    this.props.actions.getSelectorGraph();
  }

  resetSelectorData() {
    this.props.actions.uncheckSelector();
  }

  toggleDock() {
    this.setState({
      dockIsOpen: !this.state.dockIsOpen,
    });
  }

  handleCheckSelector(selectorToCheck) {
    if (!selectorToCheck.isRegistered) {
      this.resetSelectorData();
      return;
    }
    this.props.actions.checkSelector(selectorToCheck);
  }

  renderGraph(graph) {
    const { checkedSelector } = this.props;
    const { dockIsOpen } = this.state;

    return (
      <div style={contentStyles.content}>
        <SelectorInspector
          style={contentStyles.state}
          selector={checkedSelector}
        />
        <div style={contentStyles.graph}>
          <Dock isOpen={dockIsOpen} toggleDock={this.toggleDock}>
            { checkedSelector ?
              <StateTree data={checkedSelector} /> :
              <span>No Data</span>
            }
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
    const { graph } = this.props;
    if (graph.fetchedSuccessfully) return this.renderGraph(graph);
    if (graph.fetching) return renderMessage('Loading...');
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

