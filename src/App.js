import React, { useContext } from "react";
import InputForm from "./component/inputForm/InputForm";
import { AuthContext } from "./Context";
import ChatWindow from "./component/chatWindow/ChatWindow";

const App = () => {
  const { statusReq } = useContext(AuthContext);

  return <>{!statusReq ? <InputForm /> : <ChatWindow />}</>;
};

export default App;

// для оптимизации можно прикрутить:
//1. react lazy
//2. error boundary для компонентов
//3. вывод error component в случае ошибок в мелких компонентах,
// что бы избежать подения приложения

//  Context используется для проверки авторизации и выбора текущего компонента

// функции используемые в компонентах, можно вывести собственные хуки
