import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";
const DataContext = createContext({});
export const DataProvider = ({ children }) => {
  const [upLoading, setUpLoading] = useState(false);
  const [info, setInfo] = useState([]);
  const [CID, setCID] = useState("");
  const [fileCIDsToDisplay, setFileCIDsToDisplay] = useState([]);

  return (
    <DataContext.Provider
      value={{
        upLoading,
        setUpLoading,
        info,
        setInfo,
        fileCIDsToDisplay,
        setFileCIDsToDisplay,
        CID,
        setCID,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.array,
};

export const useDataContext = () => {
  return useContext(DataContext);
};
