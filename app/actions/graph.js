import * as types from '../constants/ActionTypes';

export function uncheckSelector() {
  return { type: types.UNCHECK_SELECTOR };
}

export function checkSelectorFailed() {
  return { type: types.CHECK_SELECTOR_FAILED };
}

export function checkSelectorSuccess(selector) {
  return { type: types.CHECK_SELECTOR_SUCCESS, payload: { selector } };
}

export function checkSelector(selector) {
  const { id } = selector;
  return async (dispatch) => {
    dispatch({ type: types.CHECK_SELECTOR, payload: { selector } });
    try {
      const checked = await Promise.resolve({ inputs: [], output: 2, id, name: id });
      dispatch(checkSelectorSuccess(checked));
    } catch (e) {
      dispatch(checkSelectorFailed());
    }
  };
}


export function getSelectorGraphFailed() {
  return { type: types.GET_SELECTOR_GRAPH_FAILED };
}

export function getSelectorGraphSuccess(graph) {
  return { type: types.GET_SELECTOR_GRAPH_SUCCESS, payload: { graph } };
}

export function getSelectorGraph() {
  return async (dispatch) => {
    dispatch({ type: types.GET_SELECTOR_GRAPH });
    try {
      const a = { id: 'a', recomputations: 10, isRegistered: true };
      const b = { id: 'b', recomputations: 10, isRegistered: true };
      const graph = { nodes: { a, b }, edges: [{ from: 'a', to: 'b' }] };
      await Promise.resolve(graph);
      dispatch(getSelectorGraphSuccess(graph));
      return graph;
    } catch (e) {
      dispatch(getSelectorGraphFailed());
    }
  };
}
