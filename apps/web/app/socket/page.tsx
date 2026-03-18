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

  const [event, setEvent] = useState<any[]>([]);

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

    socket.on(queue, (data) => {
      // console.log("Socket connected");
      console.log("Received message from queue", message);

      if (data) {
        const message = JSON.parse(data);

        setEvent((prev) => [...prev, message.message]);
      }
    });

    return () => {
      socket.off(queue);
    };
  }, [socket, queue, isConnected]);

  console.log("event", event);

  const handleConnect = () => {
    socket.emit("subscrible", {
      queue,
    });
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex flex-row">
      <div className="flex flex-col space-y-2 p-3 flex-1">
        <div>
          <div>{isConnected ? "Connected" : "Not connected"}</div>
          <div>{socketId}</div>
        </div>
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
        <Button onClick={handlePublish}>Publish to Kafka</Button>
      </div>

      <div className="flex flex-1">
        <div className="flex flex-col space-y-2 p-3">
          <div className="text-lg font-bold">Received Events:</div>
          <Typing text={"123456789"}></Typing>

          {event.map((e, index) => (
            <div key={index} className="p-2 bg-white rounded shadow">
              <Typing text={e}></Typing>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Socket;
