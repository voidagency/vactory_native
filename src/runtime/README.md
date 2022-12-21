# Runtime

This is a Node script that generate a few mapping files which holds path to app components.

## What ?

Create a simple `WidgetA` and `WidgetB` like so :

```jsx
// src/widgets/widget-a.jsx
import { Text } from "@ui-kitten/components";

export const config = {
  id: "vactory_default:widget_a", // Take not of this ID.
};

const WidgetA = () => (<Text category="h1">Widget A</Text>);
export default WidgetA
```


```jsx
// src/widgets/widget-b.jsx
import { Text } from "@ui-kitten/components";

export const config = {
  id: "vactory_default:widget_b", // Take not of this ID.
};

const WidgetB = () => (<Text category="h1">Widget B</Text>);
export default WidgetB
```

Run the following command on your terminal:

```bash
node .vactory/runtime/index.js
```

> This is the same command we use inside `package.json`, check the `scripts` section.

Running this command will generate a root folder named `.runtime` which will contain a few files. The one we are interested in is `.runtime/widgets.js`

If you take a look at this file you will see the following content:

```js
import Vactory_default__widget_a from "../src/widgets/widget-a.jsx"
import Vactory_default__widget_b from "../src/widgets/widget-b.jsx"

export const Widgets = {
  "vactory_default:widget_a":Vactory_default__widget_a,
  "vactory_default:widget_b":Vactory_default__widget_b,
}

```

Then on your App components you can get any widget listed here easily using the following :

```jsx
import React from "react"
import { Widgets } from "@runtime/widgets"

const MyComponent = () => {
	const Component = Widgets["vactory_default:widget_a"]

	return <Component />
}

```

This will simply render `WidgetA`.

## Why ?

We need these runtime files to preload all possible components / parameters ahead of time. Why you may ask ? Simply because we only receive an `ID` & `DATA` from `Drupal`.

- `ID`: is the identifier of the component want to display or render
- `DATA` will hold some data we may pass to the component as `props`

These files are used by the following core components:

- `./.vactory/ui/block/BlocksController.jsx`
- `./.vactory/ui/paragraphs/PargaraphsTemplate.jsx`
- `./.vactory/app/navigation/screens/NodeRouteScreen.jsx`

Go ahead and check them.
