const initialState = {
  Auth: {},
  group : {}
};

function AuthReducer(state = initialState, action) {
  let nextState;
  switch (action.type) {
    case "SET_AUTH":
      nextState = {
        ...state,
        Auth: action.data,
      };
      return nextState;
    case "SET_GROUP" : 
      nextState = {
        ...state,
        group: action.data,
      };
      return nextState;

    default:
      return state;
  }
}
export default AuthReducer;
