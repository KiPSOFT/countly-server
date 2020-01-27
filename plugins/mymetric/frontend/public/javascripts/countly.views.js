/*globals countlyView,_,moment */
window.mymetricView = countlyView.extend({
    initialize: function() {

    },
    activePlatform: {},
    beforeRender: function() {
        var self = this;
        console.log('beforeRender');
        if (self.template) {
            return $.when(countlyMetric.init(countlyCommon.getPeriodObj())).then(function() {});
        }
        else {
            return $.when($.get(countlyGlobal.path + '/mymetric/templates/mymetric.html', function(src) {
                self.template = Handlebars.compile(src);
            }), countlyMetric.init(countlyCommon.getPeriodObj())).then(function() {});
        }
    },
    pageScript: function() {
        var self = this;
        app.localize();
    },
    drawGraph: function() {
        var md = countlyMetric.getData();
        var data = [];
        var periodArr = countlyCommon.getPeriodObj().currentPeriodArr;
        if (periodArr === undefined) {
            periodArr = [countlyCommon.getPeriodObj().activePeriod];
        }
        for(var j = 0; j < periodArr.length; j++) {
            var found = false;
            for (var i = 0; i < md.length; i++) {
                if (moment(periodArr[j], 'YYYY.M.DD').format('YYYY-MM-DD') === moment(md[i].myMetric).format('YYYY-MM-DD')) {
                    found = true;
                    data.push([j + 1, md[i].myMetricCount]);
                }
            }
            if (!found) {
                data.push([j + 1, 0]);
            }
        }
        countlyCommon.drawTimeGraph([{
            data: data,
            "color":"#4DAAEC",
            "mode":"ghost"
        }], "#chartContainer");
    },
    refresh: function() {
        var self = this;
        $.when(self.beforeRender()).then(function() {
            if (app.activeView !== self) {
                return false;
            }
            self.renderCommon(true);
        });
    },
    renderCommon: function(isRefresh) {
        var self = this;
        self.templateData = {
            'page-title': jQuery.i18n.map['mymetric.title'],
            'table-helper': '',
            'bars': countlyMetric.getBars()
        }
        if (!isRefresh) {
            $(self.el).html(self.template(self.templateData));
            if (typeof addDrill !== "undefined") {
                $(".widget-header .left .title").first().after(addDrill("up.dnst"));
            }
            self.drawGraph();   
            self.pageScript();
            
            self.dtable = $('#mymetricDataTableOne').dataTable($.extend({}, $.fn.dataTable.defaults, {
                "aaData": countlyMetric.getData(),
                "aoColumns": [
                    { 
                        "mData": function(row, type) {
                            return moment(row.myMetric).format('DD MMM YYYY');
                        },
                        "sTitle": jQuery.i18n.map['mymetric.table-date']
                    },
                    {
                        "mData": "myMetricCount",
                        "sTitle": jQuery.i18n.map['mymetric.table-count']
                    }
                ]
            }));
            self.dtable.fnSort([ [1, 'desc'] ]);

            $("#mymetricDataTableOne").stickyTableHeaders();
        } else {
            self.drawGraph();
            CountlyHelpers.refreshTable(self.dtable, countlyMetric.getData());
        }
    }
});

app.myMetricView = new mymetricView();

app.route("/analytics/mymetric", 'mymetric', function() {
    this.renderWhenReady(this.myMetricView);
});

$(document).ready(function() {
    app.addSubMenu("analytics", {code: "analytics-mymetric", url: "#/analytics/mymetric", text: "My Metric", priority: 45});
});
