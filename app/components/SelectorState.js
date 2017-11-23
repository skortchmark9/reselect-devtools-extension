import React, { Component, PropTypes } from 'react';
import StateTree from './StateTree';


const InputsSection = ({ zipped = [] }) => (
  <section>
    <h5>Inputs</h5>
    <table>
      <tbody>
        { zipped.map(([name, input], i) => <tr key={i}>
          <td>{name}</td>
          <td>{input}</td>
        </tr>)}
      </tbody>
    </table>
  </section>
);
InputsSection.propTypes = { zipped: PropTypes.array };

export default class SelectorState extends Component {
  static propTypes = {
    checkedSelector: PropTypes.object
  }
  render() {
    const { checkedSelector } = this.props;
    const { zipped, output } = checkedSelector;
    return (
      <div>
        { zipped && <InputsSection zipped={zipped} /> }
        <section>
          <h5>Output</h5>
          <StateTree data={output} />
        </section>
      </div>
    );
  }
}
