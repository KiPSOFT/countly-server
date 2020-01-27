const plugins = require('../../pluginManager.js');
const common = require("../../../api/utils/common.js");
const exported = {};

(function() {
    plugins.register("/i/mymetric", function(ob) {
        const params = ob.params;
        const qp = params.qstring;
        try {
            if (!qp.app_key || !qp.device_id || !qp.my_metric || !qp.my_metric_count) {
                throw new Error('Parameters is missing.')
            }
            common.db.collection('myMetric').insertOne({myMetric: common.moment(qp.my_metric, 'YYYY-MM-DD').toDate(), myMetricCount: qp.my_metric_count});
            common.returnMessage(params, 200, '');
            return true;
        } catch (err) {
            console.log(err.stack);
            common.returnMessage(params, 500, err.message);
            return false;
        }
    });
    plugins.register('/o/mymetric', async function(ob) {
        const params = ob.params;
        try {
            const t1 = common.moment(params.qstring.t1 + ' 00:00', 'YYYY-M-DD HH:mm').toDate();
            const t2 = common.moment(params.qstring.t2 + ' 23:59', 'YYYY-M-DD HH:mm').toDate();
            const col = common.db.collection('myMetric');
            col.find({myMetric: {$gte: t1, $lte: t2}}).sort({myMetricCount: -1 }).toArray((err, res) => {
                if (err) {
                    console.log(err.stack);
                    throw err;
                }
                common.returnOutput(params, res);
            });
        } catch (err) {
            console.log(err.stack);
            common.returnMessage(params, 500, err.message);
            return false;
        }
    });
}(exported));

module.exports = exported;
