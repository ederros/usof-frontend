
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
}
