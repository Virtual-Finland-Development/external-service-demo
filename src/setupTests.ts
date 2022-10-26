// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// msw settings
import { server } from './testing/mocks/server';
// Establish API mocking before all tests.
beforeAll(() =>
  server.listen({
    onUnhandledRequest(req, print) {
      if (req.url.pathname.includes('form.pdf')) return;
      print.warning();
    },
  })
);
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
