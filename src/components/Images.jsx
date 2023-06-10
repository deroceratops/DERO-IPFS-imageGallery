import PropTypes from "prop-types";
import Image from "./Image";
import { useDataContext } from "../context/DataContext";

const Images = ({ baseURL, setFullscreenOn, setFullscreenImage }) => {
  const { fileCIDsToDisplay } = useDataContext();
  const fileCIDs = fileCIDsToDisplay;

  return (
    <div className="galleryImages">
      {fileCIDs.map((fileCID, key) => (
        <div
          className="galleryImageWrapper"
          key={key}
          onClick={() => {
            document.documentElement.style.overflow = "hidden";
            setFullscreenOn(true);
            setFullscreenImage(fileCID);
          }}
        >
          <Image baseURL={baseURL} image={fileCID} />
        </div>
      ))}
    </div>
  );
};

Images.propTypes = {
  fileCIDs: PropTypes.array,
  baseURL: PropTypes.string,
  setFullscreenOn: PropTypes.func,
  setFullscreenImage: PropTypes.func,
};

export default Images;
