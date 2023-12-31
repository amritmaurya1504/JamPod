import { useCallback, useEffect, useRef, useState } from "react";
import { IState } from "../types";

/*

This hook, useStateWithCallback, takes an initial state (an array of objects with id and name properties) and returns an array containing the current state (state) and a function to update the state (updateState). The updateState function takes two parameters:

1. newState: It can be either a new state value (array of IState) or a function that receives the previous state and returns the new state.
2. cb: A callback function that is stored in a ref (cbRef.current). This callback can be executed after the state is updated.

*/

export const useStateWithCallback = (initialState: IState[]): [IState[],(newState: IState[] | ((prev: IState[]) => IState[]), cb: (state: IState[]) => void) => void
] => {
  const [state, setState] = useState<IState[]>(initialState);
  const cbRef = useRef<((state: IState[]) => void) | undefined>(() => {});

  const updateState = useCallback(
    (newState: IState[] | ((prev: IState[]) => IState[]), cb: (state: IState[]) => void) => {
      cbRef.current = cb;
      setState((prev) => {
        return typeof newState === "function" ? newState(prev) : newState;
      });
    },
    []
  );

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
    }
    cbRef.current = undefined;
  }, [state]);

  return [state, updateState];
};
