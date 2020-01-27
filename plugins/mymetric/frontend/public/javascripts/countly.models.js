/*global moment, CountlyHelpers, jQuery*/
(function(countlyMetric, $) {
    var _list = [];
    countlyMetric.init = function(period) {
        $.ajax({
            type: "GET",
            url: countlyCommon.API_URL + "/o/mymetric",
            data: {
                t1: (period.currentPeriodArr === undefined ? period.activePeriod : period.currentPeriodArr[0]),
                t2: (period.currentPeriodArr === undefined ? period.activePeriod : period.currentPeriodArr[period.currentPeriodArr.length - 1])
            },
            success: function(json) {
                _list = json;
            },
            error: function() {
            }
        });
    }

    countlyMetric.getData = function() {
        return _list;
    }

    countlyMetric.getBars = function() {
        if (_list.length > 0) {
            var toplam = 0;
            for(var i = 0; i < _list.length; i++) {
                toplam += parseInt(_list[i].myMetricCount, 10);
            }
            var bars = [
                {
                    title: jQuery.i18n.map['mymetric.top-metric'],
                    data: [
                        {
                            name: _list[0].myMetricCount,
                            percent: Math.floor((_list[0].myMetricCount * 100) / toplam),
                            background: 'red'
                        }, {
                            name: _list[1].myMetricCount,
                            percent: Math.floor((_list[1].myMetricCount * 100) / toplam),
                            background: 'red'
                        }, {
                            name: _list[2].myMetricCount,
                            percent: Math.floor((_list[2].myMetricCount * 100) / toplam),
                            background: 'red'
                        }
                    ]
                }, {
                    title: jQuery.i18n.map['mymetric.top-dates'],
                    data: [
                        {
                            name: moment(_list[0].myMetric).format('DD MMM'),
                            percent: Math.floor((_list[0].myMetricCount * 100) / toplam),
                            background: 'red'
                        }, {
                            name: moment(_list[1].myMetric).format('DD MMM'),
                            percent: Math.floor((_list[1].myMetricCount * 100) / toplam),
                            background: 'red'
                        }, {
                            name: moment(_list[2].myMetric).format('DD MMMM'),
                            percent: Math.floor((_list[2].myMetricCount * 100) / toplam),
                            background: 'red'
                        }
                    ]
                }
            ];
            return bars;
        } else return [];
    }

    
})(window.countlyMetric = window.countlyMetric || {}, jQuery);