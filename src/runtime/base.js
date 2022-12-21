const path = require("path")
const {
	createMapping,
	getWorkingDirectory,
	createMappingFile,
} = require("./utils")
const Log = require("./log");
const rootDir = getWorkingDirectory()
const tmpFolderPath = path.resolve(rootDir, ".runtime")

class MapperBasePlugin {
	plugin_name

	constructor({ plugin_name, srcDirPattern }) {
		if (this.constructor == MapperBasePlugin) {
			throw new Error("Abstract class MapperBasePlugin can't be instantiated.")
		}

		this.plugin_name = plugin_name
		this.src = srcDirPattern
	}

	createMappingImpl(config) {
		throw new Error("Method 'createMappingImpl()' must be implemented.")
	}

	callCreateMappingImpl(config) {
		this.createMappingImpl(
			config.map((c) => {
				return {
					...c,
					absoluteFilePath: c.filePath,
					filePath: path.relative(tmpFolderPath, c.filePath),
				}
			}),
			{
				createMappingFile,
				Log,
				tmpFolderPath,
				rootDir,
			}
		)
	}

	run() {
        const config = createMapping(this.src)
        this.callCreateMappingImpl(config)
		
		// @todo: watch man maybe ?
	}
}

module.exports = MapperBasePlugin
