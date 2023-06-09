import PropTypes from "prop-types";
import Image from "./Image";

const Images = ({ fileCIDs, baseURL }) => {
  return (
    <div className="galleryImages">
      {fileCIDs.map((fileCID, key) => (
        <a
          className="galleryImageLink"
          key={key}
          target="_blank"
          rel="noopener noreferrer"
          href={`${baseURL}${fileCID}`}
        >
          <Image baseURL={baseURL} image={fileCID} />
        </a>
      ))}
    </div>
  );
};

Images.propTypes = {
  fileCIDs: PropTypes.array,
  baseURL: PropTypes.string,
};

export default Images;
