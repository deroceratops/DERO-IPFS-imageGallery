import PropTypes from "prop-types";
import Image from "./Image";

const Images = ({ fileCIDs, baseURL, setFullscreen, setFullscreenImage }) => {
  return (
    <div className="galleryImages">
      {fileCIDs.map((fileCID, key) => (
        <div
          className="galleryImageWrapper"
          key={key}
          onClick={() => {
            document.documentElement.style.overflow = "hidden";
            setFullscreen(true);
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
  setFullscreen: PropTypes.func,
  setFullscreenImage: PropTypes.func,
};

export default Images;
