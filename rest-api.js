/**
 * Created by sreejith on 24/4/15.
 */

function getApiData(dataModel, context) {
    console.log(dataModel);
    getTable(context);
}

function getProviders() {
    var url = "http://" + $("#ip").val() + ":" + $("#port").val();
    console.log(url);
    document.getElementById("providerSpinner").active = true;
    var xhr = makeCorsRequest(url, function () {
        console.log("getProviders: " + xhr.responseText);
        $.getScript('web.js', function () {
            setPolyProviders(JSON.parse(xhr.responseText));
        });
        document.getElementById("providerSpinner").active = false;
        document.getElementById("providerDropDownMenu").disabled = false;
    }, function () {
        console.log("getProviders: onerror");
        $.getScript('web.js', function () {
            setPolyProviders(null);
        });
        document.getElementById("providerSpinner").active = false;
        document.getElementById("providerDropDownMenu").disabled = true;
        alert("Error: Check your IP Address");
    });
}

function getTable(context) {
    var providerIndex = document.getElementById("provider_menu").selectedItem.id.split("/")[1];
    if (providerIndex < 0) {
        context.processlist = [];
        return;
    }

    var url = "http://" + $("#ip").val() + ":" + $("#port").val() + "/" + providerIndex;
    console.log(url);

    document.getElementById("tableSpinner").active = true;
    var xhr = makeCorsRequest(url, function () {
        console.log("getTables: " + xhr.responseText);
        document.getElementById("tableSpinner").active = false;
        context.processlist = JSON.parse(xhr.responseText);
    }, function () {
        console.log("getTables: onerror");
        context.processlist = [];
        document.getElementById("tableSpinner").active = false;
        document.getElementById("tableDropDownMenu").disabled = true;
    });
}

function getTables() {
    var providerIndex = document.getElementById("provider_menu").selectedItem.id.split("/")[1];
    if (providerIndex < 0) {
        setPolyTables(null);
        document.getElementById("tableDropDownMenu").disabled = true;
        return;
    }

    var url = "http://" + $("#ip").val() + ":" + $("#port").val() + "/" + providerIndex;
    console.log(url);

    document.getElementById("tableSpinner").active = true;
    var xhr = makeCorsRequest(url, function () {
        console.log("getTables: " + xhr.responseText);
        document.getElementById("tableSpinner").active = false;
        $.getScript('web.js', function () {
            setPolyTables(JSON.parse(xhr.responseText));
        });
    }, function () {
        console.log("getTables: onerror");
        $.getScript('web.js', function () {
            setPolyTables(null);
        });
        document.getElementById("tableSpinner").active = false;
        document.getElementById("tableDropDownMenu").disabled = true;
        alert("Error: Check your IP Address");
    });
}

function getDBColumns() {
    var providerIndex = document.getElementById("provider_menu").selectedItem.id.split("/")[1];
    if (providerIndex < 0) {
        return;
    }
    var table = document.getElementById("table_menu").selectedItem.id.split("/")[1];
    if (table == -1) {
        return;
    }

    var url = "http://" + $("#ip").val() + ":" + $("#port").val() + "/" + providerIndex + "/" + table + "/projections";
    console.log(url);

    document.getElementById("tableSpinner").active = true;
    var xhr = makeCorsRequest(url, function () {
        console.log("getDBColumns: " + xhr.responseText);
        document.getElementById("tableSpinner").active = false;
        $.getScript('web.js', function () {
            setProjections(JSON.parse(xhr.responseText));
        });
    }, function () {
        console.log("getDBColumns: onerror");
        document.getElementById("tableSpinner").active = false;
        $.getScript('web.js', function () {
            setProjections(null);
        });
        alert("Error: Check your IP Address");
    });
}

function loadDB() {
    var providerIndex = document.getElementById("provider_menu").selectedItem.id.split("/")[1];
    if (providerIndex < 0) {
        alert("Select PROVIDER");
        return;
    }
    var table = document.getElementById("table_menu").selectedItem.id.split("/")[1];
    if (table == -1) {
        alert("Select TABLE");
        return;
    }
    var queryString = "select";
    var projections = getSelectedProjections();
    var orderby = getSelectedOrderColumn();

    var url = "http://" + $("#ip").val() + ":" + $("#port").val() + "/" + providerIndex + "/" + table + "?type=json";

    if (projections != null) {
        url += "&proj=" + projections;
        queryString = queryString+" "+projections;
    }else{
        queryString = queryString+" *";
    }

    queryString = queryString+" from "+table;

    console.log(selection);
    console.log(selectionValue);

    var sel = selection;
    var selVal = selectionValue;

    if (sel != null && sel.trim() != '') {
        url += "&sel=" + encodeURI(sel);
        queryString = queryString +" where "+ document.getElementById("selectionLabel").innerHTML.toString();
    }

    if (selVal != null && selVal.trim() != '') {
        url += "&selargs=" + selVal;
    }

    if (orderby != null) {
        url += "&order=" + orderby;
        queryString = queryString+" order by "+orderby;
    }
    console.log(queryString);
    document.getElementById("query").innerHTML = queryString.toUpperCase();

    console.log(url);

    $.getScript('web.js', function () {
        blockUI();
    });

    var xhr = makeCorsRequest(url, function () {
        console.log("loadDB: " + xhr.responseText);
        $.getScript('web.js', function () {
            unBlockUI();
        });
        $.getScript('web.js', function () {
            setDBResult(JSON.parse(xhr.responseText));
        });
    }, function () {
        console.log("loadDB: onerror");
        $.getScript('web.js', function () {
            unBlockUI();
        });
        $.getScript('web.js', function () {
            setDBResult(null);
        });
    });
}

function getSelectedProjections() {
    var div = document.getElementById("sidebar-projections");
    var childs = div.childNodes;
    var result = null;
    for (var x = 0; x < childs.length; x++) {
        var child = childs[x];
        if (child.checked) {
            if (result == null)
                result = child.label;
            else
                result = result + "," + child.label;
        }
    }
    return result;
}

function getSelectedOrderColumn() {
    var col = document.getElementById("order_menu").selectedItem.id.split('/')[1];
    var asdes = document.getElementById("orderby_menu").selectedItem.id.split("/")[1];
    if (col == -1 || col == "-1")
        return null;
    else
        return col + " " + asdes;
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

// Make the actual CORS request.
function makeCorsRequest(url, onload, onerror) {
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    xhr.onerror = onerror;
    xhr.onload = onload;

    xhr.send();
    return xhr;
}