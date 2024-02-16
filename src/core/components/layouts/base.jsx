import React from "react";
import PropTypes from "prop-types";
import "../../../i18n";
export default class BaseLayout extends React.Component {
  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      configOpen: true,
    };
  }
  handleCloseConfig = () => {
    this.setState({
      configOpen: false,
    });
  };
  render() {
    const { specSelectors, getComponent } = this.props;
    const RestImport = getComponent("RestImport");
    const language = specSelectors.language();
    const config = specSelectors.config();
    const domID = specSelectors.dom_id();
    return (
      <div className="rest-import-ui">
        <RestImport
          domID={domID}
          language={language}
          restImportConfig={config}
        />
      </div>
    );
  }
}
