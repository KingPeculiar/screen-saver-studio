import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/ui/button';

import { Button as ButtonPrimitive } from '@base-ui/react/button';

const root = createRoot(document.body);
root.render(
  <>
    <h2>Hello from React!</h2>
    <Button variant="outline">Hello</Button>
  </>
);
