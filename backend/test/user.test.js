// const { expect } = require('chai');
// const { describe, it } = require('mocha');
// const userController = require('../controllers/userController');

// // test for userController create user method
// describe('userController', () => {
//   describe('createUser', () => {
//     it('should create a new user', () => {
//       const req = {
//         body: {
//           username: 'test',
//           password: 'test',
//         },
//       };
//       const res = {
//         status() {},
//         json() {},
//       };
//       userController.create(req, res).then((result) => {
//         expect(result).to.be.an('object');
//         expect(result.username).to.equal('test');
//         expect(result.password).to.equal('test');
//         expect(result.role).to.equal('shopper');
//         expect(result.password).to.equal('test');
//       });
//     });
//   });
// });