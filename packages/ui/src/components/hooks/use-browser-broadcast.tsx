import { useCallback, useEffect, useRef } from 'react';

import useUUID from './use-uuid';
/**
 * Custom hook to create and manage a BroadcastChannel for inter-tab communication.
 *
 * @param {string} channel - The name of the broadcast channel.
 * @param {Function} [callback] - Optional callback function to handle incoming messages.
 * @returns {Object} An object containing the `sendMessage` function.
 *
 * @example
 * const { sendMessage } = useBrowserBroadcast('my-channel', (message) => {
 *   console.log('Received message:', message);
 * });
 *
 * sendMessage('Hello, world!');
 */
export const useBrowserBroadcast = (channel: string, callback?: any) => {
  const id = useUUID();
  const broadcastRef = useRef<BroadcastChannel>();

  const handleOnMessage = useCallback((message) => {
    callback?.(message);
  }, []);

  useEffect(() => {
    broadcastRef.current = new BroadcastChannel(channel);
    broadcastRef.current.onmessage = (event) => {
      handleOnMessage?.(event.data);
    };
    return () => {
      broadcastRef.current?.close();
    };
  }, [channel, handleOnMessage]);

  const sendMessage = (message: any) => {
    broadcastRef.current?.postMessage({
      form: id,
      message: message,
    });
  };

  return { sendMessage };
};
