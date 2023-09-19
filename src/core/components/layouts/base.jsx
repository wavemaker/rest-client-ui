/**
 * @prettier
 */
import React from "react";
import PropTypes from "prop-types";
import "../../../i18n";
import { Provider } from "react-redux";
import appStore from "../../../jsx/core/components/appStore/Store";
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
    const RestImportModal = getComponent("RestImportModal");
    const language = specSelectors.language();
    const config = specSelectors.config();
    return (
      <Provider store={appStore}>
        <div className="rest-import-ui">
          <div className="information-container">
            <RestImportModal language={language} restImportConfig={config} />
          </div>
        </div>
      </Provider>
    );
  }
}
