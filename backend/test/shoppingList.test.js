const { expect } = require('chai');
const { describe, it, before, beforeEach } = require('mocha');
const userController = require('../controllers/userController');
const shoppingListController = require('../controllers/shoppingListController');

let sessionId;
let userId;
let shoppingListId;
let userName = 'test';
let password = 'test';
let shoppingListName = 'Testovaci nakupni listek';

before(() => {
  const req = {
    body: {
      username: userName,
      password: password,
    },
  };
  const res = {
    status() {},
    json() {},
  };
  userController.create(req, res).then(() => {
    userController.login(req, res).then((result) => {
      sessionId = result.sessionId;
      userId = result._id;
    });
  });
});

// tests for shoppingListController
describe('shopping list', () => {

  // create shopping list
  describe('create shopping list', () => {
    it('should create a shopping list', () => {
      const req = {
        body: {
          "name": shoppingListName
        },
        Headers: {
          sessionId: sessionId,
          contentType: 'application/json',
        },
      };
      const res = {
        status() {},
        json() {},
      };
      shoppingListController.create(req, res).then((result) => {
        expect(result).to.be.an('object');
        expect(result.name).to.equal(shoppingListName);
        expect(result.ownerId).to.equal(userId);
        shoppingListId = result._id;
      });
    });
  });

  // add item to shopping list (update)
  describe('add item to shopping list', () => {
    it('should add item to a shopping list', () => {
      const req = {
        body: {
          "name": "Testovaci polozka",
          "quantity": 1,
          "shoppingListId": shoppingListId
        },
        Headers: {
          sessionId: sessionId,
          contentType: 'application/json',
        },
      };
      const res = {
        status() {},
        json() {},
      };
      shoppingListController.addItem(req, res).then((result) => {
        expect(result).to.be.an('object');
        expect(result.name).to.equal(shoppingListName);
        expect(result.ownerId).to.equal(userId);
        expect(result.items).to.be.an('array');
        expect(result.items[0].name).to.equal("Testovaci polozka");
        expect(result.items[0].quantity).to.equal(1);
      });
    });
  });

  // get one shopping list
  describe('get shopping list', () => {
    it('should get a shopping list', () => {
      const req = {
        params: {
          id: shoppingListId,
        },
        Headers: {
          sessionId: sessionId,
          contentType: 'application/json',
        },
      };
      const res = {
        status() {},
        json() {},
      };
      shoppingListController.getOne(req, res).then((result) => {
        expect(result).to.be.an('object');
        expect(result.name).to.equal(shoppingListName);
        expect(result.ownerId).to.equal(userId);
        expect(result.items).to.be.an('array');
        expect(result.items[0].name).to.equal("Testovaci polozka");
        expect(result.items[0].quantity).to.equal(1);
      });
    });
  });

  // get all shopping lists
  describe('get all shopping lists (should be 1)', () => {
    it('should get all shopping lists', () => {
      const req = {
        Headers: {
          sessionId: sessionId,
          contentType: 'application/json',
        },
      };
      const res = {
        status() {},
        json() {},
      };
      shoppingListController.getAll(req, res).then((result) => {
        expect(result).to.be.an('array');
        expect(result[0].name).to.equal(shoppingListName);
        expect(result[0].ownerId).to.equal(userId);
        expect(result[0].items).to.be.an('array');
        expect(result[0].items[0].name).to.equal("Testovaci polozka");
        expect(result[0].items[0].quantity).to.equal(1);
      });
    });
  });

  // delete shopping list
  describe('delete shopping list', () => {
    it('should delete a shopping list', () => {
      const req = {
        params: {
          id: shoppingListId,
        },
        Headers: {
          sessionId: sessionId,
          contentType: 'application/json',
        },
      };
      const res = {
        status() {},
        json() {},
      };
      shoppingListController.delete(req, res).then((result) => {
        expect(result).to.be.an('object');
        expect(result.name).to.equal(shoppingListName);
        expect(result.ownerId).to.equal(userId);
        expect(result.items).to.be.an('array');
        expect(result.items[0].name).to.equal("Testovaci polozka");
        expect(result.items[0].quantity).to.equal(1);
      });
    });
  });

  // get all shopping lists
  describe('get all shopping lists (should be 0)', () => {
    it('should get all shopping lists', () => {
      const req = {
        Headers: {
          sessionId: sessionId,
          contentType: 'application/json',
        },
      };
      const res = {
        status() {},
        json() {},
      };
      shoppingListController.getAll(req, res).then((result) => {
        expect(result).to.be.an('array');
        expect(result.length).to.equal(0);
      });
    });
  });
});