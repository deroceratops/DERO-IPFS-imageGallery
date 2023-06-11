import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDataContext } from "../context/DataContext";

const Fullscreen = ({ pinataBaseURL, pageYOffset, innerHeight }) => {
  const {
    fileCIDsToDisplay,
    fullscreenOn,
    setFullscreenOn,
    fullscreenImage,
    setFullscreenImage,
  } = useDataContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(fileCIDsToDisplay.indexOf(fullscreenImage));
  }, [fileCIDsToDisplay, fullscreenImage]);

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

  return fullscreenOn ? (
    <div className="fullScreen" style={styles}>
      <button
        className="closeButton"
        onClick={() => {
          document.documentElement.style.overflow = "auto";
          setFullscreenOn(false);
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
  ) : null;
};

Fullscreen.propTypes = {
  fullscreenOn: PropTypes.bool,
  setFullscreenOn: PropTypes.func,
  fullscreenImage: PropTypes.string,
  setFullscreenImage: PropTypes.func,
  pinataBaseURL: PropTypes.string,
  setFullscreen: PropTypes.func,
  pageYOffset: PropTypes.number,
  innerHeight: PropTypes.number,
  fileCIDsToDisplay: PropTypes.array,
};

export default Fullscreen;
