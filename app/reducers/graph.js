import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  fetching: false,
  fetchedSuccessfully: false,
  fetchedOnce: false,
  nodes: {},
  edges: [],
  checkedSelectorId: null,
};

const actionsMap = {
  [ActionTypes.GET_SELECTOR_GRAPH_FAILED](state) {
    return { ...state, fetching: false, fetchedSuccessfully: false };
  },
  [ActionTypes.GET_SELECTOR_GRAPH_SUCCESS](state, action) {
    const { nodes, edges } = action.payload.graph;
    const oldNodes = state.nodes;
    const mergedNodes = {};
    Object.keys(nodes).forEach((key) => {
      mergedNodes[key] = { ...oldNodes[key], ...nodes[key] };
    });

    return {
      ...state,
      fetching: false,
      nodes: mergedNodes,
      edges,
      fetchedSuccessfully: true
    };
  },
  [ActionTypes.GET_SELECTOR_GRAPH](state) {
    return {
      ...state,
      fetchedOnce: true,
      fetching: true,
    };
  },
  [ActionTypes.CHECK_SELECTOR](state, action) {
    return { ...state, checkedSelectorId: action.payload.selector.id };
  },
  [ActionTypes.UNCHECK_SELECTOR](state) {
    return { ...state, checkedSelectorId: null };
  },
  [ActionTypes.CHECK_SELECTOR_SUCCESS](state, action) {
    const { selector } = action.payload;
    const { nodes } = state;
    return {
      ...state,
      nodes: {
        ...nodes,
        [selector.id]: { ...nodes[selector.id], ...selector }
      }
    };
  }
};

export default function graph(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
