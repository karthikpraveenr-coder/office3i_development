// ContactFormContext.js
import { createContext, useState } from 'react';

export const ContactFormContext = createContext();

export const ContactFormProvider = ({ children }) => {
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');


    return (
        <ContactFormContext.Provider value={{ firstName, setFirstName, email, setEmail}}>
            {children}
        </ContactFormContext.Provider>
    );
};
