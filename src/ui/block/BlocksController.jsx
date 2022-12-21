import React from "react"
import { useNode } from "@vactory/hooks"
import { Widgets } from "@runtime/widgets"
import { useAppConfig } from "@vactory/hooks";

const layoutsMapping = {
	narrow_width: "default",
	full_width: "fluid",
	no_container: "full",
}

export const BlocksController = ({ region = "" }) => {
	const { blocks } = useNode()

	const regionBlocks = blocks.filter((block) => block.region === region)

	if (regionBlocks.length <= 0) {
		return null
	}

	return (
		<React.Fragment>
			{regionBlocks &&
				regionBlocks.map((block) => {
					return (
						<BlocksTemplate
							key={block.id}
							layout={block?.container}
							spacing={block?.container_spacing}
							widget={block.content}
							hasAMP={false}
						/>
					)
				})}
		</React.Fragment>
	)
}


const BlocksTemplate = ({ widget, spacing, layout, ...rest }) => {
	const { getUiComponent } = useAppConfig();
	const TextWarningMessage = getUiComponent("TextWarningMessage");
  
	//const { widget_id, widget_data } = widget
	const { widget_id, widget_data } = widget
		? widget
		: { widget_id: undefined, widget_data: {} }
	let Component = Widgets[widget_id]

	if (!Component) {
		if (widget_id === undefined) return null
		return (
			<TextWarningMessage>
				Caught an error. Block Template {widget_id} is not mapped!
			</TextWarningMessage>
		)
	}

	return (
		<>
			<Component data={JSON.parse(widget_data)} {...rest} />
		</>
	)
}
