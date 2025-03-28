
const mockAuth = {
  signUp: jest.fn().mockResolvedValue({
    data: { user: { id: 'test-user-id' } },
    error: null
  }),
  signOut: jest.fn(),
  user: jest.fn(() => ({ id: 'test-user-id' })),
};

const mockFrom = jest.fn((table) => {
  const mock = {
    table,
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    select: jest.fn(() => mock),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    then: jest.fn(),
  };
  return mock;
});

const mockClient = {
  auth: mockAuth,
  from: mockFrom,
  then: jest.fn(),
};

export const mockSupabase = {
  ...mockClient,
  auth: {
    ...mockClient.auth,
    then: mockClient.then
  },
  from: mockClient.from,
  then: mockClient.then
};

export default mockClient;
