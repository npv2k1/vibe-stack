"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "../services/socket/socket";
import { useKafkaPublishMutation } from "../services/vibe/kafka.query";
import { Button, Form, FormSchema, FormType, Typing } from "@vibe-stack/ui";

const Socket = () => {
  const { isConnected, socketId, socket } = useSocket();

  const [message, setMessage] = useState("");

  const [queue, setQueue] = useState("");

  const { mutateAsync } = useKafkaPublishMutation();

  const [event, setEvent] = useState([]);

  const handlePublish = async () => {
    try {
      await mutateAsync({
        queue,
        content: {
          message,
        },
      });
    } catch (error) {
      console.error("Publish error", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(queue, (message) => {
      // console.log("Socket connected");
      console.log("Received message from queue", message);
    });
  }, [socket, queue]);

  const handleConnect = () => {
    socket.emit("subscrible", {
      queue,
    });
  };

  return (
    <div className="w-screen h-screen bg-gray-100">
      <div>{isConnected ? "Connected" : "Not connected"}</div>
      <div>{socketId}</div>

      <div>
        <input
          type="text"
          placeholder="Queue"
          value={queue}
          onChange={(e) => setQueue(e.target.value)}
        />
        <Button onClick={handleConnect}>Subscrible to Kafka Queue</Button>
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handlePublish}>Publish to Kafka</button>
      </div>

      <Typing text="Nếu thấy Emotion code được inline vào file → fix thành công. Nếu không thấy → vẫn đang bị external."></Typing>
      <FormSchema
        config={[
          {
            type: FormType.Text,
            name: "queue",
          },
        ]}
      ></FormSchema>
    </div>
  );
};

export default Socket;
