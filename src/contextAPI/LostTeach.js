import React, { createContext, useContext, useState } from 'react';
import Cookies from "js-cookie";

export const LostTeachContext = createContext(); 

export const useLostTeach = () => {
    return useContext(LostTeachContext);
}

export const LostTeachProvider = ({ children }) => {
    const [checkClick, setCheckClick] = useState(false);
    const [idJob, setIdJob] = useState('');

    return (
        <LostTeachContext.Provider value={{ checkClick, setCheckClick, idJob, setIdJob }}>
            {children}
        </LostTeachContext.Provider>
    );
};