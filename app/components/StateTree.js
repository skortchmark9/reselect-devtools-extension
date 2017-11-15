import JSONTree from 'react-json-tree';

import React, { PropTypes } from 'react';

const shouldExpandNode = (keyName, data, level) => (
  level === 1 ? (keyName[0] === 'inputs' || keyName[0] === 'output')
              : level < 4
);


const StateTree = ({
  data, style = {}
}) => (
  <div style={style}>
    <JSONTree
      data={data}
      shouldExpandNode={shouldExpandNode}
      hideRoot
    />
  </div>
);

StateTree.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
};

export default StateTree;
