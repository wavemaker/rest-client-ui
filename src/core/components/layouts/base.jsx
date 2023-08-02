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
    const url = specSelectors.url();
    const value = specSelectors.value();
    const objval = specSelectors.objval();
    return (
      <div className="swagger-ui">
        <div className="information-container">
          <div>
            {url}
            <p>{value}</p>
            <p>{objval.name}</p>
          </div>
          <Stack spacing={2} direction="row">
            <Button variant="text">Text</Button>
            <Button variant="contained">{value}</Button>
            <Button variant="outlined">Outlined</Button>
          </Stack>
          <p>WElcome</p>
        </div>
      </div>
    );
  }
}
