/**
 * @prettier
 */
import layout from "core/plugins/layout"
import spec from "core/plugins/spec"
import view from "core/plugins/view"
import requestSnippets from "core/plugins/request-snippets"
import logs from "core/plugins/logs"
import App from "core/components/app"
import BaseLayout from "core/components/layouts/base"
import * as LayoutUtils from "core/components/layout-utils"

export default function () {
  let coreComponents = {
    components: {
      App,
      BaseLayout,
    },
  }

  let formComponents = {
    components: LayoutUtils,
  }

  return [
    logs,
    view,
    spec,
    layout,
    coreComponents,
    formComponents,
    requestSnippets,
  ]
}
