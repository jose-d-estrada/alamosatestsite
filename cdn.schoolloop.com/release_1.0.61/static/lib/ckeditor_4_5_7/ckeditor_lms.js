/*
 *
 *  * Copyright (c) 2004-2018, School Loop, Inc. All Rights Reserved.
 *
 */

/*global CKEDITOR, sl */

CKEDITOR.on('dialogDefinition', function (ev) {
    // Take the dialog name and its definition from the event data.
    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;
    if (dialogName == 'link') {
        dialogDefinition.removeContents('advanced');
    }
});

//More Button [removed May 5th... restored for LMS]
//
CKEDITOR.on('instanceReady', function (e) {
    var externalMore = e.editor.config.toolbarMoreToolsToolbar;
    if (externalMore != null) {
        sl.log("toolbarExternalMoreButton",externalMore);
        var editor = e.editor;
        var i, moveToolbarId, moveToolbar;
        jQuery("." + externalMore).first().empty()
        for (i = 1; i < editor.toolbox.toolbars.length; i++){
            moveToolbarId = editor.toolbox.toolbars[i].id;
            moveToolbar = CKEDITOR.document.getById(moveToolbarId);
            jQuery("." + externalMore).first().append(moveToolbar.$);

        }
    }

    var canCollapse = e.editor.config.toolbarCanCollapse;
    if (canCollapse) {
        var switchVisibilityAfter1stRow = function (toolbox, show) {
            var inFirstRow = true;
            var elements = toolbox.getChildren();
            var elementsCount = elements.count();
            var elementIndex = 0;
            var element = elements.getItem(elementIndex);
            for (; elementIndex < elementsCount; element = elements.getItem(++elementIndex)) {
                inFirstRow = (elementIndex == 0)
                if (!inFirstRow) {
                    if (show) {
                        element.show();
                    } else {
                        element.hide();
                    }
                }
            }
        }
        var editor = e.editor;
        var collapser = (function () {
            try {
                var firstToolbarId = editor.toolbox.toolbars[0].id;
                var firstToolbar = CKEDITOR.document.getById(firstToolbarId);
                var toolbox = firstToolbar.getParent();
                var collapser = toolbox.getNext();
                return collapser;
            }
            catch (e) {
            }
        })();

        editor.addCommand('toolbarCollapse',
            {
                exec: function (editor) {
                    if (collapser == null) return;
                    var toolbox = collapser.getPrevious();
                    var collapsed = toolbox.hasClass('iterate_tbx_hidden');//!toolbox.isVisible();

                    if (!collapsed) {
                        switchVisibilityAfter1stRow(toolbox, false);    // toolbox.hide();
                        toolbox.addClass('iterate_tbx_hidden');
                        collapser.addClass('cke_toolbox_collapser_min');
                        collapser.setAttribute('title', "Show more tools");
                    }
                    else {
                        switchVisibilityAfter1stRow(toolbox, true);    // toolbox.show();
                        toolbox.removeClass('iterate_tbx_hidden');

                        collapser.removeClass('cke_toolbox_collapser_min');
                        collapser.setAttribute('title', "Show fewer tools");
                    }
                    collapser.getFirst().setText(collapsed ?
                        'less \u25B2' :      // BLACK UP-POINTING TRIANGLE
                        'more \u25BC'); // BLACK LEFT-POINTING TRIANGLE
                }
            })

//Initial setup of collapser
        if (collapser != null) {
            sl.log("collapser != null", collapser)
            var toolbox = collapser.getPrevious();
            switchVisibilityAfter1stRow(toolbox, false);
            toolbox.addClass('iterate_tbx_hidden');
            toolbox.show();
            collapser.show();
            collapser.addClass('cke_toolbox_collapser_min');
            collapser.setAttribute('title', "Show more tools");
            collapser.getFirst().setText('more \u25BC');
        }
    }
});
