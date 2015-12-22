process.env.NODE_ENV = 'test';

const config = require('../../config'),
			expect = require('chai').expect,
			Lab = require('lab'),
			common = require('../common'),
			mongoose = require('mongoose'),
			_ = require('lodash'),
			Promise = require('bluebird'),
			internals = {};

// make unit tests look like mocha
lab = exports.lab = Lab.script();
describe = lab.describe;
it = lab.it;
before = lab.before;
after = lab.after;
beforeEach = lab.beforeEach;

internals.server = {};
internals.modelName = '';
internals.testModels = {};
internals.testData = [
	{
		username : 'user1', 
		password : 'password1', 
		data : [
			{ key : 'key', value : 'value' }
		],
		nested : {
			nested1 : 'nested1', 
			nested2 : { nested3 : 'nested3' }
		}
	},
	{
		username : 'user2', 
		password : 'password2', 
		data : [
			{ key : 'key',  value : 'value' },
			{ key: 'key2', value: 'value2' }
		], 
		nested : {
			nested1 : 'nested1',
			nested2 : { nested3 : 'nested3' }
		}
	}
];

describe('API', () => {
	before(done => {
		common.serverPromise.then(res => {
			internals.server = res;
			internals.modelName = common.serverModel.collection.collectionName;
			done();
		});
	});

	beforeEach((done) => {
		common.serverModel
			.remove({}).exec() // remove all test documents
			.then(() => { // save new documents
				return Promise.map(internals.testData, e => new common.serverModel(e).save());
			}).then(models => { // cache models
				internals.testModels = models;
			}).then(done);
	});

	it('new test document', done => {
		testData = internals.testData[0];
		options = { method: 'POST', url: `/${internals.modelName}`, payload: testData };
		internals.server.inject(options, res => {
			postResults = JSON.parse(res.payload).results;

			compareWith = _.cloneDeep(postResults);
			compareWith.data.forEach(e => delete e._id);
			delete compareWith._id;
			delete compareWith.__v;
			expect(compareWith).to.deep.equal(testData);

			options = { method: 'GET', url: `/${internals.modelName}/${postResults._id}` }
			internals.server.inject(options, res => {
				getResults = JSON.parse(res.payload).results;
				expect(getResults).to.deep.equal(postResults)
				done();
			});
		});
	});
});