
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core"
import "../styles/chat.scss"; // Import chat.scss globally
import '@mantine/core/styles.css';
import { theme } from '../../theme';


export default function App({ Component, pageProps }: AppProps) {
  return (<MantineProvider theme={theme}>
    <Component {...pageProps} />
    
  </MantineProvider>);
}
