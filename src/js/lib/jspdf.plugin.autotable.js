/**
 * jsPDF AutoTable plugin
 * Copyright (c) 2014 Simon Bengtsson, https://github.com/someatoms/jsPDF-AutoTable
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
(function (API) {
    'use strict';

    var doc, cellPos, pageCount = 1;

    var options = {
        padding: 5,
        fontSize: 10,
        lineHeight: 20,
        headerLineHeight : 40,
        renderCell: function (x, y, w, h, txt, fillColor, options) {
            txt = txt || '';
            doc.setFillColor.apply(this, fillColor);
            doc.rect(x, y, w, h, 'F');
            doc.text('' + txt, x + options.padding, y + options.lineHeight/2 + doc.internal.getLineHeight()/2 - 2.5);
        },
        margins: { horizontal: 40, top: 50, bottom: 40, firstPageTop:40 },
        extendWidth: true
    };

    /**
     * Create a table from a set of rows and columns.
     *
     * Default options:
     *
     * <pre>
     var options = {
        padding: 3,
        fontSize: 12,
        lineHeight: 20,
        renderCell: function (x, y, w, h, txt, fillColor, options) {
            doc.setFillColor.apply(this, fillColor);
            doc.rect(x, y, w, h, 'F');
            doc.text(txt, x + options.padding, y + doc.internal.getLineHeight());
        },
        pageMargins: { horizontal: 40, top: 50, bottom: 40 },
        extendWidth: true
     };
     * </pre>
     *
     * @param {Object[]|String[]} columns Either as an array of objects or array of strings
     * @param {Object[][]|String[][]} data Either as an array of objects or array of strings
     * @param {Object} [options={}] Options that will override the default ones (above)
     *
     * @param {Object} [options.autoWidth=true] If table should span entire page width (otherwise resorts to min-width)
     */
    API.autoTable = function (columns, data, options) {
        doc = this;
        initData({columns: columns, data: data});
        initOptions(options || {});

        var columnWidths = calculateColumnWidths(data, columns);
        printHeader(columns, columnWidths);
        printRows(columns, data, columnWidths);

        return this;
    };

    function initData(params) {
        // Transform from String[] to Object[]
        if (typeof params.columns[0] === 'string') {
            params.data.forEach(function (row, i) {
                var obj = {};
                for (var j = 0; j < row.length; j++) {
                    obj[j] = params.data[i][j];
                }
                params.data[i] = obj;
            });
            params.columns.forEach(function (title, i) {
                params.columns[i] = {title: title, key: i};
            });
        }
    }

    function initOptions(raw) {
        Object.keys(raw).forEach(function (key) {
            options[key] = raw[key];
        });
        doc.setFontSize(options.fontSize);
        cellPos = { x: options.margins.horizontal, y: options.margins.firstPageTop };
    }

    function calculateColumnWidths(rows, columns) {
        var widths = {};

        // Min widths
        columns.forEach(function (header) {
            var widest = getStringWidth(header.title);
            var n = header.title.search("\n");
            if(n!=-1){
                var splittedArray = header.title.split("\n");
                widest = -2;
                splittedArray.forEach(function (line){
                    var newLength = getStringWidth(line);
                    if(newLength > widest){
                        widest = newLength;
                    }
                });
            }      
             
            rows.forEach(function (row) {
                var w = getStringWidth(row[header.key]);
                if (w > widest) {
                    widest = w;
                }
            });
            widths[header.key] = widest;
        });

        // Fill page horizontally
        if (options.extendWidth) {
            var keys = Object.keys(widths),
                sum = 0;

            keys.forEach(function (key) {
                return sum += widths[key];
            });

            var spaceLeft = doc.internal.pageSize.width - sum - options.padding * 2 * columns.length - options.margins.horizontal * 2;
            keys.forEach(function (key) {
                widths[key] += spaceLeft / keys.length;
            });
        }

        return widths;
    }

    function printHeader(headers, columnWidths) {
        if (!headers) return; //
        doc.setFontStyle('bold');
        doc.setTextColor(255, 255, 255);
        headers.forEach(function (header) {
            var width = columnWidths[header.key] + options.padding * 2;
            var color = [52, 73, 94]; // asphalt
            options.renderCell(cellPos.x, cellPos.y, width, options.headerLineHeight + 5, header.title, color, options);
            cellPos.x = cellPos.x + columnWidths[header.key] + options.padding * 2;
        });
        doc.setTextColor(70, 70, 70);
        doc.setFontStyle('normal');

        cellPos.y += options.headerLineHeight;
        cellPos.x = options.margins.horizontal;
    }

    function printRows(headers, rows, columnWidths) {
        var odd = false;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];

            headers.forEach(function (header) {
                var color = (odd ? 245 : 255);
                var width = columnWidths[header.key] + options.padding * 2;
                options.renderCell(cellPos.x, cellPos.y, width, options.lineHeight, row[header.key], [color], options);
                cellPos.x = cellPos.x + columnWidths[header.key] + options.padding * 2;
            });
            odd = !odd;

            var newPage = (cellPos.y + options.margins.bottom + options.lineHeight * 2) >= doc.internal.pageSize.height;
            if (newPage) {
                doc.addPage();
                var yValue=options.margins.top;
                cellPos = {x: options.margins.horizontal, y:yValue };
                pageCount++;
                printHeader(headers, columnWidths);
            } else {
                cellPos.y += options.lineHeight;
                cellPos.x = options.margins.horizontal;
            }
        }
    }

    function getStringWidth(txt) {
        return doc.getStringUnitWidth(txt) * doc.internal.getFontSize();
    }

})(jsPDF.API);