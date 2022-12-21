import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Icon, Menu, MenuGroup, MenuItem, Layout } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
// import MenuIcon from "../components/MenuIcon";
import { useMenu } from "@vactory";

const findMenuItemByIndex = (items = [], index, section = undefined) => {
  let found = null;

  items.forEach((el, i) => {
    // Early bailout.
    if (found) {
      return;
    }

    if (section === undefined && i === index) {
      found = el;
      return;
    }

    if (el?.below) {
      el.below.forEach((nested_el, nested_i) => {
        if (nested_i === index && section === i) {
          found = nested_el;
          return;
        }
      });
    }
  });

  return found;
};

export default function MenusScreen() {
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const mainNavigationMenu = useMenu("main") || [];

  const onSelect = (index) => {
    const menuItem = findMenuItemByIndex(
      mainNavigationMenu,
      index.row,
      index.section
    );

    // console.log(menuItem)


    if (menuItem) {
      if (menuItem?.below) {
        return;
      }
    }
    // console.log(menuItem);
    // @see https://reactnavigation.org/docs/navigating/#navigate-to-a-route-multiple-times
     navigation.push("Root", {
      screen: "Router",
      params: {
        id: menuItem.id, path: menuItem.url
      },
    });
    // navigation.navigate("Router", { id: menuItem.id, path: menuItem.url });

    // navigation.navigate("Root", { id: menuItem.id, path: menuItem.url });
    // navigation.navigate("Root", {
    //   screen: "Router",
    //   params: {
    //     id: menuItem.id, path: menuItem.url
    //   },
    // });
    // setSelectedIndex(index.row);
  };

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => <MenuIcon />,
  //   });
  // });

  // @todo: RTL accessoryLeft && accessoryRight
  const renderMenuItem = (el) => {
    if (el?.below) {
      return (
        <MenuGroup key={el.id} title={el.title}>
          {el.below.map((el) => {
            // if (el?.below) {
            //   // @todo: Damn you UI KITTEN!!!.
            //   return (
            //     <MenuGroup key={el.id} title={el.title}>
            //       {renderMenuItem(el)}
            //     </MenuGroup>
            //   );
            // }
            return (
              <MenuItem
                key={el.id}
                title={el.title}
                accessoryLeft={
                  el?.options?.attributes?.icon ? (
                    <Icon name={el.options.attributes.icon} />
                  ) : null
                }
              />
            );
          })}
        </MenuGroup>
      );
    }

    return (
      <MenuItem
        key={el.id}
        title={el.title}
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
    <Layout>
      <Menu
        selectedIndex={selectedIndex}
        // onSelect={(index) => setSelectedIndex(index)}
        onSelect={onSelect}
      >
        {renderData}
      </Menu>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
  },
});
