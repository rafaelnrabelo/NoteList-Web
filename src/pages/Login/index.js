import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { AiFillFacebook } from "react-icons/ai";
import { FiArrowRightCircle } from "react-icons/fi";

import "./styles.css";
import { FACEBOOK_ID } from "../../.env.json";
import api from "../../services/api";

import loginImage from "../../assets/login.svg";
import Logo from "../../assets/logo.png";

export default function Login() {
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("User")) {
      history.push("/notes");
    }
  }, [history]);

  async function Login(data) {
    const props = {
      id: data.id,
      name: data.name,
      email: data.email,
    };
    try {
      await api.post("/users", props);
      localStorage.setItem("User", JSON.stringify(props));
      history.replace("/notes");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="MobileBack">
        <div className="Mobile">
          <img src={Logo} className="Logo" alt="Logo" />
          <div className="TextContainer">
            <h1 className="Title">
              Baixe o Aplicativo <strong>Mobile</strong>
            </h1>
            <h1 className="Title">
              ou use o Site pelo <strong>Desktop</strong>
            </h1>
          </div>
        </div>
      </div>
      <div className="BackContainer">
        <div className="LoginContainer">
          <img src={Logo} className="Logo" alt="Logo" />
          <h1 className="Title">Faça Login</h1>
          <span className="Description">
            - Sincronize suas anotações com o app mobile. <br />- Acesse suas
            anotações de qualquer lugar.
          </span>
          <FacebookLogin
            appId={FACEBOOK_ID}
            fields="name,email"
            language="pt_BR"
            callback={Login}
            render={(renderProps) => (
              <button className="LoginButton" onClick={renderProps.onClick}>
                <AiFillFacebook className="FBIcon" size={32} color="#fff" />
                <p>Login com o Facebook</p>
              </button>
            )}
          />
          <Link to="/notes" replace className="ContinueButton">
            <FiArrowRightCircle size={21} color="#da552f" />
            <p>Continuar sem fazer Login</p>
          </Link>
        </div>
        <img src={loginImage} className="LoginImage" alt="Login" />
      </div>
    </>
  );
}
