import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /dynamic channel list/i,
    })

    expect(heading).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<Home />)

    expect(
      screen.getByText(/sendbird uikit implementation/i)
    ).toBeInTheDocument()
  })
})