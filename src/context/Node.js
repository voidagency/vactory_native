import React from "react"

export const NodePageContext = React.createContext({})

export const NodePageProvider = ({ children, node = {}, systemRoute = {} }) => {
	let data = {
		nid: node?.drupal_internal__nid || false,
		path_18n: node?.internal_extra?.translations || {},
		blocks: node?.internal_blocks || [],
		breadcrumb: node?.internal_breadcrumb || [],
		settings: {},
		type: node?.type || "",
		path: "",
		title: node?.title || "",
		banner: {
			image: node?.node_banner_image || null,
			image_mobile: node?.node_banner_mobile_image || null,
			title: node?.node_banner_title || null,
		},
		vcc: node?.vcc_normalized || null,
	}

	if (typeof node?.node_settings !== "undefined") {
		data.settings = JSON.parse(node.node_settings)
	}
	if (typeof node?.path?.alias !== "undefined") {
		data.path = `/${node.path.langcode}${node.path.alias}`
	}

	data.systemRoute = systemRoute

	return <NodePageContext.Provider value={data}>{children}</NodePageContext.Provider>
}
