const sinon = require('sinon');
const { expect } = require('chai');

const productsService = require('../services/Products');
const salesService = require('../services/Sales');
const productsController = require('../controllers/Products');
const salesController = require('../controllers/Sales');
const PRODUCT_ID_EXAMPLE = '619729662c898d2a96e352d0';
const SALE_ID_EXAMPLE = '619828487e99f5c893e40dcd';

describe('Testa controller de products', () => {
  const expectedProduct = {
    _id: PRODUCT_ID_EXAMPLE,
    name: 'Martelo de Thor',
    quantity: 100,
  };

  describe('Testa getAll', () => {
    const response = {};
    const request = {};

    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      
      sinon.stub(productsService, 'getAll').resolves([expectedProduct]);
    });

    after(() => {
      productsService.getAll.restore();
    });

    it('É chamado o status com o código 200 e com o json correto', async () => {
      await productsController.getAll(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith({ products: [expectedProduct] })).to.be.equal(true);
    });
  });

  describe('Testa getById', () => {
    describe('Quando o produto existe', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: PRODUCT_ID_EXAMPLE };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = sinon.stub().returns();
        
        sinon.stub(productsService, 'getById').resolves(expectedProduct);
      });

      after(() => {
        productsService.getById.restore();
      });

      it('É chamado o status com o código 200 e com o json correto', async() => {
        await productsController.getById(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
        expect(response.json.calledWith(expectedProduct)).to.be.equal(true);
      });
    });
  });

  describe('Testa create', () => {
    describe('Quando o produto é adicionado', () => {
      const response = {};
      const request = {};

      before(() => {
        request.body = {
          name: expectedProduct.name,
          quantity: expectedProduct.quantity,
        };

        response.status = sinon.stub()
          .returns(response);
        response.json = sinon.stub()
          .returns();

        sinon.stub(productsService, 'create')
          .resolves(expectedProduct);
      });

      after(() => {
        productsService.create.restore();
      });

      it('É chamado o status com o código 201 e com o json correto', async () => {
        await productsController.create(request, response);
        expect(response.status.calledWith(201)).to.be.equal(true);
        expect(response.json.calledWith(expectedProduct)).to.be.equal(true);
      });
    });
  });

  describe('Testa update', () => {
    const newProduct = { _id: PRODUCT_ID_EXAMPLE, name: 'Xablau', quantity: 200 };

    describe('Quando o produto é atualizado', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: PRODUCT_ID_EXAMPLE };

        request.body = {
          name: newProduct.name,
          quantity: newProduct.quantity,
        };

        response.status = sinon.stub()
          .returns(response);
        response.json = sinon.stub()
          .returns();

        sinon.stub(productsService, 'update')
          .resolves({ _id: PRODUCT_ID_EXAMPLE, ...newProduct });
      });

      after(() => {
        productsService.update.restore();
      });

      it('É chamado o status com o código 200 e com o json correto', async () => {
        await productsController.update(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
        expect(response.json.calledWith({ _id: PRODUCT_ID_EXAMPLE, ...newProduct })).to.be.equal(true);
      });
    });
  });

  describe('Testa erase', () => {
    describe('Quando o produto é apagado', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: PRODUCT_ID_EXAMPLE };

        response.status = sinon.stub()
          .returns(response);
        response.json = sinon.stub()
          .returns();

        sinon.stub(productsService, 'erase')
          .resolves(expectedProduct);
      });

      after(() => {
        productsService.erase.restore();
      });

      it('É chamado o status com o código 200 e com o json correto', async () => {
        await productsController.erase(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
        expect(response.json.calledWith(expectedProduct)).to.be.equal(true);
      });
    });
  });
});

describe('Testa controller de sales', () => {
  const expectedSale = {
    _id: SALE_ID_EXAMPLE,
    itensSold: [{ productId: PRODUCT_ID_EXAMPLE, quantity: 2 }],
  };

  describe('Testa getAll', () => {
    const response = {};
    const request = {};

    before(() => {
      response.status = sinon.stub().returns(response);
      response.json = sinon.stub().returns();
      
      sinon.stub(salesService, 'getAll').resolves([expectedSale]);
    });

    after(() => {
      salesService.getAll.restore();
    });

    it('É chamado o status com o código 200 e com o json correto', async () => {
      await salesController.getAll(request, response);
      expect(response.status.calledWith(200)).to.be.equal(true);
      expect(response.json.calledWith({ sales: [expectedSale] })).to.be.equal(true);
    });
  });

  describe('Testa getById', () => {
    describe('Quando a venda existe', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: SALE_ID_EXAMPLE };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = sinon.stub().returns();
        
        sinon.stub(salesService, 'getById').resolves(expectedSale);
      });

      after(() => {
        salesService.getById.restore();
      });

      it('É chamado o status com o código 200 e com o json correto', async() => {
        await salesController.getById(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
        expect(response.json.calledWith(expectedSale)).to.be.equal(true);
      });
    });
  });

  describe('Testa create', () => {
    describe('Quando a venda é adicionada', () => {
      const response = {};
      const request = {};

      before(() => {
        request.body = expectedSale.itensSold;

        response.status = sinon.stub()
          .returns(response);
        response.json = sinon.stub()
          .returns();

        sinon.stub(salesService, 'create')
          .resolves(expectedSale);
      });

      after(() => {
        salesService.create.restore();
      });

      it('É chamado o status com o código 200 e com o json correto', async () => {
        await salesController.create(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
        expect(response.json.calledWith(expectedSale)).to.be.equal(true);
      });
    });
  });

  describe('Testa update', () => {
    const newSale = {
      _id: SALE_ID_EXAMPLE,
      itensSold: [{ productId: PRODUCT_ID_EXAMPLE, quantity: 4 }],
    };

    describe('Quando a venda é atualizada', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: SALE_ID_EXAMPLE };

        request.body = newSale.itensSold;

        response.status = sinon.stub()
          .returns(response);
        response.json = sinon.stub()
          .returns();

        sinon.stub(salesService, 'update')
          .resolves({ _id: SALE_ID_EXAMPLE, ...newSale });
      });

      after(() => {
        salesService.update.restore();
      });

      it('É chamado o status com o código 200 e com o json correto', async () => {
        await salesController.update(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
        expect(response.json.calledWith({ _id: SALE_ID_EXAMPLE, ...newSale })).to.be.equal(true);
      });
    });
  });

  describe('Testa erase', () => {
    describe('Quando a venda é apagada', () => {
      const response = {};
      const request = {};

      before(() => {
        request.params = { id: SALE_ID_EXAMPLE };

        response.status = sinon.stub()
          .returns(response);
        response.json = sinon.stub()
          .returns();

        sinon.stub(salesService, 'erase')
          .resolves(expectedSale);
      });

      after(() => {
        salesService.erase.restore();
      });

      it('É chamado o status com o código 200 e com o json correto', async () => {
        await salesController.erase(request, response);
        expect(response.status.calledWith(200)).to.be.equal(true);
        expect(response.json.calledWith(expectedSale)).to.be.equal(true);
      });
    });
  });
});
