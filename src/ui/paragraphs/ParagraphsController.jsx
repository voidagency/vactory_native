import React from "react"
import ParagraphsContainer from "./ParagraphsContainer"
import ParagraphsTemplate from "./PargaraphsTemplate"
import ParagraphsMultiple from "./PargaraphsMultiple"

export const ParagraphsController = (props) => {
	const {
		type,
		paragraph_identifier,
		paragraph_container,
		paragraph_section,
		// paragraph_css_class,
		field_background_color = null,
		field_vactory_component = null,
		field_vactory_paragraph_tab = null,
		paragraph_background_image = null,
		field_vactory_flag = false,
		field_paragraph_hide_lg = false,
		field_paragraph_hide_sm = false,
		field_size_image = "cover",
		field_position_image_x = "center",
		field_position_image_y = "center",
		paragraph_background_parallax = false,
		field_animation = null,
	} = props.data

	let container_spacing = props.data.container_spacing
		? props.data.container_spacing
		: "small_space"

	const backgroundColor =
		field_background_color?.color?.hexadecimal !== "#FF0000"
			? field_background_color?.color?.hexadecimal
			: null

	const backgroundImage = paragraph_background_image?.thumbnail
		? {
				src: paragraph_background_image.thumbnail.uri.value._default,
				width: paragraph_background_image.thumbnail.meta.width,
				height: paragraph_background_image.thumbnail.meta.height,
				alt: paragraph_background_image.thumbnail.meta.alt,
				layout: "fill",
				objectFit: field_size_image,
				objectPosition: `${field_position_image_x} ${field_position_image_y}`,
				// placeholder="blur"
		  }
		: null

	let childComponent

	if (type === "paragraph--vactory_component" && field_vactory_component) {
		childComponent = (
				<ParagraphsTemplate
					id={field_vactory_component.widget_id}
					settings={JSON.parse(field_vactory_component.widget_data)}
					showTitle={field_vactory_flag}
					title={props.data.field_vactory_title}
				/>
		)
	} else if (
		type === "paragraph--vactory_paragraph_multi_template" &&
		field_vactory_paragraph_tab
	) {
		childComponent = (
			<ParagraphsMultiple
				type={props.data.field_multi_paragraph_type}
				title={props.data.field_vactory_title}
				showTitle={field_vactory_flag}
				introduction={props.data.field_paragraph_introduction}
				cta={props.data.field_paragraphs_cta}
				tabs={field_vactory_paragraph_tab}
			/>
		)
	}

	return (
		<ParagraphsContainer
			id={paragraph_identifier}
			layout={paragraph_container}
			state={paragraph_section}
			spacing={container_spacing}
			style={{
				backgroundColor: backgroundColor,
				// backgroundImage: backgroundImage,
			}}
			// className={classNames("paragraph", type, paragraph_css_class)}
			hideOnDesktop={field_paragraph_hide_lg}
			hideOnMobile={field_paragraph_hide_sm}
			backgroundImage={backgroundImage}
			activateParallax={paragraph_background_parallax}
			animationValue={field_animation === null ? "" : field_animation}
		>
			{childComponent}
		</ParagraphsContainer>
	)
}
