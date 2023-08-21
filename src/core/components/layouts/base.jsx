/**
 * @prettier
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../../i18n";
import { Provider } from "react-redux";
import appStore from "../../../jsx/core/components/appStore/Store";
export default class BaseLayout extends React.Component {
  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
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
    const WebServiceModal = getComponent("WebServiceModal");
    const ConfigModel = getComponent("ConfigModel");
    const language = specSelectors.language();
    const config = specSelectors.config();
    const configModal = specSelectors.configModal();
    const providerConf = specSelectors.providerConf();
    const { configOpen } = this.state;
    console.log(providerConf)
    return (
      <Provider store={appStore}>
        <div className="rest-import-ui">
          <div className="information-container">
            {configModal ? (
              <ConfigModel
                handleOpen={configOpen}
                handleClose={this.handleCloseConfig}
                providerConf={Object.keys(providerConf).length === 0  ? null : providerConf}
                proxyObj={config}
              />
            ) : (
              <WebServiceModal language={language} restImportConfig={config} />
            )}
          </div>
        </div>
      </Provider>
    );
  }
}
