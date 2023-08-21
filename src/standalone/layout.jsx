import React from "react"
import PropTypes from "prop-types"

export default class StandaloneLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    const { getComponent } = this.props
    const BaseLayout = getComponent("BaseLayout", true)
    const ConfigLayout = getComponent("ConfigLayout", true)

    return (
      <div className='rest-import-ui'>
        <BaseLayout />
        <ConfigLayout />
      </div>
    )
  }

}
