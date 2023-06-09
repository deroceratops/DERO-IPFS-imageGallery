import PropTypes from "prop-types";

const Spinner = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

Spinner.propTypes = {
  loading: PropTypes.bool,
};

export default Spinner;
