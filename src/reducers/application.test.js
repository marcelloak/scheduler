import reducer from 'reducers/application';

describe("Application Reducer", () => {
  it("thows an error with an unsupported type", () => {
    expect(() => reducer({}, { type: null })).toThrowError(
      'reducers[action.type] is not a function'
    );
  });
});