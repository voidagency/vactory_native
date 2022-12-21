const path = require("path")
const { getWorkingDirectory } = require("./utils")
const MapperBasePlugin = require("./base")
const rootDir = getWorkingDirectory()
const PLUGIN_NAME = "WidgetsPlugin"
const filePattern = `${rootDir}/src/@(widgets|modules)/**/*Widget.jsx`
const exportFileName = "widgets.js"

class WidgetsPlugin extends MapperBasePlugin {
	constructor() {
		super({
			plugin_name: PLUGIN_NAME,
			srcDirPattern: filePattern,
		})
	}

	createMappingImpl(files, { createMappingFile, Log, tmpFolderPath, rootDir }) {
		let mappings = [],
			imports = [],
			indexes = {}

		files.forEach(({ config, filePath, absoluteFilePath }) => {
			// Direct import
            const exportName = config.id.replaceAll(":", "__").replaceAll("-", "_")
            const exportNameDefault = exportName.charAt(0).toUpperCase() + exportName.slice(1)
            imports.push(`import ${exportNameDefault} from "${filePath}"`)
            mappings.push(`  "${config.id}":${exportNameDefault}`)

			indexes[config.id] = path.relative(rootDir, absoluteFilePath)
		})

		const exportPath = path.resolve(tmpFolderPath, exportFileName)
		createMappingFile(
			exportPath,
			`
		${imports.join("\n")}\n
     export const Widgets = {\n${mappings.join(",\n")},\n}\n`
		)

	}
}

module.exports = WidgetsPlugin
