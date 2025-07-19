import React from "react";
import { render, screen } from '@testing-library/react';

// Mock react-router-dom to avoid errors when rendering App in tests
jest.mock("react-hot-toast", () => ({ Toaster: () => <div /> }));
jest.mock("./pages/Home", () => () => <div>Home</div>);
jest.mock("./pages/Movies", () => () => <div>Movies</div>);
jest.mock("./pages/MovieDetails", () => () => <div>MovieDetails</div>);
jest.mock("./pages/PersonDetails", () => () => <div>PersonDetails</div>);
jest.mock("./pages/Login", () => () => <div>Login</div>);
jest.mock("./pages/Register", () => () => <div>Register</div>);
jest.mock("./components/ProtectedRoute", () => ({ children }) => <>{children}</>);
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: () => null,
  Link: ({ children, to }) => <a href={typeof to === 'string' ? to : '#'}>{children}</a>,
  useNavigate: () => jest.fn(),
}), { virtual: true });
import App from "./App";

test('renders navigation title', () => {
  render(<App />);
  // the Navbar should render the "Movie Explorer" title link
  const navTitle = screen.getByText(/movie explorer/i);
  expect(navTitle).toBeInTheDocument();
});
