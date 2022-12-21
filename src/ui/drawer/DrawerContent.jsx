import React, { useState } from "react";
import { Drawer, DrawerGroup, DrawerItem, Icon } from "@ui-kitten/components";
import { useMenu } from "@vactory";
import { useNavigation } from "@react-navigation/native";
import { DrawerFooter } from "./DrawerFooter";
import { DrawerHeader } from "./DrawerHeader";

export const DrawerContent = (props) => {
  const navigation = useNavigation();
  const [selectedIndex] = useState(null);
  const mainNavigationMenu = useMenu("main") || [];

  const onSelect = (path) => {
    navigation.navigate("Router", { path });
  };

  // @todo: RTL accessoryLeft && accessoryRight
  const renderMenuItem = (el) => {
    if (el?.below) {
      return (
        <DrawerGroup key={el.id} title={el.title}>
          {el.below.map((el) => {
            return (
              <DrawerItem
                key={el.id}
                title={el.title}
                onPress={() => onSelect(el.url)}
                accessoryLeft={
                  el?.options?.attributes?.icon ? (
                    <Icon name={el.options.attributes.icon} />
                  ) : null
                }
              />
            );
          })}
        </DrawerGroup>
      );
    }

    return (
      <DrawerItem
        key={el.id}
        title={el.title}
        onPress={() => onSelect(el.url)}
        accessoryLeft={
          el?.options?.attributes?.icon ? (
            <Icon name={el.options.attributes.icon} />
          ) : null
        }
      />
    );
  };
  const renderData = mainNavigationMenu.map((el) => renderMenuItem(el));

  return (
    <>
      <Drawer
        selectedIndex={selectedIndex}
        header={DrawerHeader}
        footer={DrawerFooter}
        {...props}
      >
        {renderData}
      </Drawer>
    </>
  );
};
