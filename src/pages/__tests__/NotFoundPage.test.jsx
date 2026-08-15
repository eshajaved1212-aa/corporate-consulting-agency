import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFoundPage from '../NotFoundPage';

const renderNotFound = () =>
  render(
    <BrowserRouter>
      <NotFoundPage />
    </BrowserRouter>
  );

describe('NotFoundPage Component', () => {
  it('renders 404 heading', () => {
    renderNotFound();
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it('renders "page not found" message', () => {
    renderNotFound();
    expect(screen.getByText(/page.*not.*found/i)).toBeInTheDocument();
  });

  it('renders a "back to home" link', () => {
    renderNotFound();
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});

