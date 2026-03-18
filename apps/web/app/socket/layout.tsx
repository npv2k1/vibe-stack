import React, { PropsWithChildren } from "react";
import ApiProvider from "../services";

const SocketLayout = ({ children }: PropsWithChildren) => {
  return <ApiProvider>{children}</ApiProvider>;
};

export default SocketLayout;
