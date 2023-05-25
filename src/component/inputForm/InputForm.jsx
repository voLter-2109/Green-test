import React, { useCallback, useContext } from "react";
import style from "./app.module.scss";
import { AuthContext } from "../../Context";
import waIcon from "../../assect/waIcon.svg";

const InputForm = () => {
  const { setFormState, formState, online, statusError, setStatusError } =
    useContext(AuthContext);

    // для оптимизации монж ввести локальный стест и при submit отправлять на проверку в context
  const onChange = useCallback((e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const onSubmitForm = (e) => {
    e.preventDefault();
    setStatusError("");
    online();
  };

  return (
    <div className={style.app}>
      <div className={style.icon}>
        <img src={waIcon} alt="logo" />
        <span>WhatsApp Web</span>
      </div>
      <div className={style.container}>
        <div className={style.left}>
          <span
            style={{
              fontSize: "28px",
              fontWeight: "300",
              lineHeight: "normal",
              color: "#41525d",
            }}
          >
            Используйте Green API
          </span>
          <ol>
            <li>Авторизуйтесь на сайте green-api.com</li>
            <li>Введите ваш IdInstance</li>
            <li>Ввеите ваш ApiTokenInstance</li>
            <li>Введите номер телефона с кем хотите пообщаться</li>
          </ol>
        </div>
        <div className={style.right}>
          <form id="form" onSubmit={onSubmitForm}>
            <div>
              <input
                required
                onChange={onChange}
                value={formState.idInstance}
                name="idInstance"
                type="text"
              />
              <label htmlFor="idInstance" className={style.label}>
                idInstance
              </label>
            </div>

            <div>
              <input
                onChange={onChange}
                value={formState.apiTokenInstance}
                required
                name="apiTokenInstance"
                type="text"
              />
              <label htmlFor="apiTokenInstance"> apiTokenInstance</label>
            </div>

            <div>
              <input
                required
                onChange={onChange}
                value={formState.tel}
                name="tel"
                type="tel"
              />
              <label htmlFor="tel"> tel</label>
            </div>

            <input type="submit" value="Отправить" />
          </form>
        </div>

        {statusError && (
          <span className={style.errorMessage}>{statusError}</span>
        )}
      </div>
    </div>
  );
};

export default InputForm;
