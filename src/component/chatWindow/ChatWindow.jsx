import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Context";
import sentIcon from "../../assect/sentIcon.svg";
import style from "./chatWindow.module.scss";

const initTest = [
  {
    textMessage: "hellow 1123123123123123123)",
    idMessage: 1684917943,
    timestamp: 1684949600,
    type: "outgoing",
  },
  {
    textMessage: "hellow 2)",
    idMessage: 1684917943,
    timestamp: 1684949600,
    type: "incoming",
  },
  {
    textMessage: "hellow 3)",
    idMessage: 1684917943,
    timestamp: 1684949600,
    type: "outgoing",
  },
  {
    textMessage: "hellow 4)",
    idMessage: 1684917943,
    timestamp: 1684949600,
    type: "incoming",
  },
];

//! в методах прописан несклько дополнительных проверок для избежания ошибок, так как whatsApp используется в текущей работе

const ChatWindow = () => {
  // все сообщения из getHistory и новые сообщения при получении ReceiveNotification
  const [messages, setMessages] = useState([]);
  // стейт для текущего сообщения в input
  const [message, setMessage] = useState("");
  // в случае если в getHistory, ничего не вернется вывестится оповещение
  const [notMessage, setNotMessage] = useState("");
  // получение данных через context введенных на страницу инициализации
  const { formState, api } = useContext(AuthContext);

  // функция отправки сообщения 
  const sendMessage = () => {
    axios
      .post(api("SendMessage"), {
        chatId: `${formState.tel}@c.us`,
        message: message,
      })
      .then(function (response) {
        console.log("message send");
        setMessage("");
        setNotMessage("");
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };
// функция для преобразования timestamp из ответа ReceiveNotification
  const getTime = useCallback(
    (time) => {
      const newTime = Number(String(time).padEnd(13, "000"));
      const hour = String(new Date(newTime).getHours()).padStart(2, 0);
      const minute = String(new Date(newTime).getMinutes()).padStart(2, 0);
      return hour + ":" + minute;
    },
    [formState]
  );

  // функция для получения оповещения on сервера, дополнительной задержки не требуется так как запрос длится 5 сек.
  // в случае !null введена дополнительная проверка на введенный телефони
  // дополнительная проверка typeWebhook на входящие и исходящие сообщения, от этого зависит style и расположение текста сообщения в body ответа от сервера
  // затем удаляет оповещение из очереди и ждем нового
  const getIdMessageClick = useCallback(() => {
    axios.get(api("ReceiveNotification")).then((res) => {
      if (res.data === null) {
        getIdMessageClick();
        return;
      } else if (
        res.data.body?.senderData?.chatId !== `${formState.tel}@c.us`
      ) {
        delMessageClick(res.data?.receiptId);
        return;
      } else {
        setMessages((prev) => [
          ...prev,
          {
            idMessage: res.data.body.idMessage,
            textMessage: res.data.body.typeWebhook.includes("incoming")
              ? res.data.body.messageData.textMessageData.textMessage
              : res.data.body.messageData.extendedTextMessageData.text,
            timestamp: res.data.body.timestamp,
            type: res.data.body.typeWebhook,
          },
        ]);
        setNotMessage("");
        delMessageClick(res.data.receiptId);
      }
    });
  }, [formState, api]);


  //функция для удаления оповещения из очереди
  const delMessageClick = useCallback(
    (charId) => {
      axios.delete(api("DeleteNotification", charId)).then((res) => {
        getIdMessageClick();
      });
    },
    [api, getIdMessageClick]
  );

  // hook используется при первом рендере для получения предыдущих сообщений
  // если с сервера ничего не пришло, сообщеам об этом пользователю
  useEffect(() => {
    axios
      .post(api("GetChatHistory"), {
        chatId: `${formState.tel}@c.us`,
        count: 4,
      })
      .then((res) => {
        if (res.data.length > 0) {
          res.data.forEach((item) => {
            setMessages((prev) => [
              {
                idMessage: item.idMessage,
                textMessage: item.textMessage,
                timestamp: item.timestamp,
                type: item.type,
              },
              ...prev,
            ]);
          });
        } else {
          setNotMessage("у вас нет сообщений с данным пользователем");
        }
      });
  }, [formState, api]);

  // hook для запуска проверки наличия текущего оповещения
  useEffect(() => {
    getIdMessageClick();
  }, [getIdMessageClick]);

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.chats}>
          <div className={style.chats__header}>
            <h1>Online</h1>
          </div>
          <div className={style.chats__body}>
            <div className={style.chat}>
              <span>{formState.tel}</span>
            </div>
            <div className={style.chat + " " + style.test}></div>
          </div>
        </div>
        <div className={style.messagesWrapper}>
          <div className={style.messagesHeader}>
            <h1>{formState.tel}</h1>
          </div>
          <div className={style.messagesBlock}>
            <div className={style.messages}>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  backgroundColor: "rgb(93, 103, 108)",
                }}
              >
                <span>
                  Используйте WatsApp на своем телефоне, что бы посмотреть более
                  ранние сообщения
                </span>
              </div>
              {notMessage && <span>{notMessage}</span>}
              {messages.map((item) => {
                const styleLr = item.type.includes("incoming")
                  ? "left"
                  : "right";
                return (
                  <div
                    key={item.idMessage}
                    className={style.message + " " + style[styleLr]}
                  >
                    <span>{item.textMessage}</span>
                    <div className={style.time}>{getTime(item.timestamp)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={style.sentBlock}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>
              <img src={sentIcon} alt="sent" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
