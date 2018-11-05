// @flow

type TypicalSelector = (state: Object, ...otherArgs: Array<any>) => any;
type StateBoundSelector = (...otherArgs: Array<any>) => any;

type TypicalSelectors = {
  [someSelector: string]: TypicalSelector | TypicalSelectors
};

type StateBoundSelectors = {
  [someSelector: string]: StateBoundSelector | StateBoundSelectors
};

type SubStateGetter = string | ((globalState: Object) => Object);

export type BindSelectorsToState = (
  subStateGetter: SubStateGetter,
  selectors: TypicalSelectors
) => {
  [someSelector: string]: StateBoundSelectors
};
