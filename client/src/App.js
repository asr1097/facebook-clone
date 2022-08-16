import { useState, useEffect, createContext, useCallback } from "react";
import './styles/App.css';
import { io } from "socket.io-client";
import { Routes, Route } from "react-router-dom";
import { IndexPage } from "./components/post/IndexPage";
import { SearchResults } from "./components/search/SearchResults";
import { ChatWindow } from "./components/chat/ChatWindow";
import { Notifications } from "./components/Notifications";
import { Comment } from "./components/comment/Comment";
import { Post } from "./components/post/Post";
import { Profile } from "./components/profile/Profile";
import { NavBar } from "./components/nav/NavBar";
import { Photos } from "./components/post/Photos";
import { FriendRequests } from "./components/profile/FriendRequests";


const socket = io(`https://pacific-hamlet-40360.herokuapp.com`, {
  autoConnect: false
});

const SocketContext = createContext();
const UserContext = createContext();
const FriendsContext = createContext();

function App() {

  const [user, setUser] = useState();
  const [friends, setFriends] = useState();
  const [receivedFriendRequests, setReceivedFriendRequests] = useState();
  const [friendRequestsCounter, setFriendRequestCounter] = useState();
  const [loggedIn, setloggedIn] = useState();
  const [socketID, setSocketID] = useState();
  const [activeUsers, setActiveUsers] = useState([]);
  const [searchResult, setsearchResult] = useState();

  const [messages, setMessages] = useState({});
  const [activeRoom, setActiveRoom] = useState();
  const [unreadMsgsGlobal, setUnreadMsgsGlobal] = useState();
  const [typing, setTyping] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [notifsActive, setNotifsActive] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState();

  /* Check if user is logged in by checking cookies */
  useEffect(() => {
    let cookies = document.cookie.split(";");
    cookies.forEach(cookie => {
      let regex = new RegExp("loggedIn*");
      cookie.match(regex) ? setloggedIn(true): setloggedIn()
    })
  }, [])

  /* Fetch user data */
  useEffect(() => {
    const fetchUser = async() => {
      const fetchedUserData = await fetch(`/profile/loggedUser`, {
        credentials: "include",
        mode: "cors"  
      })
      const fetchedUser = await fetchedUserData.json()
      setUser(fetchedUser.user);
      setSocketID(fetchedUser.user._id);
      setFriends(fetchedUser.populatedFL.friendsList);
      setReceivedFriendRequests(fetchedUser.populatedFL.receivedRequests)
    };

    if(!user && !socketID && loggedIn) {fetchUser();}

  }, [loggedIn, user, socketID]);

  /* Fetch read notifications when "Notifications" component is active */
  useEffect(() => {

    const readNotifications = () => {
      let readNotifsIDs = [];
      for (let i = 0; i < notifications.length; i++) {
        if(!notifications[i].read) {
        
          readNotifsIDs.push(notifications[i]._id)
        }
        else {break}
      };
      return readNotifsIDs;
    };
    
    const fetchReadNotifs = async() => {
      let notifs = readNotifications();
      if(notifs.length) {
        let formData = new FormData()
        formData.append("notifs", notifs);
        let statusCode = await fetch(`/notifications/read`, {
          mode: "cors",
          credentials: "include",
          method: "post",
          body: formData
        })
        if(statusCode.ok){
          let newNotifications = [...notifications];
          for (let i = 0; i < notifs.length; i++) {
            newNotifications[i].read = true;
          }
          setNotifications(newNotifications);
        }
      } else{return}
    };

    if(notifsActive) {
      setUnreadNotifsCount(0)
      fetchReadNotifs()
    };

  }, [notifsActive, notifications])

  /* Fetch notifications */
  useEffect(() => {
    const fetchNotifications = async() => {
      const fetchedNotifsData = await fetch(`/notifications`, {
        credentials: "include",
        mode: "cors"
      })
      const fetchedNotifs = await fetchedNotifsData.json();
      setNotifications(fetchedNotifs);
    };

    if(user && loggedIn) {fetchNotifications()}

  }, [user, loggedIn])

  /* Count unread notifications */
  useEffect(() => {
    let unreadNotifs = 0;
      for (let i = 0; i < notifications.length; i++) {
        if(!notifications[i].read) {
          unreadNotifs++;
        }
        else {break}
      };
      setUnreadNotifsCount(unreadNotifs);
    }, [notifications])

  /* Fetch messages */
  useEffect(() => {

    const fetchMessages = async() => {
      const fetchedMessagesData = await fetch(`/messages`, {
        credentials: "include",
        mode: "cors" 
      })
      const fetchedMessages = await fetchedMessagesData.json();
      onFetchMessages(fetchedMessages);
    }

    const onFetchMessages = (messages) => {
      let fetchedMessages = {};
      messages.forEach(msg => {
      let friend = msg.from._id === user._id ? msg.to._id : msg.from._id;
      if(friend in fetchedMessages){
        fetchedMessages[friend] = [...fetchedMessages[friend], msg];
      } else {
        fetchedMessages[friend] = [msg];
      };
    })  
    setMessages(fetchedMessages);
    };

    if(user && loggedIn) {fetchMessages()};

  }, [user, loggedIn]);

  /* Count unread messages for NavBar */
  useEffect(() => {
    const checkUnreadMsgsGlobal = () => {
      let counter = 0;
      for (let i = 0; i < Object.keys(messages); i++) {
        let singleChat = messages[i];
        if(!singleChat[singleChat.length - 1].read) {counter++}
      }
      setUnreadMsgsGlobal(counter);
    };

    checkUnreadMsgsGlobal();

  }, [messages]);

  /* Received friend request counter for NavBar */
  useEffect(() => {
    if(receivedFriendRequests){
      setFriendRequestCounter(receivedFriendRequests.length)
    }
  }, [receivedFriendRequests]);

  /* 
    If 2 users haven't chatted before, create empty array in "messages"
    for according friend based on "activeRoom"
  */
  useEffect(() => {
    if(activeRoom && !messages[activeRoom]) {
      setMessages({...messages, [activeRoom]: []})
    }
  }, [activeRoom, messages]);

  const readMessages = useCallback((friend, msgArray=[]) => {
    /* 
     If the chatroom is already active when message from friend is received,
     "msgArray" is passed from socketIO event handler so the received message
     will be marked as "read" imediately.
   */
   let readMessages = [];
   if(msgArray.length){readMessages.push(msgArray[0]._id)}
   
   if(user) {
     if(!msgArray.length && Object.keys(messages).length && friend !== user._id){
       /* 
         When the chatroom is opened, loop messages from the last one 
         and check if it's been read - if not, push it to the "readMessages".
         When first read message is reached, break from the loop.
       */
       for(let i = messages[friend].length - 1; i >= 0; i--) {
         if(messages[friend][i].from._id === friend && !messages[friend][i].read){
           readMessages.push(messages[friend][i]._id)
         }
         else if(messages[friend][i].from._id === friend && messages[friend][i].read){
           break;
         }
       };
     }
   }
   if(readMessages.length) {
     let formData = new FormData();
     formData.append("readMessages", readMessages);
     formData.append("friend", friend);
     fetch(`/messages/read`, {
       credentials: "include",
       method: "post",
       mode: "cors",
       body: formData
     }).then(res => {
       if(res.ok) {
         let newMessages = {...messages};
         if(msgArray.length){newMessages[friend] = [...newMessages[friend], msgArray[0]]}
         else {
           for(let i = newMessages[friend].length - 1; i >= 0; i--){
             if(newMessages[friend][i].read) {break}
             newMessages[friend][i].read = true;
           }
         }
         setMessages(newMessages);
       }
     })
   } else {return 0};
 }, [messages, user]);

  /* SocketIO events handlers */
  useEffect(() => {

    const readMessagesSocket = (friend) => {
      if(friend !== user._id) {
        let newMessages = {...messages};
        for (let i = newMessages[friend].length; i > 0; i--) {
          if(newMessages[friend][i-1].from._id === user._id && !newMessages[friend][i-1].read){
            newMessages[friend][i-1].read = true
          } else{break}
        }
        setMessages(newMessages)
      }
    }

    const onNotification = (notif) => {
      if(notifsActive){notif.read = true};
      let newNotifications = [notif, ...notifications];
      setNotifications(newNotifications);
    }

    const onMessage = (msg) => {
      let sender = msg.from._id;
      let newMessages = {...messages};
      if(sender === activeRoom){
        msg.read = true;
        readMessages(sender, [msg])
        return;
      } else {
        if(sender === user._id) {
          if(msg.to._id in newMessages) {newMessages[msg.to._id] = [...newMessages[msg.to._id], msg]} 
          else {newMessages[msg.to._id] = [msg]};
        }
        else if(sender in newMessages) {
          newMessages[sender] = [...newMessages[sender], msg]
        } 
        else {newMessages[sender] = [msg]}
        setMessages(newMessages);
      }    
    };

    if(loggedIn && socketID){
      socket.auth = { socketID };
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected with ID: " + socket.id);
      });

      socket.on("activeUsers", users => {
        let newActiveUsers = [];
        users.forEach(_user => {
          if(user.friendsList.includes(_user.userID)) {newActiveUsers.push(_user.userID)}
        })
        setActiveUsers(newActiveUsers);
      })

      socket.on("new connection", _user => {
        if(user.friendsList.includes(_user._id)) {
          let newActiveUsers = [...activeUsers, _user._id];
          setActiveUsers(newActiveUsers);
        }
      })

      socket.on("new message", onMessage);

      socket.on("message read", readMessagesSocket);

      socket.on("new notification", onNotification);

      socket.on("typing", friend => {
        if(!typing.includes(friend)) {
          setTyping([...typing, friend])
        }
      });

      socket.on("stopped typing", friend => {
        if(typing.includes(friend)) {
          let newTyping = [...typing];
          newTyping.splice(newTyping.indexOf(friend), 1);
          setTyping(newTyping);
        }
      });

      socket.on("user disconnected", _user => {
        if(activeUsers.includes(_user)) {
          let newActiveUsers = [];
          activeUsers.forEach(activeUser => {
            if(activeUser !== _user) {newActiveUsers.push(activeUser)}
          });
          setActiveUsers(newActiveUsers);
        }
      })
    }

    return () => {
      socket.off("connect");
      socket.off("activeUsers");
      socket.off("new connection");
      socket.off("new message");
      socket.off("message read");
      socket.off("typing");
      socket.off("stopped typing");
      socket.off("user disconnected");
      socket.off("new notification");
    }
  }, 
    [
      loggedIn,
      socketID,
      activeUsers,
      activeRoom,
      notifications,
      notifsActive,
      user,
      messages,
      typing,
      readMessages
    ]);

  return (
    <div className="App">
      <NavBar 
        user={user} 
        loggedIn={loggedIn} 
        unreadNotifsCount={unreadNotifsCount}
        unreadMsgsGlobal={unreadMsgsGlobal}
        friendRequests={friendRequestsCounter}
        searchResult={searchResult}
        setsearchResult={setsearchResult}
      />
      <UserContext.Provider value={user}>
      <SocketContext.Provider value={socket}>
      <FriendsContext.Provider value={friends}>
        <Routes>
          <Route path="/" 
            element={<IndexPage 
              loggedIn={loggedIn}
              user={user}
              />}
            />
          <Route 
            path="/requests"
            element={<FriendRequests 
              requests={receivedFriendRequests} 
              
            />}
          />
          <Route 
            path="/chat" 
            element={<ChatWindow 
              activeUsers={activeUsers}
              messages={messages}
              readMessages={readMessages}
              activeRoom={activeRoom}
              typing={typing}
              setActiveRoom={setActiveRoom}
              />} 
          />
          <Route 
            path="/chat/:id"
            element={<ChatWindow 
              activeUsers={activeUsers}
              messages={messages}
              readMessages={readMessages}
              typing={typing}
              activeRoom={activeRoom}
              setActiveRoom={setActiveRoom}
              />}
          />
          <Route 
            path="/search" 
            element={<SearchResults 
              users={searchResult}
              setsearchResult={setsearchResult}  
              />
            } 
          />
          <Route 
            path="/notifications"
            element={<Notifications 
              notifs={notifications}
              setNotifsActive={setNotifsActive}
              />}
          />
          <Route
            path="/comments/:id"
            element={<Comment />}
          />
          <Route 
            path="/posts/:id"
            element={<Post />}
          />
          <Route 
            path="/profile/:id"
            element={<Profile />}
          />
          <Route 
            path="/profile/:id/photos"
            element={<Photos />}
          />
        </Routes>
      </FriendsContext.Provider>
      </SocketContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export { App, SocketContext, UserContext, FriendsContext };
