
const initialState = {
  posts: [],
  loading: false,
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_POSTS_SUCCESS":
      return { ...state, posts: action.payload };
    default:
      return state;
  }
}
