import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";
import handleTranslate from "../utils/translator";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), async (doc) => {
      if (doc.exists()) {
        const messagesData = doc.data().messages;

        // Translate each message individually
        const translatedMessagesPromises = messagesData.map(async (message) => {
          const translatedText = await handleTranslate(message.text);
          return { ...message, text: translatedText };
        });

        // Wait for all translations to complete
        Promise.all(translatedMessagesPromises)
          .then((translatedMessages) => {
            setMessages(translatedMessages);
          })
          .catch((error) => {
            console.error("Error translating messages:", error.message);
          });
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((m, index) => (
        <Message message={m} key={index} />
      ))}
    </div>
  );
};

export default Messages;
