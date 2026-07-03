import { createContext, useState, useContext } from "react";

// Create ContestContext
const ContestContext = createContext();

// Create a provider component for contest data
export const ContestProvider = ({ children }) => {
  const [contestName, setContestName] = useState("");
  const [contestDescription, setContestDescription] = useState("");
  const [contestId, setContestId] = useState(null);

  return (
    <ContestContext.Provider
      value={{ contestName, setContestName, contestDescription, setContestDescription, contestId, setContestId }}
    >
      {children}
    </ContestContext.Provider>
  );
};

// Custom hook to access contest context
export const useContest = () => {
  return useContext(ContestContext);
};
