"use client";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";
import { io, Socket } from "socket.io-client";

// Context

interface IAppContextDefault {
  socket: Socket;
  isConnected: boolean;
  sendToSocketId: ({ event, payload }: any) => void;
  socketId: string | null;
}

const DefautSocketState: IAppContextDefault = {
  socket: {} as Socket,
  isConnected: false,
  sendToSocketId: ({ event, payload }: any) => {},
  socketId: null,
};

export const SocketCtx = createContext<IAppContextDefault>({});

interface Props {
  children: ReactNode;
}

const SocketProvider = ({ children }: Props) => {
  console.log(`${process.env.NEXT_PUBLIC_APP_SOCKET_URL}/kafka`);
  const socket = useMemo(() => {
    return io(`${process.env.NEXT_PUBLIC_APP_SOCKET_URL}/kafka`, {
      reconnectionDelayMax: 10000,
      transports: ["websocket"],
      extraHeaders: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
  }, []);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!socket) return;
    console.log("SocketProvider useEffect", socket);

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    // socket.on('connection', () => {
    //   setIsConnected(true);
    //   console.log('Socket connected');
    // });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
      socket.close();
    };
  }, [socket]);

  const sendToSocketId = useCallback(
    ({ event, payload }: any) => {
      socket.emit("send-to-socket-id", {
        event,
        payload,
      });
    },
    [socket],
  );

  return (
    <SocketCtx.Provider
      value={{
        socket: socket,
        isConnected: isConnected,
        sendToSocketId: sendToSocketId,
      }}
    >
      {children}
    </SocketCtx.Provider>
  );
};

export function useSocket() {
  const { socket, isConnected } = useContext(SocketCtx);

  const onEvent = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (!socket) return;
      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    },
    [socket],
  );

  const sendToAll = useCallback(
    (event, payload) => {
      if (!socket) return;
      socket.emit("send-to-all", {
        event,
        payload,
      });
    },
    [socket],
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      socket.emit("room.join", {
        roomId,
      });
    },
    [socket],
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      socket.emit("room.leave", {
        roomId,
      });
    },
    [socket],
  );

  const sendToRoom = useCallback(
    (roomId, data) => {
      if (!socket) return;
      socket.emit("room.send", {
        roomId,
        data,
      });
    },
    [socket],
  );

  const onRoomMessage = useCallback(
    (callback: (...args: any[]) => void) => {
      if (!socket) return;
      socket.on("room.message", callback);
      return () => {
        socket.off("room.message", callback);
      };
    },
    [socket],
  );

  const onRoomUserJoined = useCallback(
    (callback: (...args: any[]) => void) => {
      if (!socket) return;
      socket.on("room.user.joined", callback);
      return () => {
        socket.off("room.user.joined", callback);
      };
    },
    [socket],
  );

  const onRoomUserLeft = useCallback(
    (callback: (...args: any[]) => void) => {
      if (!socket) return;
      socket.on("room.user.left", callback);
      return () => {
        socket.off("room.user.left", callback);
      };
    },
    [socket],
  );

  return {
    socket,
    isConnected,
    onEvent,
    sendToAll,
    joinRoom,
    leaveRoom,
    onRoomUserJoined,
    onRoomUserLeft,
    onRoomMessage,
    sendToRoom,
    socketId: socket.id,
  };
}

// with socket provider
export function withSocketProvider(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    return (
      <SocketProvider>
        <Component {...props} />
      </SocketProvider>
    );
  };
}

export default SocketProvider;
