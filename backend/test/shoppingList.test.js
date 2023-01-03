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

  // create shopping list wrong session id
  describe('create shopping list wrong session id', () => {
    it('should not create a shopping list', () => {
      const req = {
        body: {
          "name": shoppingListName
        },
        Headers: {
          sessionId: 'wrong session id',
          contentType: 'application/json',
        },
      };
      const res = {
        status() {},
        json() {},
      };
      shoppingListController.create(req, res).then((result) => {
        expect(result).to.be.an('object');
        expect(result.message).to.equal('Session id is invalid.');
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

    // add item to shopping list (update) wrong shopping list id
    describe('add item to shopping list wrong shopping list id', () => {
      it('should not add item to a shopping list', () => {
        const req = {
          body: {
            "name": "Testovaci polozka",
            "quantity": 1,
            "shoppingListId": 'wrong shopping list id'
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
          expect(result.message).to.equal('Shopping list id is invalid.');
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

  // get one shopping list wrong shopping list id
  describe('get shopping list wrong shopping list id', () => {
    it('should not get a shopping list', () => {
      const req = {
        params: {
          id: 'wrong shopping list id',
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
        expect(result.message).to.equal('Shopping list id is invalid.');
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

    // get all shopping lists wrong session id
    describe('get all shopping lists wrong session id', () => {
      it('should not get all shopping lists', () => {
        const req = {
          Headers: {
            sessionId: 'wrong session id',
            contentType: 'application/json',
          },
        };
        const res = {
          status() {},
          json() {},
        };
        shoppingListController.getAll(req, res).then((result) => {
          expect(result).to.be.an('object');
          expect(result.message).to.equal('Session id is invalid.');
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

    // delete shopping list wrong shopping list id
    describe('delete shopping list wrong shopping list id', () => {
      it('should not delete a shopping list', () => {
        const req = {
          params: {
            id: 'wrong shopping list id',
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
          expect(result.message).to.equal('Shopping list id is invalid.');
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