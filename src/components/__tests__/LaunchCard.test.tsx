import { render, screen } from '@testing-library/react'
import LaunchCard from '../LaunchCard'

const mockLaunch = {
  id: 'L-1',
  name: 'Falcon Test',
  date_utc: new Date().toISOString(),
  details: 'A test launch',
  success: true,
  links: { article: null },
}

test('renders LaunchCard with name and actions', () => {
  render(
    <LaunchCard
      launch={mockLaunch as any}
      isPinned={false}
      onPinToggle={() => {}}
      onSelect={() => {}}
    />,
  )

  expect(screen.getByText(/Falcon Test/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Pin to board/i })).toBeInTheDocument()
})
// Remove the custom expect function - it should be imported from Jest
// Jest's expect is available globally in test files

