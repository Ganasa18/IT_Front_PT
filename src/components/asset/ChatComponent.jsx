import React from "react";

import "../../assets/master.css";
import "../../assets/asset_user.css";
import "../asset/chips.css";

const ChatComponent = () => {
  return (
    <>
      <div className="card-comment">
        <div className="card-title">
          <h2>Comment</h2>
        </div>
        <div className="card-body">
          <div className="container-chat">
            {/* <div className="body-chat" id="style-2">
                  <div className="talk-bubble">
                    <span className="user-name">Username</span>
                    <div class="talktext">
                      <p>
                        Tesst asdawdawd awedagjkdawdgaaaaaaaaaaaaaaaaaaaaaaaaaaa
                      </p>
                    </div>
                    <span className="created">2 Okt 2021 | 10:33 </span>
                  </div>
                  <div className="talk-bubble-right">
                    <span className="user-name">Username</span>
                    <div class="talktext">
                      <p>
                        Hello Thereaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa sdawdadw
                      </p>
                    </div>
                    <span className="created">2 Okt 2021 | 10:33 </span>
                  </div>
                </div> */}

            {/* Empty Chat */}

            <div className="empty-chat">
              <div className="container">
                <i
                  class="iconify icon-chat"
                  data-icon="bi:chat-left-dots-fill"></i>
                <p>Waiting for comment</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="row">
            <div className="col-10">
              <span
                className="iconify icon-attach"
                data-icon="akar-icons:attach"></span>
              <input type="text" className="input-field-comment" />
            </div>
            <div className="col-1">
              <button className="button-send">
                <i class="iconify" data-icon="fluent:send-16-filled"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatComponent;
