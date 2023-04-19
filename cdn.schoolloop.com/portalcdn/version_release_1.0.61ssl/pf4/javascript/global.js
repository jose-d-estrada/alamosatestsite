/*
 *
 *  * Copyright (c) 2004-2018, School Loop, Inc. All Rights Reserved.
 *
 */


var sl = new Object();
sl.slAjaxScope = null;
sl.slReturnURL = null;

sl.initSLAjax = function (ajaxScope, returnURL) {
    sl.slAjaxScope = ajaxScope;
    sl.slReturnURL = returnURL;
}

sl.getAjaxScope = function () {
    return sl.slAjaxScope;
}

sl.getReturnURL = function () {
    return sl.slReturnURL;
}

sl.supportsColorInput = function () {
    var i = document.createElement("input");
    i.setAttribute("type", "color");
    var result = i.type !== "text";
    return result;
}

sl.submit_event = function (event, form) {
    var target;
    if (form) {
        target = jQuery("#" + form);
    }
    else {
        target = jQuery("form:first");
    }
    jQuery("#event_override", target).val(event);
    target.submit();
    return false;
}

sl.endSession = function () {
    jQuery.ajax({
        type: "GET",
        url: "/portal/endSession"
    });
}

sl.setTimeoutURL = function (url) {
    sl.timeoutURL = url;
}

sl.getTimeoutURL = function () {
    if (sl.timeoutURL != null) {
        return sl.timeoutURL;
    }
    else {
        return "/portal/timeout";
    }
}

sl.addAjaxScope = function (variables) {
    variables['ajax_scope'] = sl.getAjaxScope();
};

sl.addAjaxScopeToURL = function (url) {
    var result = url;
    var ajaxScope = sl.getAjaxScope();
    if (ajaxScope == null) {
        result = url + "&legaxy_ajax=true";
    }
    else {
        result = url + "&ajax_scope=" + ajaxScope;
    }
    return result;
}

sl.findDataInParent = function (startElement, dataLabel) {
    var result = jQuery(startElement).data(dataLabel);
    if (result == null) {
        jQuery(startElement).parents().each(function (index) {
            result = jQuery(this).data(dataLabel);
            return (result == null);
        });
    }
    return result;
};

sl.findDataInParentWithMethod = function (startElement, dataLabel, method) {
    var result = jQuery(startElement).data(dataLabel);
    jQuery(startElement).parents().each(function (index) {
        result = jQuery(this).data(dataLabel);
        if (result != null && result[method] instanceof Function) {
            return (result == null);
        }
    });
    return result;
};

sl.findDataInChild = function (startElement, dataLabel) {
    var result = jQuery(startElement).data(dataLabel);
    if (result == null) {
        jQuery(startElement).find("div").each(function (index) {
            result = jQuery(this).data(dataLabel);
            return (result == null);
        });
    }
    return result;
};

sl.findDataInChildNotIncludingSelf = function (startElement, dataLabel) {
    var result;
    jQuery(startElement).find("div").each(function (index) {
        result = jQuery(this).data(dataLabel);
        return (result == null);
    });
    return result;
};

sl.refresh = function (refreshURL, refreshArea, variables, success) {
    if (variables == null) {
        variables = {};
    }
    if (refreshURL.indexOf("mod=") == -1) {
        variables["mod"] = refreshArea;
    }
    if (success == null) {
        success = function (data) {
            jQuery("#" + refreshArea).replaceWith(data);
        }
    }
    sl.addAjaxScope(variables);
    return jQuery.ajax({
        type: "GET",
        url: refreshURL,
        data: variables,
        success: success
    });
};

sl.postAndRefresh = function (postURL, variables, refreshURL, refreshArea) {
    sl.addAjaxScope(variables);
    jQuery.ajax({
        type: "POST",
        url: postURL,
        data: variables,
        success: function (data) {
            sl.refresh(refreshURL, refreshArea);
        }
    });
};

sl.getAndRefresh = function (getURL, variables, refreshURL, refreshArea) {
    sl.addAjaxScope(variables);
    jQuery.ajax({
        type: "GET",
        url: getURL,
        data: variables,
        success: function (data) {
            sl.refresh(refreshURL, refreshArea);
        }
    });
};

sl.ajaxSubmit = function (event, form, options) {
    var target;
    if (form) {
        target = jQuery("#" + form);
    }
    else {
        target = jQuery("form:first");
    }
    if (options == null) {
        options = {};
    }
    jQuery("#event_override", target).val(event);
    jQuery("#ajax_scope", target).val(sl.getAjaxScope());
    if ("ajaxSubmit" in jQuery(target)) {
        jQuery(target).ajaxSubmit(options);
    }
    else {
        var postData = jQuery(target).serializeArray();
        var formURL = jQuery(target).attr("action");
        options["url"] = formURL;
        options["type"] = "POST";
        options["data"] = postData;
        jQuery.ajax(options);
    }
    return target;
};

sl.asyncAjaxSubmit = function (event, form, options) {
    var target;
    var deferred = null;
    if (form) {
        target = jQuery("#" + form);
    }
    else {
        target = jQuery("form:first");
    }
    if (options == null) {
        options = {};
    }
    jQuery("#event_override", target).val(event);
    jQuery("#ajax_scope", sl.getAjaxScope());
    if ("ajaxSubmit" in jQuery(target)) {
        deferred = jQuery(target).ajaxSubmit(options);
    }
    else {
        var postData = jQuery(target).serializeArray();
        var formURL = jQuery(target).attr("action");
        options["url"] = formURL;
        options["type"] = "POST";
        options["data"] = postData;
        deferred = jQuery.ajax(options);
    }
    return deferred;
};

sl.log = function (m1, m2, m3, m4, m5, m6) {
    if (!window.console) {
        console = {
            log: function () {
            }
        };
    }
    console.log(m1, ((m2) ? m2 : ""), ((m3) ? m3 : ""), ((m4) ? m4 : ""), ((m5) ? m5 : ""), ((m6) ? m6 : ""));
}


sl.initCKEditor = function (options) {
    var defaults = {
        toolbar: "GenericContent",
        width: "100%",
        height: "100px",
        toolbarCanCollapse: true

    };
    var settings = jQuery.extend(defaults, options);
    var id = settings.id;
    var config = settings.config;
    var styleSheet = settings.styleSheet;
    var toolbar = settings.toolbar;
    var width = settings.width;
    var height = settings.height;
    var toolbarCanCollapse = settings.toolbarCanCollapse;

    var dragOptions = {
        dropAreaID: id,
        uploadFileURL: "/locker2/uploadImageFile?d=x"
    };
    new UploadDragFile(dragOptions);

    var autoheight = parseInt(height, 10);
    var options = {
        customConfig: config,
        stylesCombo_stylesSet: styleSheet,
        toolbar: toolbar,
        startupFocus: false,
        height: height,
        autoGrow_minHeight: autoheight,
        width: width,
        toolbarCanCollapse: toolbarCanCollapse,
        toolbarStartupExpanded: false
    }

    jQuery("#" + id).ckeditor(options);

}

sl.alert = function (message, callback) {
    vex.dialog.alert({
        contentClassName: 'vex-alert',
        message: message,
        buttons: [
            jQuery.extend({}, vex.dialog.buttons.YES, {
                text: 'OK',
                click: function ($vexContent) {
                    vex.close($vexContent.data().vex.id);
                    if (callback != null) {
                        callback();
                    }
                }
            })
        ]
    });
}

sl.copyToClipboard = function (event, text) {
      // create temp input to select and copy from
      var dummy = document.createElement("input");
      document.body.appendChild(dummy);
      dummy.setAttribute("id", "dummy_id");
      document.getElementById("dummy_id").value=text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    event.preventDefault();
    jQuery(event.target).focus();
}

sl.confirmClick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    var button = jQuery(event.currentTarget).data("confirm_button_label");
    var message = jQuery(event.currentTarget).data("confirm_message");
    var url = jQuery(event.currentTarget).attr("href");
    sl.confirm(message, button, jQuery.proxy(sl.confirmClickHandler,this,url));
}

sl.confirmClickHandler = function(url) {
    window.location = url;
}

//SAMPLE CONFIRM
//var confirmMessage = "Delete " + jQuery.trim(type) + "?";
//var confirmButton = 'Delete';
//var confirmCallback = jQuery.proxy(this.doDeleteDocument,this,button);
//sl.confirm(confirmMessage,confirmButton,confirmCallback)

sl.confirm = function (message, button, callback) {
    vex.dialog.confirm({
        contentClassName: 'vex-alert',
        message: message,
        buttons: [
            jQuery.extend({}, vex.dialog.buttons.YES, {
                text: button
            }),
            jQuery.extend({}, vex.dialog.buttons.NO, {
                text: 'Cancel'
            })
        ],
        callback: function (data) {
            return (data === false) ? false : callback();
        }
    });
};

sl.confirmWithSecondButton = function (message, button, secondButton, callbackFn) {
    vex.dialog.open({
        message: message,
        buttons: [
            jQuery.extend({}, vex.dialog.buttons.YES, {
                text: button,
                click: function($vexContent, event) {
                    $vexContent.data().vex.value = 'first';
                    return vex.close($vexContent.data().vex.id);
                }
            }),
            jQuery.extend({}, vex.dialog.buttons.YES, {
                text: secondButton,
                click: function($vexContent, event) {
                    $vexContent.data().vex.value = 'second';
                    return vex.close($vexContent.data().vex.id);
                }
            }),
            jQuery.extend({}, vex.dialog.buttons.NO, {
                text: 'Cancel'
            })
        ],
        callback: function (data) {
            if (data === false) {
                return;
            }

            callbackFn(data);
        }
    });
}

sl.combineInputs = function (targetInput, source1Input, source2Input) {
    var source1Value = jQuery(source1Input).attr('value');
    var source2Value = jQuery(source2Input).attr('value');
    jQuery(targetInput).attr('value', source1Value + " " + source2Value);
}

sl.showHidden = function (el, time, focus) { //time is added to wait for ckeditor load when relevant
    if (!(time > 0)) {
        time = 0
    }
    window.setTimeout(function () {
        var off = el.offset();
        var t = off.top;
        var h = el.height();
        var docH = jQuery(window).height();
        var currentScroll = jQuery(window).scrollTop()
        var bottomHidden = (t + h) - (docH + currentScroll);
        if (bottomHidden > 0) {
            jQuery('html, body').animate({scrollTop: currentScroll + bottomHidden + 10}, 1000);
        }
        if (focus) {
            el.find("input:first").focus().select();
        }
    }, time, 'easeInOutCubic');
};


sl.confirmAction = function (messageText) {
    var confirmDeferred = new jQuery.Deferred();
    var message = messageText || "Are you sure you want to do this action?"
    vex.dialog.confirm({
        message: message,
        callback: jQuery.proxy(sl.confirmDeferredCallback, sl, confirmDeferred)
    });
    return confirmDeferred;
};

sl.confirmDeferredCallback = function (confirmDeferred, confirmedValue) {
    if (confirmedValue) {
        confirmDeferred.resolve();
    } else {
        confirmDeferred.reject();
    }
};

sl.clonedElements = {};
sl.cloneFromId = function (id) {
    var element = sl.clonedElements[id];
    if (element == null) {
        element = jQuery("#" + id);
        element.attr("id", "");
        CalendarView.clonedElements[id] = element;
    }
    return element.clone();
}


/*
 Used in cases where 2 classes are being loaded in different modules or page requests but need to find each other.
 They can use a common deferred object to know when they are both loaded
 */
sl.deferredObjects = {};
sl.getDeferred = function (name) {
    var result = sl.deferredObjects[name];
    if (result == null) {
        sl.deferredObjects[name] = jQuery.Deferred();
        result = sl.deferredObjects[name];
    }
    return result;
}

sl.getAndClearDeferred = function (name) {
    var result = sl.deferredObjects[name];
    delete sl.deferredObjects[name];
    return result;
}

sl.clearDeferred = function (name) {
    delete sl.deferredObjects[name];
}


sl.confirmSave = function (exitMessage) {
    var confirmDeferred = new jQuery.Deferred();
    if (exitMessage == "publish") {
        sl.publishConfirmDialog.dialog("open")
        jQuery(".jsPublishContBtn").click(function () {
            sl.publishConfirmDialog.dialog("close");
            confirmDeferred.resolve('PublishContinue')
        });
        jQuery(".jsNoActionBtn").click(function () {
            sl.publishConfirmDialog.dialog("close");
            confirmDeferred.resolve('NoAction');
        })
    }
    else {
        sl.saveConfirmDialog.dialog("open")
        jQuery(".jsSaveContBtn").click(function () {
            sl.saveConfirmDialog.dialog("close");
            confirmDeferred.resolve('SaveContinue')
        })
        jQuery(".jsNoActionBtn").click(function () {
            sl.saveConfirmDialog.dialog("close");
            confirmDeferred.resolve('NoAction');
        })
    }
    return confirmDeferred.promise()
}

sl.startLongAction = function (holder, button) {
    if (holder.longActionMonitor == null) {
        holder.longActionMonitor = new LongActionMonitor(holder, "/pf4/support/longActionMonitor", 100, 500, button);
    }
}

sl.stopLongAction = function (holder) {
    holder.longActionMonitor.stop();
}

sl.longActionStatusOpen = function () {
    sl.longActionStatusDialog.dialog("open");
}

sl.longActionStatusClose = function () {
    sl.longActionStatusDialog.dialog("close");
}

sl.resizeIframe = function (obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

sl.registerCancelHandler = function (handler, cancelThis) {
    this.cancelHandler = handler;
    this.cancelThis = cancelThis;
}

sl.cancelHandler = function (event) {
    if (this.cancelHandler != null) {
        this.cancelHandler.call(this.cancelThis);
    }
}

sl.verifyFileType = function (uploadFile) {
    sl.log("sl.verifyFileType uploadFile", uploadFile)
    var result = true;
    var rejectFileTypes = /\/(bat|com|exe|vbs)$/i;
    if (!(uploadFile instanceof File)) {
        result = false;
    }
    else if (rejectFileTypes.test(uploadFile['type']) || (/\.(bat|com|exe|vbs)$/i).test(uploadFile.name) || ( uploadFile.name.charAt(0) == ".") || ( uploadFile.name.charAt(0) == "_")) {
        sl.alert("Oops! Files that end in .bat, .com, .exe, .vbs or start with a period “.” or an underscore “_” are not allowed.  Please upload another file.")
        result = false;
    }
    else if (uploadFile.name.indexOf(".") == -1) {
        sl.alert("Oops! This file needs an extension after its name (like .doc).  <a href='https://en.wikipedia.org/wiki/Filename_extension' target='blank'>Learn more</a>.")
        result = false;
    }
    else if (uploadFile.size > 500000000) {         //upload maximum
        sl.alert("Oops! This file is too large (over 500MB).  Please upload a smaller file.")
        result = false;
    }
    ;

    return result;
};


sl.startLoadingScreen = function () {

    if (jQuery(".modal_load").length < 1) {
        jQuery('body').append("<div class='modal_load' />")
    }

    jQuery('body').addClass("loading");
}

sl.endLoadingScreen = function () {
    jQuery(".modal_load").remove()
    jQuery('body').removeClass("loading");
};

sl.iframeHeightAdjust = function (id) {
    sl.log("iframeHeightAdjust", id)
    var iFrameElement = document.getElementById(id);
    iFrameElement.height = "";
    iFrameElement.height = iFrameElement.contentWindow.document.body.scrollHeight + "px";
};

sl.setupTooltips = function (selector) {
    //slTooltip tooltips have either an attribute hover_url or data-message
    //use data-additional-classes for additional classes for bubble
    var selector = selector || "body";

    var tooltips = jQuery(selector).find('.slTooltip');
    for (var i = 0; i < tooltips.length; i++) {
        var element = jQuery(tooltips[i]);
        var url = element.attr("hover_url");
        var content = null;
        var additionalClasses = element.data("additional-classes") || "";
        var event = element.data("override-tooltip-event") || "mouseenter";
        if (url != null) {
            content = {
                text: 'Loading...', // The text to use whilst the AJAX request is loading
                ajax: {
                    url: url // URL to the local file
                }
            }
        } else {
            content = {
                text: function (event) {
                    return jQuery(event.target).data("message");
                }
            }
        }
        sl.log("url", url, "additional-classes", additionalClasses);

        element.qtip({ // Grab some elements to apply the tooltip to  calendar-tooltip
            style: {
                classes: "qtip-shadow qtip-rounded sl-qtip " + additionalClasses
            },
            show: {
                delay: 500,
                event: event
            },
            hide: {
                fixed: true,
                delay: 500
            },
            content: content,
            position: {
                viewport: jQuery(window)
            }
        })
    }
    ;
};

sl.setupAlertHelp = function () {
    return; //Disabling as per Jikko #7240


    if (selector == null) {
        var selector = "body"
    }
    jQuery(selector).find(".alert_help").click(function (event) {
        event.preventDefault();
    })
    jQuery(selector).find(".alert_help").colorbox({
        iframe: true,
        width: "800px",
        opacity: ".5",
        height: function () {
            return jQuery(this).data('height') + "px"
        },
        title: function () {
            return '<p style="text-align:center; font-weight:800; width:100%; border-top:1px solid #ccc">'
                + '<a style="vertical-align:bottom; height:30px" href="'
                + jQuery(this).attr("helppage")
                + '" target="_blank">'
                + jQuery(this).attr('linktext')
                + '</a></p>';
        }
    });
};

sl.setupShowMore = function (selector) {
    //looks for any element with class "jsShowMoreContainer" which should contain a button with  class "jsShowMoreButton"
    //and these relevant data attributes
    // e.g.     <div class="jsShowMoreContainer" data-short-height="200">
    //              ....
    //              <div class="jsShowMoreButton" data-more-text="more" data-less-text="less">more</div>
    //          </div>
    var selector = selector || "body";
    var showMores = jQuery(selector).find('.jsShowMoreContainer');
    for (var i = 0; i < showMores.length; i++) {
        var element = jQuery(showMores[i]);
        var showMorebutton = element.find(".jsShowMoreButton")
        var visibleHeight = element[0].clientHeight;
        var newShortHeight = visibleHeight;
        var realHeight = element[0].scrollHeight;
        var origShortHeight = element.data("short-height")

        if (realHeight > visibleHeight) {
            if (element.html().indexOf("<img") > 0) {   // check if img is in html string and change newShortHeight
                var imgElement = element.find("img:first")
                var offsetTop = element.find("img:first").position().top
                newShortHeight = imgElement.height() + offsetTop;
                if (newShortHeight < realHeight && offsetTop < visibleHeight) {
                    element.attr("data-short-height", newShortHeight).css("max-height", "inherit");
                }
            }

            if (newShortHeight < realHeight) { //add show more button and adjust short height if required
                newShortHeight += 60;
                newShortHeight = (newShortHeight < origShortHeight) ? origShortHeight : newShortHeight;
                element.height(newShortHeight);
                element.attr("data-short-height", newShortHeight);
                showMorebutton.show().unbind("click").click(sl.showMoreHandler);
            }
        } else {
            showMorebutton.hide();
        }
    }
};

sl.showMoreHandler = function (event) {
    var button = jQuery(event.target);
    var container = button.closest(".jsShowMoreContainer");
    var fullyDisplayed = container.hasClass("jsMoreDisplayed")
    var buttonText = (fullyDisplayed) ? button.data("more-text") : button.data("less-text");
    if (fullyDisplayed) {
        container.animate({height: container.attr("data-short-height")})
    } else {
        var realHeight = container[0].scrollHeight - 1;
        container.animate({height: realHeight})
    }
    button.text(buttonText);
    container.toggleClass("jsMoreDisplayed")
};

sl.setupAccordions = function () {
    new AccordionDropdowns();
};

sl.setupElementQueries = function () {
    new ElementQueries();
};

sl.refreshElementQueries = function () {
    if (typeof ElementQueries != "undefined") {
        ElementQueries.RefreshElementQueries();
    }
};

sl.setupDialogButtons = function () {
    new DialogButtons();
};

sl.getElementFromString = function (elementId, string) {
    var element = jQuery(".display-none:first").html(string).find("#" + elementId);
    return element;
};

sl.handleCheckAll = function (event) {
    var checked = jQuery(event.target).is(":checked");
    var dataValue = jQuery(event.target).data("checkbox_group");
    var matchString = "[data-checkbox_group='" + dataValue + "']";
    jQuery(document).find(matchString).each(function (i, element) {
        var originalValue = jQuery(element).is(":checked");
        if (checked) {
            jQuery(element).prop('checked', true);
            if (originalValue == false) {
                jQuery(element).change();
            }
        }
        else {
            jQuery(element).prop('checked', false);
            if (originalValue) {
                jQuery(element).change();
            }
        }
    });
}

sl.messageBox = null;
sl.messageTimer = null;
sl.successMessage = function (message) {
    sl.showMessageBox(message, "cms2-success-pop-down");
}

sl.errorMessage = function (message) {
    sl.showMessageBox(message, "cms2-error-pop-down");
}

sl.warningMessage = function (message) {
    sl.showMessageBox(message, "cms2-warning-pop-down");
}

sl.showMessageBox = function (message, messageCssClass) {
    if (sl.messageBox != null) {
        sl.removeMessageBox();
    }
    sl.messageBox = jQuery("<div />").addClass(messageCssClass);
    sl.messageBox.text(message)
        .on("click", sl.removeMessageBox)
    jQuery("body").append(sl.messageBox);
    sl.messageTimer = setTimeout(sl.removeMessageBox, 5000);
}

sl.removeMessageBox = function () {
    sl.messageBox.remove();
    sl.messageBox = null;
    clearTimeout(sl.messageTimer);
    sl.messageTimer = null;
}

// for svgs
//e.g.
//<div class="jsFillWithSvg" data-svg-image-url="des.imageUrl" data-svg-color-class="sl-cms2-badge--svg-color" data-svg-id="svgId_des.ID"></div>


sl.fillWithData = function (holder, data) {
    //sl.log("fillWithData", holder, data);
    var $svg = jQuery(data).find('svg');

    // Remove any invalid XML tags as per http://validator.w3.org
    $svg = $svg.removeAttr('xmlns:a');
    // Replace image with new SVG
    var imgClass = holder.data('svg-color-class');
    var imgID = holder.data('svg-id');

    // Add replaced image's ID to the new SVG
    if (typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
    }


    // Add replaced image's classes to the new SVG
    if (typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass + ' replaced-svg');
    }

    holder.removeClass("jsFillWithSvg").empty().append($svg);
};


sl.fillSvgHolders = function (selector) {
    sl.log("fillSvgHolders");
    var elements = jQuery('.jsFillWithSvg');
    var i;
    sl.log("fillThese", elements)
    for (i = 0; i < elements.length; i++) {
        var holder = jQuery(elements[i]);
        var imgURL = holder.data('svg-image-url');
        if (sl.isSSLPage() && (imgURL != null) && (imgURL.startsWith("http:"))) {
            imgURL = imgURL.replace("http:", "https:");
            sl.log("fillSVGHolders new imgURL:" + imgURL);
        }
        jQuery.ajax({
            url: imgURL,
            success: jQuery.proxy(sl.fillWithData, sl, holder)
        });
    }
};

sl.isSSLPage = function () {
    sl.log("window.location.protocol", window.location.protocol)
    var locationString = window.location.protocol
    var result = (window.location.protocol != null) && (locationString.startsWith("https") );
    return result;
};


sl.initCMS2Page = function () {
    sl.refreshElementQueries();
    sl.fillSvgHolders();
    plyr.setup(".jsPlyrVideo");
};

sl.initVideoForDynamicContentIfReqd  = function (container) {
    if (container.find(".jsPlyrVideo").not(".plyr--setup").length > 0 ) {
        container.find(".jsPlyrVideo").not(".plyr--setup").addClass("jsDynamicVideoForInit")
        plyr.setup(".jsDynamicVideoForInit");
        container.find(".jsDynamicVideoForInit").removeClass("jsDynamicVideoForInit");
    }
}

sl.windowResizeTimeout = false;      //resizing now handled in base_player_handler
sl.windowResizeDelay = 250;
sl.windowResizeDebouncer = function(){
    clearTimeout(sl.windowResizeTimeout);
    sl.windowResizeTimeout = setTimeout(jQuery.proxy(sl.windowResizeFunctions, sl), sl.windowResizeDelay);
};

sl.windowResizeFunctions = function () {
    sl.log("resize fired ")
    // sl.reClampBriefNews();
};

sl.dragOverSetup = function () {
    window.addEventListener("dragover", function (e) {
        e = e || event;
        e.preventDefault();
    }, false);
    window.addEventListener("drop", function (e) {
        e = e || event;
        e.preventDefault();
    }, false);

};

sl.startWaitingScreen = function (element) {
    var screen = jQuery("<div />")
        .addClass("sl-waiting-screen")
        .css({
            position: "absolute",
            top: 0,
        })
    element
        .css("position", "relative")
        .append(screen)
};

sl.stopWaitingScreen = function () {
        jQuery(".sl-waiting-screen").remove();
};

sl.textClamper = function (containers, itemClass, additionalItemClass) { // put into classvars in case we want to access from windowResizeFunctions
    jQuery.each(containers, function (key, value) {
        sl.log("key, value", key, value, itemClass);

        var blurb = jQuery(value).find("." + itemClass);
        blurb.find("img, video").remove();
        var button = jQuery(value).find("." + additionalItemClass);
        var buttonClone = button.clone().css({
            float: "none",
            position: "inherit"
        });
        button.hide();
        var blurbHeight = blurb.height();
        var blurbText = blurb.text();
        blurb.empty().append("<p>" + blurbText + "</p>").find("p").append(buttonClone);
        sl.log("heights",blurb.find("p").height(), blurbHeight + 2 )
        if (blurbHeight == 0) {
            sl.log("no height of blurb")
        } else {
            while (blurb.find("p").height() > blurbHeight + 2) { // Check if the paragraph's height is taller than the container's height. If it is:
                blurbText = blurbText.replace(/\W*\s(\S)*$/, "...");
                blurb.empty().append("<p>" + blurbText + "</p>").find("p").append(buttonClone)
                sl.log("reducing heights",blurb.find("p").height(), blurbHeight + 2 )
            }
        }

        buttonClone.remove();
        blurb.find("p").append(button)
        button.show();
    });
}

sl.toggleOpenClose = function(event) {
    var toggleID = jQuery(event.target).data("toggle_id");
    if ( toggleID != null )
    {
        if ( jQuery("#" + toggleID).is(":visible") ) {
            jQuery("#" + toggleID).hide();
        }
        else {
            jQuery("#" + toggleID).show();
        }
    }
}



/* Document Ready */
jQuery(document).ready(function () {

    // jQuery(window).resize(jQuery.proxy(sl.windowResizeDebouncer, sl)) // now handled in base_player_handler


    sl.log("global on ready")
    if (typeof AccordionDropdowns != "undefined") {
        sl.setupAccordions();
    }

    if (typeof ElementQueries != "undefined") {
        sl.setupElementQueries();
    }
    if (typeof DialogButtons != "undefined") {
        sl.setupDialogButtons();
    }

    if ("vex" in window) {
        vex.defaultOptions.className = 'vex-theme-os';
    }

    jQuery(document).on("click", ".jsConfirmClick", sl.confirmClick);

    jQuery(document).on("click",".jsToggleOpenClose", sl.toggleOpenClose);

    try {
        jQuery(document).on("change", ".jsCheckAll", sl.handleCheckAll);
    }
    catch (err) {
        // ckeditor plugin is using an old version of javascript which does not support "on"
    }

    sl.deleteDialog = jQuery("#dialog-confirm").dialog({
        resizable: false,
        height: 240,
        modal: true,
        autoOpen: false,
        buttons: [
            {
                text: "Cancel",
                id: "jsCancel",
                click: function () {
                }
            },
            {
                text: "Delete",
                id: "jsConfirm",
                click: function () {
                }
            }
        ]
    });


    sl.saveConfirmDialog = jQuery("#save-continue-dialog").dialog({
        resizable: false,
        height: 240,
        modal: true,
        autoOpen: false,
        open: function () {
            jQuery('#jsSaveContBtn').focus();
        }
    });

    sl.publishConfirmDialog = jQuery("#publish-continue-dialog").dialog({
        resizable: false,
        height: 240,
        modal: true,
        autoOpen: false,
        open: function () {
            jQuery('#jsPublishContBtn').focus();
        }
    });


    sl.longActionStatusDialog = jQuery("#long_action_status").dialog({
        resizable: false,
        height: 200,
        width: 350,
        modal: true,
        autoOpen: false,
        dialogClass: "jsRemoveTitle"
    });


//********************* POLYFILLERS *********************

    //add startsWith to strings
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (search, pos) {
            return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
        };
    }


    //********************* this polyfiller allows the Object.keys in ie8 [site/block_document/javascript/edit_area.js]
    if (!Object.keys) {
        Object.keys = (function () {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }

    //add tooltips

    //********************* used to allow ie8 to use indexOf used in determining layers of month events  [site/cal/javascript/calendar_view.js]
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) {
                    return i;
                }
            }
            return -1;
        }
    }

    //********************* used to allow selection by data attribute dynamically added to elements [site/cal/javascript/calendar_view.js]
    jQuery.fn.filterByData = function (prop, val) {
        return this.filter(
            function () {
                return jQuery(this).data(prop) == val;
            }
        );
    };

    /* initial functions to fire on doc ready */
    sl.dragOverSetup();
    sl.fillSvgHolders();

    //register blur event handler
    jQuery('.scaled-num').blur(function(e) {
        if (validateScaledNum(this.value)) {
            jQuery(this).addClass('email_form_error');
        } else {
            jQuery(this).removeClass('email_form_error');
        }
    })

    jQuery('.scaled-num').each(function() {
        if (validateScaledNum(this.value)) {
            jQuery(this).addClass('email_form_error');
        }
    })

    function validateScaledNum(value) {
        var result = false;
        var regex = /^\d+(\.\d{1,2})?$/;
        if (!regex.test(value) || value > 5 || value < 0) {
            result = true;
        }
        return result;
    }
});

/* Window Ready */
/*After images are loaded */

if (jQuery.fn.on !== undefined) {    //because looplink dialog uses old jquery, pre .on
    jQuery(window).on("load", function () {
        jQuery("#goog-gt-tt .logo img").attr("alt", "Google Translate pixel"); // only used for stopping a false error in WAVE accessibility software
        sl.setupShowMore();
        window.loaded = true;
    })
}


/*  *** Horizontal scroll handler for fixedHeader *** */
jQuery("body").ready(function () {

    if (jQuery(".fixedHeader").length > 0) {
        var leftInit = jQuery(".fixedHeader").offset().left;
        jQuery(window).scroll(function (event) {
            var x = 0 - jQuery(this).scrollLeft();
            jQuery(".fixedHeader")
                .offset({
                    left: x + leftInit
                })
        });
    }
})

sl.keyboard = {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38,
    keyMap: {
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        59: ";",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        190: "."
    }
};


//sample code
//<button class="jsOpenHrefAsDialog" data-content-class="sl-dialog-wide" data-href="/pf4/cms2/event_display?id=1498854920169&amp;mod=content">event</button>
var DialogButtons = Class.$extend({
    __init__: function () {
        sl.log("DialogButtons")
        this.setupGlobalListener();
    },
    setupGlobalListener: function () {
        try {
            jQuery("body").on({
                "click": jQuery.proxy(this.clickPressHandler, this),
                "keypress": jQuery.proxy(this.clickPressHandler, this)
            }, ".jsOpenHrefAsDialog");
        }
        catch (err) {
            // ckeditor plugin is using an old version of javascript which does not support "on"
        }
    },
    clickPressHandler: function (event) {
        sl.log("clickHandler openHrefAsDialogHandler", event);
        var code = (event.keyCode ? event.keyCode : event.which);
        var target = (jQuery(event.target).hasClass("jsOpenHrefAsDialog")) ? jQuery(event.target) : jQuery(event.target).closest(".jsOpenHrefAsDialog");
        sl.log("code", code);
        if (code == sl.keyboard["ENTER"] || code == sl.keyboard["SPACE"]) {
            this.dialogCallback = jQuery.proxy(this.refocusToButton, this, target);
        } else if (code > 1) {
            return; //return on all else other than click, enter or space
        }
        event.preventDefault();
        event.stopPropagation();

        this.targetID = target.attr("id");

        var buttonText = target.data("dialog-buttons");
        var buttons = (buttonText != null) ? [
            $.extend({}, vex.dialog.buttons.YES, {
                text: buttonText,
                className: "vex-dialog-button-primary"
            })] : null;
        var options = {
            url: jQuery(target).data("href"),
            contentClassName: jQuery(target).data("content-class"),
            buttons: buttons
        };
        if (this.dialogCallback != null) {
            options.dialogCallback = this.dialogCallback
        }
        var eventDialog = new Dialog(options);
        var dialog = eventDialog.createDialog();
        sl.log("this.eventDialog in clickHandler", dialog);
        dialog.done(jQuery.proxy(this.openDialogCallback, this))
    },
    openDialogCallback: function (eventDialog) {
        this.currentDialog = jQuery(eventDialog);
        this.currentDialog.attr({
                "role": "dialog",
                "tabindex": "-1",
                "aria-labelledby": this.targetID
            })
        this.currentDialog.focus();
        this.lastTabbable = this.currentDialog.find(":tabbable:last")
        this.firstTabbable = this.currentDialog.find(":tabbable:first")
        sl.log("this.firstTabbable this.lastTabbable",this.firstTabbable,this.lastTabbable)
        this.lastTabbable.add(this.firstTabbable).add(this.currentDialog).on("keydown", jQuery.proxy(this.dialogFocusoutHandler, this));
    },
    dialogFocusoutHandler: function (event) {
        var code = (event.keyCode ? event.keyCode : event.which);
        if (code == sl.keyboard["TAB"]) {
            var target = jQuery(event.target);
            if (target.is(this.lastTabbable) && !event.shiftKey) {
                event.preventDefault();
                this.firstTabbable.focus();
            }
            if (event.shiftKey && (target.is(this.firstTabbable) || target.is(this.currentDialog))) {
                event.preventDefault();
                this.lastTabbable.focus();
            }
        }
    },
    refocusToButton: function (button) {
        button.focus();
        this.dialogCallback = null;
    }
});