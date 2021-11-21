const sinon = require('sinon');
const { expect } = require('chai');

const productsModel = require('../../models/Products');
const salesModel = require('../../models/Sales');
const productsService = require('../../services/Products');
const salesService = require('../../services/Sales');
const {
  wrongIdError,
  productAlreadyExistsError,
  invalidIdOrQuantityError,
  saleNotFoundError,
  wrongSaleIdError,
  notAllowedAmmountError,
} = require('../../utils/validations');
const PRODUCT_ID_EXAMPLE = '619729662c898d2a96e352d0';
const SALE_ID_EXAMPLE = '619828487e99f5c893e40dcd';

describe('Testa service de products', () => {
  const expectedProduct = {
    _id: PRODUCT_ID_EXAMPLE,
    name: 'Martelo de Thor',
    quantity: 100,
  };

  describe('Testa getAll', () => {
    before(async () => {
      sinon.stub(productsModel, 'getAll').resolves([expectedProduct]);
    });
    
    after(() => {
      productsModel.getAll.restore();
    });

    it('Retorna a lista correta', async () => {
      const list = await productsService.getAll();
      expect(list).to.be.deep.equal([expectedProduct]);
    });
  });

  describe('Testa getById', () => {
    describe('Quando o produto não existe', () => {
      before(async () => {
        sinon.stub(productsModel, 'getById').resolves(null);
      });
      
      after(() => {
        productsModel.getById.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const product = await productsService.getById(PRODUCT_ID_EXAMPLE);
        expect(product).to.be.deep.equal(wrongIdError);
      });
    });

    describe('Quando o produto existe', () => {
      before(async () => {
        sinon.stub(productsModel, 'getById').resolves(expectedProduct);
      });
      
      after(() => {
        productsModel.getById.restore();
      });

      it('Retorna o produto correto', async () => {
        const product = await productsService.getById(PRODUCT_ID_EXAMPLE);
        expect(product).to.be.deep.equal(expectedProduct);
      });
    });
  });

  describe('Testa create', () => {
    describe('Quando o produto já existe no estoque', () => {
      before(async () => {
        sinon.stub(productsModel, 'create').resolves(null);
      });
      
      after(() => {
        productsModel.create.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const { name, quantity } = expectedProduct;
        const product = await productsService.create(name, quantity);
        expect(product).to.be.deep.equal(productAlreadyExistsError);
      });
    });

    describe('Quando o produto não existe no estoque', () => {
      before(async () => {
        sinon.stub(productsModel, 'create').resolves(expectedProduct);
      });
      
      after(() => {
        productsModel.create.restore();
      });

      it('Retorna o produto criado', async () => {
        const { name, quantity } = expectedProduct;
        const product = await productsService.create(name, quantity);
        expect(product).to.be.deep.equal(expectedProduct);
      });
    });
  });

  describe('Testa update', () => {
    const newProduct = { _id: PRODUCT_ID_EXAMPLE, name: 'Xablau', quantity: 200 };

    describe('Quando o produto não existe', () => {
      before(async () => {
        sinon.stub(productsModel, 'getById').resolves(null);
      });
      
      after(() => {
        productsModel.getById.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const { _id, name, quantity } = newProduct;
        const product = await productsService.update(_id, name, quantity);
        expect(product).to.be.deep.equal(wrongIdError);
      });
    });

    describe('Quando o produto existe', () => {
      before(async () => {
        sinon.stub(productsModel, 'getById').resolves(expectedProduct);
        sinon.stub(productsModel, 'update').resolves(newProduct);
      });
      
      after(() => {
        productsModel.getById.restore();
        productsModel.update.restore();
      });

      it('Retorna o produto correto', async () => {
        const { _id, name, quantity } = newProduct;
        const product = await productsService.update(_id, name, quantity);
        expect(product).to.be.deep.equal(newProduct);
      });
    });
  });

  describe('Testa erase', () => {
    describe('Quando o produto não existe', () => {
      before(async () => {
        sinon.stub(productsModel, 'getById').resolves(null);
      });
      
      after(() => {
        productsModel.getById.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const product = await productsService.erase(PRODUCT_ID_EXAMPLE);
        expect(product).to.be.deep.equal(wrongIdError);
      });
    });

    describe('Quando o produto existe', () => {
      before(async () => {
        sinon.stub(productsModel, 'getById').resolves(expectedProduct);
        sinon.stub(productsModel, 'erase').resolves(expectedProduct);
      });
      
      after(() => {
        productsModel.getById.restore();
        productsModel.erase.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const product = await productsService.erase(PRODUCT_ID_EXAMPLE);
        expect(product).to.be.deep.equal(expectedProduct);
      });
    });
  });
});

describe('Testa service de sales', () => {
  const expectedSale = {
    _id: SALE_ID_EXAMPLE,
    itensSold: [{ productId: PRODUCT_ID_EXAMPLE, quantity: 2 }],
  };

  const validStock = [{ id: PRODUCT_ID_EXAMPLE, name: 'Martelo de Thor', quantity: 100 }];

  const invalidStock = [{ id: PRODUCT_ID_EXAMPLE, name: 'Martelo de Thor', quantity: 1 }];

  describe('Testa getAll', () => {
    before(async () => {
      sinon.stub(salesModel, 'getAll').resolves([expectedSale]);
    });
    
    after(() => {
      salesModel.getAll.restore();
    });

    it('Retorna a lista correta', async () => {
      const list = await salesService.getAll();
      expect(list).to.be.deep.equal([expectedSale]);
    });
  });

  describe('Testa getById', () => {
    describe('Quando a venda não existe', () => {
      before(async () => {
        sinon.stub(salesModel, 'getById').resolves(null);
      });
      
      after(() => {
        salesModel.getById.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const sale = await salesService.getById(SALE_ID_EXAMPLE);
        expect(sale).to.be.deep.equal(saleNotFoundError);
      });
    });

    describe('Quando a venda existe', () => {
      before(async () => {
        sinon.stub(salesModel, 'getById').resolves(expectedSale);
      });
      
      after(() => {
        salesModel.getById.restore();
      });

      it('Retorna a venda correta', async () => {
        const sale = await salesService.getById(SALE_ID_EXAMPLE);
        expect(sale).to.be.deep.equal(expectedSale);
      });
    });
  });

  describe('Testa create', () => {
    describe('Quando o produto não existe no estoque', () => {
      before(async () => {
        sinon.stub(productsModel, 'filterByIds').resolves([null]);
      });
      
      after(() => {
        productsModel.filterByIds.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const sale = await salesService.create(expectedSale.itensSold);
        expect(sale).to.be.deep.equal(invalidIdOrQuantityError);
      });
    });

    describe('Quando não há produtos o suficiente no estoque', () => {
      before(async () => {
        sinon.stub(productsModel, 'filterByIds').resolves(invalidStock);
      });
      
      after(() => {
        productsModel.filterByIds.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const sale = await salesService.create(expectedSale.itensSold);
        expect(sale).to.be.deep.equal(notAllowedAmmountError);
      });
    });

    describe('Quando a venda é válida', () => {
      before(async () => {
        sinon.stub(productsModel, 'filterByIds').resolves(validStock);
        sinon.stub(productsModel, 'update').resolves('');
        sinon.stub(salesModel, 'create').resolves(expectedSale);
      });
      
      after(() => {
        productsModel.filterByIds.restore();
        productsModel.update.restore();
        salesModel.create.restore();
      });

      it('Retorna a venda', async () => {
        const sale = await salesService.create(expectedSale.itensSold);
        expect(sale).to.be.deep.equal(expectedSale);
      });
    });
  });

  describe('Testa update', () => {
    const newSale = {
      _id: SALE_ID_EXAMPLE,
      itensSold: [{ productId: PRODUCT_ID_EXAMPLE, quantity: 4 }],
    };

    describe('Quando a venda não existe', () => {
      before(async () => {
        sinon.stub(salesModel, 'getById').resolves(null);
      });
      
      after(() => {
        salesModel.getById.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const { _id, itensSold } = newSale;
        const sale = await salesService.update(_id, itensSold);
        expect(sale).to.be.deep.equal(saleNotFoundError);
      });
    });

    describe('Quando não há estoque o suficiente para a nova venda', () => {
      before(async () => {
        sinon.stub(salesModel, 'getById').resolves(expectedSale);
        sinon.stub(productsModel, 'filterByIds').resolves(invalidStock);
      });
      
      after(() => {
        salesModel.getById.restore();
        productsModel.filterByIds.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const { _id, itensSold } = newSale;
        const sale = await salesService.update(_id, itensSold);
        expect(sale).to.be.deep.equal(notAllowedAmmountError);
      });
    });

    describe('Quando a nova venda é válida', () => {
      before(async () => {
        sinon.stub(salesModel, 'getById').resolves(expectedSale);
        sinon.stub(productsModel, 'filterByIds').resolves(validStock);
        sinon.stub(productsModel, 'update').resolves('');
        sinon.stub(salesModel, 'update').resolves(newSale);
      });
      
      after(() => {
        salesModel.getById.restore();
        productsModel.filterByIds.restore();
        productsModel.update.restore();
        salesModel.update.restore();
      });

      it('Retorna a venda correta', async () => {
        const { _id, itensSold } = newSale;
        const sale = await salesService.update(_id, itensSold);
        expect(sale).to.be.deep.equal(newSale);
      });
    });
  });

  describe('Testa erase', () => {
    describe('Quando a venda não existe', () => {
      before(async () => {
        sinon.stub(salesModel, 'getById').resolves(saleNotFoundError);
      });
      
      after(() => {
        salesModel.getById.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const sale = await salesService.erase(SALE_ID_EXAMPLE);
        expect(sale).to.be.deep.equal(wrongSaleIdError);
      });
    });

    describe('Quando a venda existe', () => {
      before(async () => {
        sinon.stub(salesModel, 'getById').resolves(expectedSale);
        sinon.stub(productsModel, 'filterByIds').resolves(validStock);
        sinon.stub(productsModel, 'update').resolves('');
        sinon.stub(salesModel, 'erase').resolves(expectedSale);
      });
      
      after(() => {
        salesModel.getById.restore();
        productsModel.filterByIds.restore();
        productsModel.update.restore();
        salesModel.erase.restore();
      });

      it('Retorna a mensagem de erro correta', async () => {
        const sale = await salesService.erase(SALE_ID_EXAMPLE);
        expect(sale).to.be.deep.equal(expectedSale);
      });
    });
  });
});
