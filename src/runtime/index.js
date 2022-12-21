const Log = require("./log");
const WidgetsPlugin = require("./widgets");
const NodesPlugin = require("./nodes");
const widgetsRunner = new WidgetsPlugin();
const nodesRunner = new NodesPlugin();

Log.event(`Creating mapping for Widgets at /.runtime/widgets.js`);
widgetsRunner.run();

Log.event(`Creating mapping for Nodes at /.runtime/nodes-params.js && /.runtime/nodes-templates.js`);
nodesRunner.run();
