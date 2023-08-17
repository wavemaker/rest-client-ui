/**
 * @prettier
 */
import React from "react";
import PropTypes from "prop-types";
import '../../../i18n';
import { useTranslation } from 'react-i18next';

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
    const language = specSelectors.language();
    const config = specSelectors.config()
    
    return (
      <div className="rest-import-ui">
        <div className="information-container">
          <WebServiceModal language={language} restImportConfig={config} />
        </div>
      </div>
    );
  }
}
