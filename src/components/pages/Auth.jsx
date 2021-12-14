import React, { useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import "../../assets/auth.css";
import logoIT from "../../assets/Logo_IT.svg";
import { authEndPoint } from "../../assets/menu";

const cookies = new Cookies();

const Auth = () => {
  const [emailUser, setEmailUser] = useState("");
  const [passwordUser, setPasswordUser] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const URL = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/login`;

    (async () => {
      let apiRes = null;
      try {
        apiRes = await axios
          .post(`${URL}`, {
            email: emailUser,
            password: passwordUser,
          })
          .then((response) => {
            if (response.data.status === "success") {
              cookies.set("token", response.data.token, {
                path: "/",
                expires: new Date(Date.now() + 86400000),
              });
              cookies.set("id", response.data.data.user.id);
              cookies.set("uuid", response.data.data.user.uuid);
              cookies.set("role", response.data.data.user.role);
            }
            setIsLoading(true);
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          })
          .catch((error) => {
            console.log(error.response.status);
            if (error.response.status === 429) {
              return setError(error.response.data);
            }
            setError(
              error.response.data.message === undefined
                ? error.response
                : error.response.data.message
            );
          });
      } catch (err) {
        console.log(err);
        apiRes = err.response;
      } finally {
        console.log(apiRes);
      }
    })();
  };

  return (
    <div className="container">
      <img className="logo-img" src={logoIT} alt="Logo" />
      <div className="card-login card-container login">
        <p id="profile-name" className="profile-name-card">
          Login for IT Portal
        </p>
        <form className="form-signin" onSubmit={handleSubmit}>
          <label className="labelInput" for="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="inputEmail"
            className={`form-control ${error ? "alert" : ""}`}
            onChange={(e) => setEmailUser(e.target.value)}
            placeholder="Email address"
            autofocus
          />
          <label className="labelInput" for="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="inputPassword"
            className={`form-control ${error !== "" ? "alert" : ""}`}
            placeholder="Password"
            onChange={(e) => setPasswordUser(e.target.value)}
          />

          <button
            className="btn-login"
            type="submit"
            disabled={isLoading ? "disabled" : ""}>
            {isLoading ? (
              <>
                <i className="iconify imgLoad" data-icon="fontelico:spin3" />
                Loading
              </>
            ) : (
              "Login"
            )}
          </button>
          {error && <div className="error-msg">{error}</div>}

          <p class="text-note">
            <span
              className="iconify iconImg"
              data-icon="bi:exclamation-triangle-fill"
            />
            Only for internal PT Markindo Rekateknik
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
