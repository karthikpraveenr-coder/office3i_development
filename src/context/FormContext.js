// context/FormContext.js
import React, { createContext, useState } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [password, setPassword] = useState("");

  return (
    <FormContext.Provider value={{ firstName, setFirstName, lastName, setLastName, email, setEmail, selectedPlan, setSelectedPlan, selectedModule,setSelectedModule,password, setPassword }}>
      {children}
    </FormContext.Provider>
  );
};

export default FormContext;
