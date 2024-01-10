describe('OAuth:UserRegisterCmd', () => {
  test('Request validation', async () => {
    await testAgent
      .post('/api/oauth/user/register')
      .expect(422);
  });
});
