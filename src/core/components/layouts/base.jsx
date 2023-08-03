/**
 * @prettier
 */
import React from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
export default class BaseLayout extends React.Component {
  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
  };

  render() {
    const { specSelectors, getComponent } = this.props;
    const WebServiceModal = getComponent('WebServiceModal')
    const value = specSelectors.value();
    return (
      <div className="rest-import-ui">
        <div className="information-container">
          Kavii
        <WebServiceModal  url={value}/>
        </div>
      </div>
    );
  }
}
