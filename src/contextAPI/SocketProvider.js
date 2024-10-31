// SocketProvider.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from "js-cookie";

export const socketContext = createContext(); 

export const useSocket = () => {
    return useContext(socketContext) || { message: '', isConnected: false, reconnect: () => {} };
}

export const SocketProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const connectWebSocket = useCallback(() => {
        const token = Cookies.get("access_token");
        if (!token) {
            console.error("No access token found");
            return;
        }

        const ws = new WebSocket(
            `ws://cnpm.duytech.site/ws/new_application/?token=${token}`
        );

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setMessage(data.message);
                console.log("Received message:", data.message);
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsConnected(false);
        };

        ws.onclose = (event) => {
            setIsConnected(false);
            if (event.wasClean) {
                console.log("WebSocket closed cleanly");
            } else {
                console.error("WebSocket closed unexpectedly");
                setTimeout(() => {
                    console.log("Attempting to reconnect...");
                    connectWebSocket();
                }, 5000);
            }
        };

        setSocket(ws);

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    useEffect(() => {
        const cleanup = connectWebSocket();
        
        return () => {
            cleanup?.();
        };
    }, [connectWebSocket]);

    const value = {
        message,
        isConnected,
        reconnect: connectWebSocket
    };

    return (
        <socketContext.Provider value={value}>
            {children}
        </socketContext.Provider>
    );
};
