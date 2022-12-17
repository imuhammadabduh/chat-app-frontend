import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { AppContext } from "../../context/appContext";

const ContainerChatBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
`;

const InputChatBox = styled.form`
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  position: absolute;
  z-index: 1;
  /* top: 0; */
  /* border-bottom: 1px solid #505050; */
`;
const InputField = styled.input`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  color: #707070;
  padding: 0 20px;
  &:hover {
    color: #fff;
  }
`;

const MiddleBox = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  width: 100%;
  height: 100%;
  position: absolute;
  /* padding: 10px 20px; */
`;
//
const ContainerFeed = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const RowContainerFeed = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  width: 100%;
  height: 100%;
  /* padding: 0 20px; */
  position: relative;
`;

const TitleFeed = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  padding: 10px 20px;
  width: 100%;
  z-index: 1;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  top: 0;
  left: 0;
  position: absolute;
`;

const IconContainerTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const ListItemContainer = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  padding: 0 20px;
  padding-top: 50px;
  padding-bottom: 50px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: absolute;
  top: 0;
`;

const ItemData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;
const ContainerItemData = styled.div`
  margin-bottom: 10px;
  width: 100%;
  height: 100%;
`;

const PhotoItemData = styled.img`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  width: 50px;
  height: 50px;
  border-radius: 100%;
`;
const ContainerTitleItemData = styled.div`
  display: flex;
  /* align-items: flex-start; */
  /* background-color: #202020; */
  border-radius: 10px;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`;
const SubContainerTitleItemData = styled.div`
  background-color: #202020;
  /* border-radius: 0 20px 20px 20px; */
  padding: 15px 20px;
  justify-content: center;
  flex-direction: column;
  border: 1px solid transparent;

  &:hover {
    color: white;
    border: 1px solid white;
  }
`;
const TitleTopItemData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;
const TitleDownItemData = styled.div``;
const NotifItemData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #202020;
  padding: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 10px;

  &:hover {
    color: white;
    /* border: 1px solid white; */
  }
`;

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const { setUserId } = useContext(AppContext);

  const user = useSelector((state) => state.user);
  const {
    socket,
    currentRoom,
    setMessages,
    messages,
    privateMemberMsg,
    setOpenChat,
    setTargetBox3,
  } = useContext(AppContext);

  const messageEndRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return day + "/" + month + "/" + year;
  }

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  }
  return (
    <ContainerChatBox>
      <MiddleBox>
        <ContainerFeed>
          <RowContainerFeed>
            <TitleFeed>
              <div>Obrolan</div>
              <IconContainerTitle>
                <i
                  onClick={() => {
                    setOpenChat(false);
                    setUserId("");
                  }}
                  class="fa-solid fa-circle-chevron-left"
                ></i>

                {user && !privateMemberMsg?._id && <b>{currentRoom}</b>}
                {user && privateMemberMsg?._id && (
                  <>
                  <b>{privateMemberMsg.name} </b>
                <i
                  onClick={() => {
                    setTargetBox3(1)
                    setOpenChat(false);
                  
                  }}
                  class="fa-regular fa-user"
                ></i>
                </>
                )}
              </IconContainerTitle>
            </TitleFeed>
            <ListItemContainer>
              {user && !privateMemberMsg?._id && (
                <NotifItemData>
                  Anda berada di ruang {currentRoom}
                </NotifItemData>
              )}
              {user && privateMemberMsg?._id && (
                <NotifItemData>
                  Percakapan Anda dengan {privateMemberMsg.name}
                </NotifItemData>
              )}
              {!user && (
                <div className="alert alert-danger">
                  Silahkan login terlebih dahulu!
                </div>
              )}

              {user &&
                messages.map(({ _id: date, messagesByDate }, idx) => (
                  <ItemData key={idx}>
                    <b>{date}</b>
                    {messagesByDate?.map(
                      ({ content, time, from: sender }, msgIdx) => (
                        <ContainerItemData key={msgIdx}>
                          <ContainerTitleItemData
                            style={{
                              alignItems:
                                sender?.email === user?.email
                                  ? "flex-start"
                                  : "flex-end",
                            }}
                          >
                            <SubContainerTitleItemData
                              style={{
                                borderRadius:
                                  sender?.email === user?.email
                                    ? "0 20px 20px 20px"
                                    : "20px 0 20px 20px",
                              }}
                            >
                              <TitleTopItemData>
                                {sender._id === user?._id
                                  ? `Saya (${sender.name})`
                                  : sender.name}
                              </TitleTopItemData>
                              <TitleDownItemData>{time}</TitleDownItemData>
                              <TitleDownItemData>{content}</TitleDownItemData>
                            </SubContainerTitleItemData>
                          </ContainerTitleItemData>
                        </ContainerItemData>
                      )
                    )}
                  </ItemData>
                ))}

              <div ref={messageEndRef} />
            </ListItemContainer>
          </RowContainerFeed>
        </ContainerFeed>
      </MiddleBox>
      <InputChatBox onSubmit={handleSubmit} style={{ bottom: "0" }}>
        <InputField
          style={{ width: "100%" }}
          type={"text"}
          placeholder="Ketik pesan"
          disabled={!user}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <InputField
          disabled={!user}
          style={{ width: "60px" }}
          type={"submit"}
          value="[>"
        />
      </InputChatBox>
    </ContainerChatBox>
  );
};

export default ChatBox;
