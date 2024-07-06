import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  // Predefined questions and answers
  const predefinedQA = {
    "What is the warranty of the product?": "Sale Buddy: The warranty is of 3 years.",
    "Is the product waterproof?": "Sale Buddy: Yes the product is waterproof."
    // Add more predefined questions and answers as needed
  };

  const handleSendSystemMessage = async (answer) => {
    // Function to send a system message with the predefined answer
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text: answer,
        senderId: "system", // Special ID for system messages
        date: Timestamp.now(),
      }),
    });
  };

  const handleSend = async () => {
    const trimmedText = text.trim();
    const predefinedAnswer = predefinedQA[trimmedText];

    // Send user message to the chat
    if (trimmedText) {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: trimmedText,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: "", // No image for text messages
        }),
      });
    }

    // If the message matches a predefined question, also send the system answer
    if (predefinedAnswer) {
      await handleSendSystemMessage(predefinedAnswer);
      setText(""); // Clear the input after sending
      return; // Exit to avoid further processing
    }

    // Handling for sending images remains unchanged
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (error) => {
          //TODO: Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: trimmedText, // Include text if any
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    }

    // Update the last message in userChats for both the sender and receiver
    if (trimmedText || img) { // Ensure we only update if there's a message or an image
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatId + ".lastMessage"]: { text: trimmedText },
        [data.chatId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: { text: trimmedText },
        [data.chatId + ".date"]: serverTimestamp(),
      });
    }

    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;