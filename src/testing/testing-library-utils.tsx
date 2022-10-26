import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AppProvider } from '../context/AppContext/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

/**
 * Custom render function 1
 * Uses BrowserRouter + AppProvider as a wrapper
 */
const WrapperWithBrowserRouter = ({ children }: { children: ReactElement }) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AppProvider>{children}</AppProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

const renderWithBrowserRouterAndContext = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: WrapperWithBrowserRouter, ...options });

/**
 * Custom render function 2
 * Uses MemoryRouter + AppProvider as a wrapper
 * Initial routes can be passed for MemoryRouter
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
}

const WrapperWithMemoryRouter = ({
  children,
  initialEntries = [],
}: {
  children: ReactElement;
  initialEntries?: string[];
}) => (
  <MemoryRouter initialEntries={initialEntries}>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AppProvider>{children}</AppProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </MemoryRouter>
);

const renderWithMemoryRouterAndContext = (
  ui: ReactElement,
  options: CustomRenderOptions
) =>
  render(ui, {
    wrapper: props => (
      <WrapperWithMemoryRouter
        {...props}
        initialEntries={options.initialEntries}
      />
    ),
    ...options,
  });

// re-export everything
export * from '@testing-library/react';

// override render method
export {
  renderWithBrowserRouterAndContext as customRender1,
  renderWithMemoryRouterAndContext as customRender2,
};
