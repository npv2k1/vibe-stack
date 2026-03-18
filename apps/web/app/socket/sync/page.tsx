"use client";

import { Input, TextInput } from "@vibe-stack/ui";
import React, { useEffect, useState } from "react";
import { useSocket } from "../../services/socket/socket";
import { useKafkaPublishMutation } from "../../services/vibe/kafka.query";

const CustomInput = ({ value, onChange }) => {
  return (
    <input
      value={value}
      onChange={(e) => {
        console.log("e.target.value", e);
        onChange(e.target.value);
      }}
      placeholder="Type a message"
    />
  );
};

export const useSyncData = (event = "sync-data") => {
  const { isConnected, socketId, socket } = useSocket();
  const { mutateAsync } = useKafkaPublishMutation();
  const [message, setMessage] = useState<any>({});

  const sendMessage = async (content: any) => {
    try {
      await mutateAsync({
        queue: event,
        content: content,
      });
    } catch (error) {
      console.error("Publish error", error);
    }
  };

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on(event, (data) => {
      // console.log("Socket connected");
      console.log("Received message from queue", message);

      if (data) {
        const message = JSON.parse(data);

        setMessage(message);
      }
    });

    socket.emit("subscrible", {
      queue: event,
    });

    return () => {
      socket.off(event);
    };
  }, [socket, isConnected]);

  return {
    message,
    sendMessage,
  };
};

const SyncPage = () => {
  const [text, setText] = useState("");

  const { message, sendMessage } = useSyncData();

  useEffect(() => {
    if (text) {
      sendMessage({
        value: text,
      });
    }
  }, [text]);

  return (
    <div className="flex p-2 flex-col">
      <TextInput
        value={text}
        onChange={(value) => {
          console.log("e.target.value", value);
          // setMessage(value);
          setText(value);
        }}
      />

      <div className="ml-4">Received: {message?.value}</div>
    </div>
  );
};

export default SyncPage;
