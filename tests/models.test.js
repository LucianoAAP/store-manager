const sinon = require('sinon');
const { expect } = require('chai');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { ObjectId } = require('mongodb');

const getConnection = require('../models/connection');
const productsModel = require('../models/Products');
const salesModel = require('../models/Sales');
const PRODUCT_ID_EXAMPLE = '619729662c898d2a96e352d0';
const SALE_ID_EXAMPLE = '619828487e99f5c893e40dcd';

describe('Testa model de produtos', () => {
  describe('Testa getAll', () => {
    let connectionMock; 
    const DBServer = new MongoMemoryServer();

    before(async () => {
      const URLMock = await DBServer.getUri();  
      connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => conn.db('StoreManager'));
      
      sinon.stub(getConnection, 'connect').resolves(connectionMock);
    });
    
    after(() => {
      getConnection.connect.restore();
    });

    describe('Quando não existe nenhum produto', () => {
      it('retorna um array', async () => {
        const products = await productsModel.getAll();
        expect(products).to.be.an('array');
      });
      
      it('O array está vazio', async () => {
        const products = await productsModel.getAll();
        expect(products).to.be.empty;
      });
    });

    describe('Quando existem Produtos', () => {
      const expectedProduct = {
        _id: ObjectId(PRODUCT_ID_EXAMPLE),
        name: 'Martelo de Thor',
        quantity: 100,
      };
  
      before(async () => {
        await connectionMock.collection('products').insertOne({ ...expectedProduct });
      }); 
      
      after(async () => {
        await connectionMock.collection('products').drop();
      });
  
      it('Retorna um array não vazio', async () => {
        const products = await productsModel.getAll();
        expect(products).to.be.an('array');
        expect(products).to.be.not.empty;
      });
  
      it('O array possui o objeto cadastrado', async () => {
        const [product] = await productsModel.getAll();
        expect(product).to.be.deep.equal(expectedProduct);
      });
    });
  });

  describe('Testa getById', () => {
    let connectionMock; 
    const DBServer = new MongoMemoryServer();

    before(async () => {
      const URLMock = await DBServer.getUri();  
      connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => conn.db('StoreManager'));
      
      sinon.stub(getConnection, 'connect').resolves(connectionMock);
    });
    
    after(() => {
      getConnection.connect.restore();
    });

    describe('Quando o produto não é encontrado', () => {
      it('Retorna null', async () => {
        const product = await productsModel.getById(PRODUCT_ID_EXAMPLE);
        expect(product).to.be.null;
      });
    });

    describe('Quando o produto é encontrado', () => {
      const expectedProduct = {
        _id: ObjectId(PRODUCT_ID_EXAMPLE),
        name: 'Martelo de Thor',
        quantity: 100,
      };
  
      before(async () => {
        await connectionMock.collection('products').insertOne({ ...expectedProduct });
      }); 
      
      after(async () => {
        await connectionMock.collection('products').drop();
      });
  
      it('Retorna o produto', async () => {
        const product = await productsModel.getById(PRODUCT_ID_EXAMPLE);
        expect(product).to.be.deep.equal(expectedProduct);
      });
    });
  });

  describe('Testa create', () => {
    let connectionMock; 
    const DBServer = new MongoMemoryServer();

    const expectedProduct = {
      _id: ObjectId(PRODUCT_ID_EXAMPLE),
      name: 'Martelo de Thor',
      quantity: 100,
    };

    before(async () => {
      const URLMock = await DBServer.getUri();  
      connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => conn.db('StoreManager'));
      
      sinon.stub(getConnection, 'connect').resolves(connectionMock);
    });
    
    after(() => {
      getConnection.connect.restore();
    });

    describe('Quando é inserido com sucesso', () => {
      it('Retorna o produto inserido', async () => {
        const { name, quantity } = expectedProduct;
        const product = await productsModel.create(name, quantity);
        expect(product).to.be.an('object');
        expect(product).to.have.property('name');
        expect(product).to.have.property('quantity');
        expect(product.name).to.be.equal('Martelo de Thor');
        expect(product.quantity).to.be.equal(100);
      });
      
      it('Deve existir um produto com o nome cadastrado', async () => {
        const { name, quantity } = expectedProduct;
        await productsModel.create(name, quantity);
        const createdProduct = await connectionMock.collection('products')
          .findOne({ name: expectedProduct.name });
        expect(createdProduct).to.include.all.keys(['name', 'quantity']);
        expect(createdProduct.name).to.be.equal('Martelo de Thor');
        expect(createdProduct.quantity).to.be.equal(100);
      });
    });
  });

  describe('Testa update', () => {
    let connectionMock; 
    const DBServer = new MongoMemoryServer();

    const expectedProduct = {
      _id: ObjectId(PRODUCT_ID_EXAMPLE),
      name: 'Martelo de Thor',
      quantity: 100,
    };

    const newProduct = { _id: PRODUCT_ID_EXAMPLE, name: 'Xablau', quantity: 200 };

    before(async () => {
      const URLMock = await DBServer.getUri();  
      connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => conn.db('StoreManager'));
      
      sinon.stub(getConnection, 'connect').resolves(connectionMock);
    });
    
    after(() => {
      getConnection.connect.restore();
    });

    describe('Atualiza um produto', () => {
      before(async () => {
        await connectionMock.collection('products').insertOne({ ...expectedProduct });
      }); 
      
      after(async () => {
        await connectionMock.collection('products').drop();
      });

      it('Retorna o produto atualizado', async () => {
        const { _id: id, name, quantity } = newProduct;
        const product = await productsModel.update(id, name, quantity);
        expect(product).to.be.deep.equal(newProduct);
      });

      it('Atualiza o produto no banco', async () => {
        const { _id: id, name, quantity } = newProduct;
        await productsModel.update(id, name, quantity);
        const updatedProduct = await connectionMock.collection('products')
          .findOne({ name: 'Xablau' });
        expect(updatedProduct).not.to.be.be.null;
      });
    });
  });

  describe('Testa delete', () => {
    let connectionMock; 
    const DBServer = new MongoMemoryServer();

    const expectedProduct = {
      _id: ObjectId(PRODUCT_ID_EXAMPLE),
      name: 'Martelo de Thor',
      quantity: 100,
    };

    before(async () => {
      const URLMock = await DBServer.getUri();  
      connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => conn.db('StoreManager'));
      
      sinon.stub(getConnection, 'connect').resolves(connectionMock);
    });
    
    after(() => {
      getConnection.connect.restore();
    });

    describe('Quando o produto é encontrado', () => {
      before(async () => {
        await connectionMock.collection('products').insertOne({ ...expectedProduct });
      }); 
      
      after(async () => {
        await connectionMock.collection('products').drop();
      });

      it('Retorna o produto apagado', async () => {
        const product = await productsModel.erase(PRODUCT_ID_EXAMPLE);
        expect(product).to.be.deep.equal({ _id: PRODUCT_ID_EXAMPLE, ...expectedProduct });
      });

      it('Apaga o produto do banco', async () => {
        await productsModel.erase(PRODUCT_ID_EXAMPLE);
        const deletedProduct = await connectionMock.collection('products')
          .findOne({ name: expectedProduct.name });
        expect(deletedProduct).to.be.be.null;
      });
    });
  });
});

describe('Testa model de sales', () => {
  const PRODUCT_ID_EXAMPLE = '619729662c898d2a96e352d0';

  describe('Testa getAll', () => {
    let connectionMock; 
    const DBServer = new MongoMemoryServer();

    before(async () => {
      const URLMock = await DBServer.getUri();  
      connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => conn.db('StoreManager'));
      
      sinon.stub(getConnection, 'connect').resolves(connectionMock);
    });
    
    after(() => {
      getConnection.connect.restore();
    });

    describe('Quando não existe nenhuma venda', () => {
      it('retorna um array', async () => {
        const sales = await salesModel.getAll();
        expect(sales).to.be.an('array');
      });
      
      it('O array está vazio', async () => {
        const sales = await salesModel.getAll();
        expect(sales).to.be.empty;
      });
    });

    describe('Quando existem Produtos', () => {
      const expectedProduct = {
        _id: ObjectId(PRODUCT_ID_EXAMPLE),
        name: 'Martelo de Thor',
        quantity: 100,
      };

      const expectedSale = {
        _id: ObjectId(SALE_ID_EXAMPLE),
        itensSold: [{ productId: PRODUCT_ID_EXAMPLE, quantity: 2 }],
      };
  
      before(async () => {
        await connectionMock.collection('products').insertOne({ ...expectedProduct });
        await connectionMock.collection('sales').insertOne({ ...expectedSale });
      }); 
      
      after(async () => {
        await connectionMock.collection('products').drop();
        await connectionMock.collection('sales').drop();
      });
  
      it('Retorna um array não vazio', async () => {
        const sales = await productsModel.getAll();
        expect(sales).to.be.an('array');
        expect(sales).to.be.not.empty;
      });
  
      it('O array possui o objeto cadastrado', async () => {
        const [sales] = await salesModel.getAll();
        expect(sales).to.be.deep.equal(expectedSale);
      });
    });
  });

  describe('Testa getById', () => {
    let connectionMock; 
    const DBServer = new MongoMemoryServer();

    before(async () => {
      const URLMock = await DBServer.getUri();  
      connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => conn.db('StoreManager'));
      
      sinon.stub(getConnection, 'connect').resolves(connectionMock);
    });
    
    after(() => {
      getConnection.connect.restore();
    });

    describe('Quando o produto não é encontrado', () => {
      it('Retorna null', async () => {
        const sale = await salesModel.getById(SALE_ID_EXAMPLE);
        expect(sale).to.be.null;
      });
    });

    describe('Quando o produto é encontrado', () => {
      const expectedProduct = {
        _id: ObjectId(PRODUCT_ID_EXAMPLE),
        name: 'Martelo de Thor',
        quantity: 100,
      };

      const expectedSale = {
        _id: ObjectId(SALE_ID_EXAMPLE),
        itensSold: [{ productId: PRODUCT_ID_EXAMPLE, quantity: 2 }],
      };
  
      before(async () => {
        await connectionMock.collection('products').insertOne({ ...expectedProduct });
        await connectionMock.collection('sales').insertOne({ ...expectedSale });
      }); 
      
      after(async () => {
        await connectionMock.collection('products').drop();
        await connectionMock.collection('sales').drop();
      });
  
      it('Retorna o produto', async () => {
        const sale = await salesModel.getById(SALE_ID_EXAMPLE);
        expect(sale).to.be.deep.equal(expectedSale);
      });
    });
  });

  describe('Testa create', () => {
    let connectionMock; 
    const DBServer = new MongoMemoryServer();

    const expectedProduct = {
      _id: ObjectId(PRODUCT_ID_EXAMPLE),
      name: 'Martelo de Thor',
      quantity: 100,
    };

    const expectedSale = {
      _id: ObjectId(SALE_ID_EXAMPLE),
      itensSold: [{ productId: PRODUCT_ID_EXAMPLE, quantity: 2 }],
    };

    before(async () => {
      const URLMock = await DBServer.getUri();  
      connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => conn.db('StoreManager'));
      
      sinon.stub(getConnection, 'connect').resolves(connectionMock);
    });
    
    after(() => {
      getConnection.connect.restore();
    });

    describe('Quando é inserida com sucesso', () => {
      before(async () => {
        await connectionMock.collection('products').insertOne({ ...expectedProduct });
      }); 
      
      after(async () => {
        await connectionMock.collection('products').drop();
      });

      it('Retorna a venda inserida', async () => {
        const sale = await salesModel.create(expectedSale.itensSold);
        expect(sale).to.be.an('object');
        expect(sale).to.have.property('itensSold');
        expect(sale.itensSold).to.be.deep.equal(expectedSale.itensSold);
      });
      
      it('Deve existir uma venda com o nome cadastrado', async () => {
        const sale = await salesModel.create(expectedSale.itensSold);
        const createdSale = await connectionMock.collection('sales')
          .findOne({ _id: sale._id });
        expect(createdSale).to.include.all.keys(['itensSold']);
        expect(createdSale.itensSold).to.be.deep.equal(expectedSale.itensSold);
      });
    });
  });

  describe('Testa update', () => {
    let connectionMock; 
    const DBServer = new MongoMemoryServer();

    const expectedProduct = {
      _id: ObjectId(PRODUCT_ID_EXAMPLE),
      name: 'Martelo de Thor',
      quantity: 100,
    };

    const expectedSale = {
      _id: ObjectId(SALE_ID_EXAMPLE),
      itensSold: [{ productId: PRODUCT_ID_EXAMPLE, quantity: 2 }],
    };

    const newSale = {
      _id: ObjectId(SALE_ID_EXAMPLE),
      itensSold: [{ productId: PRODUCT_ID_EXAMPLE, quantity: 3 }],
    };

    before(async () => {
      const URLMock = await DBServer.getUri();  
      connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => conn.db('StoreManager'));
      
      sinon.stub(getConnection, 'connect').resolves(connectionMock);
    });
    
    after(() => {
      getConnection.connect.restore();
    });

    describe('Atualiza um produto', () => {
      before(async () => {
        await connectionMock.collection('products').insertOne({ ...expectedProduct });
        await connectionMock.collection('sales').insertOne({ ...expectedSale });
      }); 
      
      after(async () => {
        await connectionMock.collection('products').drop();
        await connectionMock.collection('sales').drop();
      });

      it('Retorna a venda atualizada', async () => {
        const { _id: id, itensSold } = newSale;
        const sale = await salesModel.update(id, itensSold);
        expect(sale).to.be.deep.equal(newSale);
      });

      it('Atualiza a venda no banco', async () => {
        const { _id: id, itensSold } = newSale;
        await productsModel.update(id, itensSold);
        const updatedSale = await connectionMock.collection('sales')
          .findOne({ _id: id });
        expect(updatedSale).to.be.deep.equal(newSale);
      });
    });
  });

  describe('Testa delete', () => {
    let connectionMock; 
    const DBServer = new MongoMemoryServer();

    const expectedProduct = {
      _id: ObjectId(PRODUCT_ID_EXAMPLE),
      name: 'Martelo de Thor',
      quantity: 100,
    };

    const expectedSale = {
      _id: ObjectId(SALE_ID_EXAMPLE),
      itensSold: [{ productId: PRODUCT_ID_EXAMPLE, quantity: 2 }],
    };

    before(async () => {
      const URLMock = await DBServer.getUri();  
      connectionMock = await MongoClient.connect(URLMock, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((conn) => conn.db('StoreManager'));
      
      sinon.stub(getConnection, 'connect').resolves(connectionMock);
    });
    
    after(() => {
      getConnection.connect.restore();
    });

    describe('Quando a venda é encontrada', () => {
      before(async () => {
        await connectionMock.collection('products').insertOne({ ...expectedProduct });
        await connectionMock.collection('sales').insertOne({ ...expectedSale });
      }); 
      
      after(async () => {
        await connectionMock.collection('products').drop();
        await connectionMock.collection('sales').drop();
      });

      it('Retorna a venda apagada', async () => {
        const sale = await salesModel.erase(SALE_ID_EXAMPLE);
        expect(sale).to.be.deep.equal({ _id: SALE_ID_EXAMPLE, ...expectedSale });
      });

      it('Apaga a venda do banco', async () => {
        await salesModel.erase(SALE_ID_EXAMPLE);
        const deletedSale = await connectionMock.collection('sales')
          .findOne({ _id: SALE_ID_EXAMPLE });
        expect(deletedSale).to.be.be.null;
      });
    });
  });
});
