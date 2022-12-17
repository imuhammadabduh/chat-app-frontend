import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import api from "../../apis/Api";
import { AppContext } from "../../context/appContext";
import { addNotifications, resetNotifications } from "../../features/userSlice";

const ContainerOptionChat = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const RowContainer = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  width: 100%;
  height: 100%;
  /* padding: 0 20px; */
  position: relative;
`;

const TitleOptionChat = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  font-weight: bold;
  top: 0;
  left: 0;
  padding: 10px 20px;
  position: absolute;
  width: 100%;
  /* @media (max-width: 1000px) {
    padding: 10px 0;
    text-align: center;
  } */
`;
const IconOptionChat = styled.div`
  display: none;
  @media (max-width: 600px) {
    display: unset;
  }
`;

const ListItemContainer = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  /* padding: 0 20px; */
  padding-top: 50px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: absolute;
  top: 0;
  /* @media (max-width: 1000px) {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0;
    padding-top: 50px;
  } */
`;

const ItemData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 20px;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 10px;
  position: relative;

  &:hover {
    background-color: #202020;
    border-right: 3px solid white;
    border-left: 3px solid white;
  }
  /* @media (max-width: 1000px) {
    gap: 0;
  } */
`;

const PhotoItemData = styled.img`
  border: 1px solid #505050;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  position: absolute;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 100%;
`;
const ContainerTitleItemData = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  width: 100%;
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
  padding-left: 60px;
  width: 100%;
  /* @media (max-width: 1000px) {
    display: none;
  } */
`;
const TitleDownItemData = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center; */
  width: 100%;
  padding-left: 60px;
  /* max-width: 200px; */
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  /* @media (max-width: 1000px) {
    display: none;
  } */
`;
const OnlineInfo = styled.div`
  padding: 5px;
  background-color: aliceblue;
  border-radius: 10px;
  position: absolute;
  top: 3px;
  left: 20px;
`;
const OptionChat = () => {
  // start

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
    setOpenChat,
    setUserId,
    setTargetBox3,
  } = useContext(AppContext);
  console.log("members", members);
  function joinRoom(room, isPublic = true) {
    if (!user) {
      return alert("Please login");
    }
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }
    // dispatch for notifications
    dispatch(resetNotifications(room));
  }

  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom !== room) dispatch(addNotifications(room));
  });

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
    }
  }, []);

  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  function getRooms() {
    fetch(api + "/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  }

  function handlePrivateMemberMsg(member) {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

  if (!user) {
    return <></>;
  }

  return (
    <ContainerOptionChat>
      <RowContainer style={{ borderBottom: "1px solid #505050" }}>
        <TitleOptionChat>
          Grup
          <IconOptionChat>
            <i
              onClick={() => setTargetBox3(0)}
              class="fa-solid fa-circle-chevron-left"
            ></i>
          </IconOptionChat>
        </TitleOptionChat>
        <ListItemContainer>
          {rooms.map((room, idx) => (
            // <ListGroup.Item  style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
            <ItemData
              key={idx}
              onClick={() => {
                joinRoom(room.room);
                setOpenChat(true);
              }}
              active={room === currentRoom}
            >
              <PhotoItemData
                style={{ borderRadius: 10 }}
                src={
                  "https://boring-avatars-api.vercel.app/api/avatar?size=150&variant=beam&square=true&name=" +
                  room.room
                }
              />
              <ContainerTitleItemData>
                <TitleTopItemData>
                  {room.room}
                  {currentRoom !== room.room && (
                    <span className="badge rounded-pill bg-primary">
                      {user.newMessages[room.room]}
                    </span>
                  )}
                </TitleTopItemData>

                <TitleDownItemData>
                  Publik - {room.dataCount} obrolan
                </TitleDownItemData>
              </ContainerTitleItemData>
            </ItemData>
          ))}
        </ListItemContainer>
      </RowContainer>

      <RowContainer>
        <TitleOptionChat>Teman</TitleOptionChat>
        <ListItemContainer>
          {members.map((member) => (
            <ItemData
              key={member.id}
              style={{ cursor: "pointer" }}
              active={privateMemberMsg?._id === member?._id}
              onClick={() => {
                handlePrivateMemberMsg(member);
                setOpenChat(true);
                setUserId(member._id);
              }}
              // disabled={member._id === user._id}
            >
              <PhotoItemData src={"https://robohash.org/" + member._id} />
              {/* <img src={member.picture} className="member-status-img" /> */}
              <OnlineInfo
                style={{
                  backgroundColor:
                    member.status === "online" ? "#00cc00" : "gray",
                }}
              ></OnlineInfo>
              <ContainerTitleItemData>
                <TitleTopItemData>
                  <span>
                    {member.name}
                    {member._id === user?._id && " (You)"}
                    <span className="badge rounded-pill bg-primary">
                      {user.newMessages[orderIds(member._id, user._id)]}
                      {console.log(
                        user.newMessages[orderIds(member._id, user._id)]
                      )}
                    </span>
                  </span>
                </TitleTopItemData>
                <TitleDownItemData>
                  {member.email}
                </TitleDownItemData>
              </ContainerTitleItemData>
            </ItemData>
          ))}
        </ListItemContainer>
      </RowContainer>
    </ContainerOptionChat>
  );
};

export default OptionChat;
