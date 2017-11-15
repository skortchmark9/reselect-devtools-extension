import React, { Component, PropTypes } from 'react';

const headerStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  margin: 0,
  marginRight: '10px',
  flexWrap: 'nowrap',
  whiteSpace: 'nowrap',
};

export default class SelectorInspector extends Component {
  static propTypes = {
    selector: PropTypes.object,
    style: PropTypes.object,
  }

  renderRecomputations(recomputations) {
    const style = { ...headerStyle, color: 'rgb(111, 179, 210)' };
    let message = `(${recomputations} recomputations)`;
    if (recomputations === null) {
      message = '(not memoized)';
    }
    return <h5 style={style}>{message}</h5>;
  }

  render() {
    const { style, selector } = this.props;
    if (!selector) {
      return (
        <div style={style}>
          <h1 style={headerStyle}>Choose a selector</h1>
        </div>
      );
    }

    const { name, isRegistered, recomputations } = selector;
    return (
      <div style={style}>
        <h1 style={headerStyle}>{name}</h1>
        <div style={{flexShrink: 0}}>
          { this.renderRecomputations(recomputations) }
          { !isRegistered &&
            <h5 style={{ ...headerStyle, color: 'rgb(111, 179, 210)' }}>
              (unregistered)
            </h5>
          }
        </div>
      </div>
    );
  }
}
