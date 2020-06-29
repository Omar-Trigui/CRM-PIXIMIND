import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import logger from "redux-logger";
import AuthReducer from "../reducers/AuthReducer";
import DealReducer from "../reducers/DealReducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "User",
  timeout: null,
  storage,
  whitelist: ["user", "deal"],
  blacklist: [],
};
const middleware = [thunkMiddleware];
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middleware, logger)
  // other store enhancers if any
);
const reducers = combineReducers({
  user: AuthReducer,
  deal: DealReducer,
});
const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = action.data;
  }

  return reducers(state, action);
};
export const persistedReducers = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducers, enhancer);
export const persistor = persistStore(store);


export default { store, persistor, persistedReducers };
