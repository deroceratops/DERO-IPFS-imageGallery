import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Spinner from "./Spinner";

const Image = ({ image, baseURL }) => {
  const [loaded, setLoaded] = useState(false);
  const [transparent, setTransparent] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setTransparent(true);
  }, [image]);

  return (
    <>
      {(() => {
        return !loaded ? <Spinner /> : null;
      })()}
      <img
        src={baseURL + image}
        alt={image}
        className={`
          galleryImage ${transparent ? "transparent" : null}
        `}
        onLoad={() => {
          setLoaded(true);
          setTransparent(false);
        }}
      />
    </>
  );
};

Image.propTypes = {
  image: PropTypes.string,
  baseURL: PropTypes.string,
};

export default Image;
