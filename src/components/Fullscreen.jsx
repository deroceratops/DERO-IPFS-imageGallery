import PropTypes from "prop-types";
import { useState } from "react";

const Fullscreen = ({
  fullscreenImage,
  setFullscreenImage,
  pinataBaseURL,
  setFullscreen,
  pageYOffset,
  innerHeight,
  fileCIDsToDisplay,
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    fileCIDsToDisplay.indexOf(fullscreenImage)
  );

  const styles = {
    top: pageYOffset + "px",
    bottom: "-" + pageYOffset + innerHeight + "px",
  };

  function handlePrev() {
    setFullscreenImage(fileCIDsToDisplay[currentIndex - 1]);
    setCurrentIndex(currentIndex - 1);
  }

  function handleNext() {
    setFullscreenImage(fileCIDsToDisplay[currentIndex + 1]);
    setCurrentIndex(currentIndex + 1);
  }

  return (
    <div className="fullScreen" style={styles}>
      <button
        className="closeButton"
        onClick={() => {
          document.documentElement.style.overflow = "auto";
          setFullscreen(false);
        }}
      >
        &#10006;
      </button>
      <img
        className="fullscreenImage"
        src={pinataBaseURL + fullscreenImage}
        alt={fullscreenImage}
      />
      <div className="prevNextButtons">
        <button
          disabled={currentIndex <= 0}
          className="prev"
          onClick={handlePrev}
        >
          &larr;
        </button>
        <button
          disabled={currentIndex >= fileCIDsToDisplay.length - 1}
          className="next"
          onClick={handleNext}
        >
          &rarr;
        </button>
      </div>
    </div>
  );
};

Fullscreen.propTypes = {
  fullscreenImage: PropTypes.string,
  setFullscreenImage: PropTypes.func,
  pinataBaseURL: PropTypes.string,
  setFullscreen: PropTypes.func,
  pageYOffset: PropTypes.number,
  innerHeight: PropTypes.number,
  fileCIDsToDisplay: PropTypes.array,
};

export default Fullscreen;
