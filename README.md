# [Browser Activity Tracker](https://www.npmjs.com/package/@fanesz/browser-activity-tracker) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/fanesz/browser-activity-tracker/blob/main/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request)

In accordance with its name, this is a module that contains functions to track whatever activities are carried out by the user.

The tracked activities are switching applications, changing browser tabs, mouse clicks, keyboard presses, and when the mouse enters/exits specific components.

## Usage
### Application and Browser Tab Tracker
It is tracked when the user is not focused on the browser, such as when opening other applications, pressing the Windows key, using Alt-Tab to switch applications, changing browser tab, and so on.
- Activites: `aplIn`, `aplOut`, `pagein`, `pageOut`
```jsx
import { useState } from 'react';
import { pageTracker } from "@fanesz/browser-activity-tracker"

export default function App() {
  const [isStart, setIsStart] = useState(false);
  // You can change isStart with button or something
  // because the result of pageActivities only triggered after
  // isStart changed from true to false
  
  const pageActivities = pageTracker(isStart);
  // pageActivities returns an array of objects
  // where each object contains activity names and timestamps

  return (
    <div>
      <button onClick={() => setIsStart(prev => !prev)}>
        {isStart ? 'stop' : 'start'}
      </button>

      {pageActivities.map((item) => (
        <div>
          {item.activity} - {item.timestamp.toLocaleTimeString()}
        </div>
      ))}

      {/*
        example result when switching aplication and then switching browser tab
        aplOut - 11:02:44 PM
        aplIn - 11:02:44 PM
        pageOut - 11:02:45 PM
        pageIn - 11:02:46 PM
      */}
    </div>
  )
}
```

### Keyboard Tracker
It is tracked when the user press any key of the keyboard.
- Activites: `{key} pressed`, `{key} released`
```jsx
import { useState } from 'react';
import { keyboardTracker } from "@fanesz/browser-activity-tracker"

export default function App() {
  const [isStart, setIsStart] = useState(false);
  const keyboardActivity = keyboardTracker(isStart);

  return (
    <div>
      <button onClick={() => setIsStart(prev => !prev)}>
        {isStart ? 'stop' : 'start'}
      </button>

      {keyboardActivity.map((item) => (
        <div>
          {item.activity} - {item.timestamp.toLocaleTimeString()}
        </div>
      ))}

      {/*
        example result when user do ctrl+c
        Control pressed - 11:09:36 PM
        c pressed - 11:09:37 PM
        c released - 11:09:37 PM
        Control released - 11:09:37 PM
      */}
    </div>
  )
}
```

### Mouse Tracker
It is tracked when user do a click, and moving in/out on specific component.
- Activites: `mouseClick`, '
```jsx
import { useState } from 'react';
import { mouseTracker } from "@fanesz/browser-activity-tracker"

export default function App() {
  const [isStart, setIsStart] = useState(false);
  const [mouseActivity, MouseComponent] = mouseTracker(isStart);

  return (
    <div>
      <MouseComponent className="your class">
        This is the section that tracking mouse in and out.
      </MouseComponent>

      <button onClick={() => setIsStart(prev => !prev)}>
        {isStart ? 'stop' : 'start'}
      </button>

      {mouseActivity.map((item) => (
        <div>
          {item.activity} - {item.timestamp.toLocaleTimeString()}
        </div>
      ))}

      {/* 
        example result when user do cursor in, double click, 
        and cursor out on MouseComponent component
        mouseIn - 11:16:37 PM
        mouseClick - 11:16:37 PM
        mouseClick - 11:16:38 PM
        mouseOut - 11:16:39 PM 
      */}
    </div>
  )
}
```

## Some Useful Function
### Counting total Copy pressed (ctrl+c)
```jsx
import { useEffect, useState } from 'react';
import { keyboardTracker, totalCopy } from "@fanesz/browser-activity-tracker"

export default function App() {
  const [isStart, setIsStart] = useState(false);
  const keyboardActivity = keyboardTracker(isStart);
  const [copyPressed, setCopyPressed] = useState(0);

  useEffect(() => {
    setCopyPressed(totalCopy(keyboardActivity));
  }, [isStart]);

  return (
    <div>
      <button onClick={() => setIsStart(prev => !prev)}>
        {isStart ? 'stop' : 'start'}
      </button>

      Total ctrl+c pressed: {copyPressed}
    </div>
  )
}
```

## Typescript
Because the tracker function return an array of object, you can import `TActivity` from the module.
```jsx
import { useState } from 'react';
import { keyboardTracker, TActivity } from "@fanesz/browser-activity-tracker"

export default function App() {
  const [isStart, setIsStart] = useState(false);
  const keyboardActivity: TActivity[] = keyboardTracker(isStart);

  return (
    ...
  )
}
```