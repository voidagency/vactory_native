import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { useI18n, useAuth } from "@vactory/hooks";
import { TemplatesMapping } from "@runtime/nodes-templates";
import { NodeParamsMapping } from "@runtime/nodes-params";
import { RouteLoadingSpinner } from "@vactory/ui/route-loading-spinner";
import { BlocksController } from "@vactory/ui/block/BlocksController";
import { TextWarningMessage } from "@vactory/ui/text-status-message";
import { NodePageProvider } from "@vactory/context";
import { DrupalService, LoggerService } from "@vactory/services";

const DEFAULT_JSONAPI_NODE_PARAMS =
  "drupal_internal__nid,langcode,title,path,internal_node_banner,node_settings,internal_blocks,internal_extra";

const NodeDefault = ({ node }) => {
  LoggerService.warn(
    `[Node] No template found for ${node?.type}`,
    "NodeRouteScreen.jsx"
  );
  return (
    <TextWarningMessage>
      [Node] No template found for {node?.type} !!.
    </TextWarningMessage>
  );
};

// export default function RouterScreen() {
export const RouterScreen = () => {
  const [routeReady, setRouteReady] = useState(false);
  const [node, setNode] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { currentLocale } = useI18n();
  const isFocused = useIsFocused();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    setRouteReady(false);

    async function loadRoute() {
      try {
        let slug = route?.params?.path; // todo: expose config for default route if not slug
        if (typeof slug === "undefined") {
          console.log("Router: slug is undefined");
          navigation.navigate("SystemError");
          return Promise.resolve(true);
        }

        const routerResponse = await DrupalService.getRoute(
          slug,
          currentLocale,
          { withAuth: true }
        );

        // User is unauthorized.
        if (routerResponse.status === 401) {
          navigation.navigate("Unauthorized"); // todo: pass current route & params, perssing Refresh should reload the page
          return Promise.resolve(true);
        }

        const router = await routerResponse.json();

        // Redirect to 404.
        if (router.status === 404) {
          navigation.navigate("NotFound");
          return Promise.resolve(true);
        }

        let nodeParams = Object.assign(
          {},
          JSON.parse(
            JSON.stringify(NodeParamsMapping[router.jsonapi.resourceName])
          )
        );

        // Add internal fields
        if (
          nodeParams?.fields &&
          nodeParams?.fields[router.jsonapi.resourceName]
        ) {
          nodeParams.fields[router.jsonapi.resourceName] =
            DEFAULT_JSONAPI_NODE_PARAMS +
            "," +
            nodeParams.fields[router.jsonapi.resourceName];
        }

        const node = await DrupalService.getNode(
          router,
          nodeParams,
          currentLocale,
          slug,
          { withAuth: true }
        );

        setNode(node);
        setRouteReady(true);
      } catch (e) {
        console.log(e);
        LoggerService.error(e, "RouterScreen.jsx:loadRoute");
        navigation.navigate("SystemError");
      }
    }

    loadRoute();
  }, [route?.params?.path, isAuthenticated, isFocused]);

  if (!routeReady || !node) {
    return <RouteLoadingSpinner />;
  }

  let nodeType = node.type;
  const NodeComponent = TemplatesMapping[nodeType] || NodeDefault;

  return (
    <>
      <NodePageProvider node={node} systemRoute={{}}>
        <ScrollView>
          <BlocksController region="top" />
          {/* <BlocksController region="header" /> */}
          <BlocksController region="bridge" />
          <NodeComponent node={node} />
          <BlocksController region="footer" />
          <BlocksController region="bottom" />
        </ScrollView>
      </NodePageProvider>
    </>
  );
};
