import './App.css'
import AppRouter from './router/Routes'

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';


import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function App() {

  return (
    <MantineProvider>
      <Notifications />
      <AppRouter />
    </MantineProvider>
  )
}

export default App;
