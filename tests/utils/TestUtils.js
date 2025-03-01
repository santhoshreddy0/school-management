module.exports = {
  mockRequest: (data = {}) => {
    return {
      body: data.body || {},
      params: data.params || {},
      query: data.query || {},
      headers: data.headers || {},
      decodedToken: data.decodedToken || null,
      get: jest.fn((header) => data.headers?.[header]),
    };
  },

  mockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  },
};
