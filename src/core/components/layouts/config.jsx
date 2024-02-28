import React from "react";
import PropTypes from "prop-types";
import "../../../i18n";
export default class ConfigLayout extends React.Component {
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
    const ConfigModel = getComponent("ConfigModel");
    const providerConf = specSelectors.providerConf();
    const config = specSelectors.config();
    const { configOpen } = this.state;
    return (
      <div className="rest-import-ui">
        <ConfigModel
          handleOpen={configOpen}
          handleClose={this.handleCloseConfig}
          providerConf={
            Object.keys(providerConf).length === 0 ? null : providerConf
          }
          proxyObj={config}
          configModel={true}
        />
      </div>
    );
  }
}
