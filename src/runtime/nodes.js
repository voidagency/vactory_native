const path = require("path")
const { getWorkingDirectory } = require("./utils")
const MapperBasePlugin = require("./base")
const rootDir = getWorkingDirectory()
const PLUGIN_NAME = "NodesPlugin"
const filePattern = `${rootDir}/src/@(widgets|modules)/**/*Node.jsx`
const exportParamsFileName = "nodes-params.js"
const exportTemplatesFileName = "nodes-templates.js"

class NodesPlugin extends MapperBasePlugin {
	constructor() {
		super({
			plugin_name: PLUGIN_NAME,
			srcDirPattern: filePattern,
		})
	}

	createMappingImpl(files, options) {
		this.createNodeParams(files, options)
		this.createNodeTemplates(files, options)
	}

	createNodeParams(files, { createMappingFile, tmpFolderPath }) {
		let mappings = []

		files.forEach(({ config }) => {
			mappings.push(`  "${config.id}":${JSON.stringify(config.params)}`)
		})

		const exportPath = path.resolve(tmpFolderPath, exportParamsFileName)
		createMappingFile(
			exportPath,
			`export const NodeParamsMapping = {\n${mappings.join(",\n")},\n}\n`
		)
	}

	createNodeTemplates(files, { createMappingFile, tmpFolderPath }) {
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

		const exportPath = path.resolve(tmpFolderPath, exportTemplatesFileName)
		createMappingFile(
			exportPath,
			`
		${imports.join("\n")}\n
     export const TemplatesMapping = {\n${mappings.join(",\n")},\n}\n`
		)
	}
}

module.exports = NodesPlugin
