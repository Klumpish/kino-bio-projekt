jest.mock('../src/js/cmsAdapter.js', () => ({
  cmsAdapterScreenings: {
    loadScreeningById: jest.fn(), // Se till att den är en mock-funktion
  },
}));
import { cmsAdapterScreenings } from '../src/js/cmsAdapter.js';
import screenings from '../lib/screenings.js';
import { it, describe, expect, jest, beforeEach } from '@jest/globals';

describe('screenings function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    cmsAdapterScreenings.loadScreeningById = jest.fn();
  });

  it('Should return only future screenings', async () => {
    cmsAdapterScreenings.loadScreeningById.mockResolvedValueOnce([
      {
        attributes: {
          start_time: new Date(Date.now() + 86400000).toISOString(), // Framtida visning
          room: 'Stora Salongen',
        },
      },
    ]);

    const result = await screenings('123');
    expect(result.length).toBe(1);
    expect(result[0].room).toBe('Stora Salongen');
  });

  it('filters out past screenings', async () => {
    cmsAdapterScreenings.loadScreeningById.mockResolvedValueOnce([
      {
        attributes: {
          start_time: new Date(Date.now() - 86400000).toISOString(), // Gammal visning
          room: 'Stora Salongen',
        },
      },
    ]);

    const result = await screenings('123');
    expect(result.length).toBe(0); // Inga visningar ska returneras
  });

  it('handles empty screening data', async () => {
    cmsAdapterScreenings.loadScreeningById.mockResolvedValueOnce([]);

    const result = await screenings('123');
    expect(result.length).toBe(0); // Ingen data ska returneras
  });

  it('handles API errors', async () => {
    cmsAdapterScreenings.loadScreeningById.mockRejectedValueOnce(new Error('API error'));

    const result = await screenings('123');
    expect(result).toEqual([]); // En tom array ska returneras vid fel
    expect(console.error).toHaveBeenCalledWith('Error fetching screenings:', expect.any(Error));
  });
});
