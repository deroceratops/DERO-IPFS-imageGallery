import PropTypes from "prop-types";
import Image from "./Image";

const Images = ({ fileCIDs, baseURL }) => {
  return (
    <div className="galleryImages">
      {fileCIDs.map((fileCID, key) => (
        <div
          className="galleryImageWrapper"
          key={key}
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
};

export default Images;
