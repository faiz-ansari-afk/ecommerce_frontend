import React, { createContext, useEffect, useReducer, useState } from "react";
import reducers from "./reducers";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const initialState = {
    cartItemCount : 0,
    openLogin:false,
    openSearch:false,
    isPaymentMethodChecked:false,
    cartReload:false,
    userLoggedInGlobal:false,
    pushNotify:false,
  };

  const [state, dispatch] = useReducer(reducers, {
    ...initialState,
  });

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};