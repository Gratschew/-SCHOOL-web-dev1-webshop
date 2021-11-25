const chai = require('chai');
const expect = chai.expect;
const { createResponse } = require('node-mocks-http');
const {
  registerUser,
  fetchUser,
  validateEmail
} = require('../../controllers/users');

const User = require('../../models/user');

// Get users (create copies for test isolation)
const users = require('../../setup/users.json').map(user => ({ ...user }));
const adminUser = { ...users.find(u => u.role === 'admin') };
const customerUser = { ...users.find(u => u.role === 'customer') };

describe('Users Controller', () => {
  let currentUser;
  let customer;
  let response;

  beforeEach(async () => {
    // reset database
    await User.deleteMany({});
    await User.create(users);

    // set variables
    currentUser = await User.findOne({ email: adminUser.email }).exec();
    customer = await User.findOne({ email: customerUser.email }).exec();
    response = createResponse();
  });

  describe('registerUser()', () => {   
    it('should respond with "400 Bad Request" when lowercased email is already in use', async () => {
        const testEmail = adminUser.email.toUpperCase();
        const userData = { ...adminUser, email: testEmail };
        await registerUser(response, userData);
        expect(response.statusCode).to.equal(400);
        expect(response._isEndCalled()).to.be.true;
    });

    it('should turn the email address to lowercase when a new user is saved', async () => {
        const testEmail = 'TEST@gmAIl.com';
        const userData = { ...adminUser, email: testEmail };
        await registerUser(response, userData);
        const createdUser = await User.findOne({ email: testEmail.toLowerCase() });
        expect(createdUser).to.not.be.null;
      });

    it('should respond with "201 Created" when registration is successful with an uppercased email ', async () => {
        const testEmail = 'TEST@EmAIl1.com';
        const userData = { ...adminUser, email: testEmail };
        await registerUser(response, userData);
        const createdUser = await User.findOne({ email: testEmail.toLowerCase() });
        expect(response.statusCode).to.equal(201);
        expect(response.getHeader('content-type')).to.equal('application/json');
        expect(response._isJSON()).to.be.true;
        expect(response._isEndCalled()).to.be.true;
        expect(createdUser).to.not.be.null;
        expect(createdUser).to.not.be.undefined;
        expect(createdUser).to.be.an('object');
    });

  });

  describe('validateEmail()', () => {
    it('should respond with "false" if the address is missing an @-sign', async () => {

        const testEmail = adminUser.email.replace('@', '');
        const result = validateEmail(testEmail);
        expect(result).to.equal(false);

    });

    it('should respond with "false" if the address has non-allowed characters', async () => {
        const testEmail = 'test,@gma!l.com';
        const result = validateEmail(testEmail);
        expect(result).to.equal(false);
    });

    it('should respond with "false" if the address has a double @@-signs', async () => {
      const testEmail = 'test@@gmail.com';
      const result = validateEmail(testEmail);
      expect(result).to.equal(false);
    });

    it('should respond with "true" if the address is a real address with a dot', async () => {
        const testEmail = 'test.1@gmail.com';
        const result = validateEmail(testEmail);
        expect(result).to.equal(true);
    });

    it('should respond with "true" if the address is a simple address without a dot', async () => {
        const testEmail = 'test@gmail.com';
        const result = validateEmail(testEmail);
        expect(result).to.equal(true);
    });


  });


  describe('fetchUser()', () => {
    it('should respond with "null" if user with given userId does not exist', async () => {
        const userId = currentUser.id.split('').reverse().join('');
        const wantedUser = await fetchUser(userId);
        expect(wantedUser).to.be.null;
      });
     
    it('should respond with the user having the wanted id', async () => {
        const userId = currentUser.id;
        const wantedUser = await fetchUser(userId);
        expect(wantedUser.id).to.equal(userId);
    });
  });
});