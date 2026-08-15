import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

const renderFooter = () =>
  render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );

describe('Footer Component', () => {
  it('renders company name', () => {
    renderFooter();
    const headings = screen.getAllByText(/consultpro/i);
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('renders newsletter section', () => {
    renderFooter();
    expect(screen.getByPlaceholderText(/your email address/i)).toBeInTheDocument();
  });

  it('renders footer navigation links', () => {
    renderFooter();
    expect(screen.getByText(/privacy/i)).toBeInTheDocument();
    expect(screen.getByText(/terms/i)).toBeInTheDocument();
  });
});

