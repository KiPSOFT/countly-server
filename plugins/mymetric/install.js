const pluginManager = require('../pluginManager.js');
const countlyDb = pluginManager.dbConnection();

console.log('myMetric collection creating...');
countlyDb.createCollection('myMetricCollection', {capped: true, size: 10000000, max: 1000}, () => {
    countlyDb.close();
    console.log('myMetric collection created.');
});
