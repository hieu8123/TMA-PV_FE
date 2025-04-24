import { useEffect, useRef } from 'react';

export const useWebSocket = (pollId, onUpdate) => {
  const wsRef = useRef(null);

  useEffect(() => {
    // const websocket = new WebSocket('ws://localhost:3001');
    
    // websocket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'pollUpdate' && data.pollId === pollId) {
    //     onUpdate();
    //   }
    // };

    // wsRef.current = websocket;

    // return () => {
    //   if (websocket) {
    //     websocket.close();
    //   }
    // };

    // Mock WebSocket update
    const interval = setInterval(() => {
      onUpdate();
    }, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [pollId, onUpdate]);

  return wsRef.current;
}; 