import React, { createContext, useState } from "react";
import axios from "axios";
export const AuthContext = createContext(null);

const Context = ({ children }) => {
  // const api = "https://api.green-api.com/waInstance";
  const initialState = { idInstance: "", apiTokenInstance: "", tel: "" };
  const [formState, setFormState] = useState(initialState);
  const [statusReq, setStatus] = useState();
  const [statusError, setStatusError] = useState("");

  const api = (method, charId = "") => {
    return `https://api.green-api.com/waInstance${formState.idInstance}/${method}/${formState.apiTokenInstance}/${charId}`;
  };


  // можно настроить различного рода сообщения для пользователя
  // в зависимости от ответа сервера
  const online = () => {
    axios
      .get(api("getStateInstance"))
      .then((res) => {
        if (res.data.stateInstance === "authorized") {
          setStatus(res.data.stateInstance);
        }
      })
      .catch((error) => setStatusError(error.message));
  };

  const value = {
    setFormState,
    formState,
    online,
    statusReq,
    statusError,
    setStatusError,
    initialState,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default Context;
