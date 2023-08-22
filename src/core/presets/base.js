/**
 * @prettier
 */
import layout from "core/plugins/layout"
import spec from "core/plugins/spec"
import view from "core/plugins/view"
import logs from "core/plugins/logs"
import App from "core/components/app"
import BaseLayout from "core/components/layouts/base"
import ConfigLayout from "core/components/layouts/config"
import WebServiceModal from "../../jsx/core/components/WebServiceModal"
import ConfigModel from "../../jsx/core/components/ConfigModel"
export default function () {
  let coreComponents = {
    components: {
      App,
      WebServiceModal,
      ConfigModel,
      BaseLayout,
      ConfigLayout
    },
  }


  return [
    logs,
    view,
    spec,
    layout,
    coreComponents,
  ]
}
