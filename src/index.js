import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import MainRoot from "./routes/MainRoot";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "antd/dist/antd.css";
import "./assets/style.css";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <MainRoot />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
