/**
 * 统计web.js
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

(function () {
    'use strict';

    var echarts;
    var DATA;
    var echartsDispose;
    var $content = $('#content');

    require.config({
        paths: {
            echarts: '/static/echarts/'

        }

    });

    require([
        'echarts',
        'echarts/chart/pie'
    ], function (ec) {
        echarts = ec;

        $.ajax({
            url: '/api/log',
            success: function (res) {
                DATA = res;
                init();
            },
            dataType: 'json',
            type: 'GET',
            cache: true,
            error: function () {
                alert('加载失败～');
            }

        });
    });

    var init = function () {
        $('.demo-nav li').on('click', function () {
            var $this = $(this);
            var type = $this.data('type');
            var option = null;

            // 高亮导航
            $this.addClass('ui-tab-active').siblings().removeClass('ui-tab-active');

            // 销毁
            if (echartsDispose && 'function' === typeof echartsDispose.dispose) {
                echartsDispose.dispose();
                echartsDispose = null;
            }

            // 清空当前的
            $content.removeClass('empty').empty();

            if ('function' === typeof filter[type]) {
                option = filter[type]();
            }

            if (option === null) {
                $content.text('真空～').addClass('empty');
            }
            else {
                echartsDispose = echarts.init($('#content').get(0));
                echartsDispose.setOption(option);
            }
        }).eq(0).trigger('click');

        $content.addClass('ok');
    };

    var filter = {};

    /**
     * 浏览器别名
     * @type {Object}
     */
    filter.browser_alias = {};

    /**
     * 渲染配置
     * @param  {Object} config 配置
     * @return {Object}
     */
    filter.render = function (config) {
        var data = DATA[config.key];
        var res;
        var key;

        if (!data || $.isEmptyObject(data) || !$.isPlainObject(data)) {
            return null;
        }

        key = config.keyFilter(data);

        res = {
            title: {
                text: config.text,
                subtext: '只供参考',
                x: 'center'

            },
            tooltip: {
                trigger: 'item',
                formatter: '{a}:{b}<br/>数量:{c}<br>比例:{d}%'

            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: key

            },
            calculable: true,
            series: [
                {
                    name: config.name,
                    type: 'pie',
                    radius: '65%',
                    center: [
                        '50%',
                        '60%'
                    ],
                    data: []

                }
            ]

        };

        key.forEach(function (val) {
            res.series[0].data.push({
                name: val,
                value: config.valueFilter(val, data)

            });
        });

        return res;
    };

    /**
     * 系统
     */
    filter.os = function () {
        return filter.render({
            key: 'os',
            text: '博客访问者系统统计',
            name: '系统类型',
            keyFilter: function (data) {
                return Object.keys(data);
            },
            valueFilter: function (key, data) {
                return data[key].count;
            }

        });
    };

    /**
     * 浏览器
     */
    filter.browser = function () {
        return filter.render({
            key: 'browser',
            text: '博客访问者浏览器统计',
            name: '浏览器类型',
            keyFilter: function (data) {
                return Object.keys(data);
            },
            valueFilter: function (key, data) {
                return data[key].count;
            }

        });
    };

    /**
     * 机器人
     */
    filter.robot = function () {
        return filter.render({
            key: 'robot',
            text: '博客机器人访问记录',
            name: '机器人名',
            keyFilter: function (data) {
                return Object.keys(data);
            },
            valueFilter: function (key, data) {
                return data[key];
            }

        });
    };

    /**
     * http状态码
     */
    filter.status = function () {
        return filter.render({
            key: 'http_status',
            text: '博客被访问http状态码统计',
            name: 'http状态码',
            keyFilter: function (data) {
                return Object.keys(data);
            },
            valueFilter: function (key, data) {
                return data[key];
            }

        });
    };

    /**
     * 谷歌浏览器版本号
     */
    filter.chromever = function () {
        return filter.render({
            key: 'browser',
            text: '谷歌浏览器版本',
            name: '版本号',
            keyFilter: function (data) {
                return Object.keys(data.Chrome.version);
            },
            valueFilter: function (key, data) {
                return data.Chrome.version[key];
            }

        });
    };

    /**
     * IE浏览器版本号
     */
    filter.iever = function () {
        return filter.render({
            key: 'browser',
            text: 'IE浏览器版本',
            name: '版本号',
            keyFilter: function (data) {
                return Object.keys(data.IE.version);
            },
            valueFilter: function (key, data) {
                return data.IE.version[key];
            }

        });
    };
})();
