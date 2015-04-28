/**
 * Created by sreejith on 24/4/15.
 */
var no_provider_option = "No provider found";
var choose_provider = "Choose provider";
var no_table_found = "No table found";
var choose_table = "Choose table";
var no_result_found = "No result found";
var no_column_option = "No columns found";
var choose_column_option = "Choose column";

window.addEventListener('polymer-ready', function (e) {
    var menu = document.querySelector('#providerDropDownMenu');
    menu.addEventListener('core-select', function (e) {
        if (e.detail.isSelected) {
            $.getScript('rest-api.js', function () {
                var index = e.detail.item.id.split("/")[1];
                console.log("Selected Provider Index:" + index);
                getTables(index);
            });
        }
    });
});

window.addEventListener('polymer-ready', function (e) {
    var menu = document.querySelector('#tableDropDownMenu');
    menu.addEventListener('core-select', function (e) {
        if (e.detail.isSelected) {
            $.getScript('rest-api.js', function () {
                loadDB();
            });
        }
    });
});

document.addEventListener('polymer-ready', function () {
    var navicon = document.getElementById('navicon');
    var drawerPanel = document.getElementById('drawerPanel');
    navicon.addEventListener('click', function () {
        drawerPanel.togglePanel();
    });
});

function validateIP() {
    var input = $("#ip").val();
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    var fine = validateNum(port, 1, 65535) &&
        ip.length == 4 &&
        ip.every(function (segment) {
            return validateNum(segment, 0, 255);
        });
    if (fine) {
        document.getElementById("ip-check").disabled = false;
    }
    else {
        document.getElementById("ip-check").disabled = true;
    }
}

function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}

function setPolyProviders(providerArray) {
    console.log("poly menu");
    var sel = document.getElementById("provider_menu");
    var par = sel.parentNode;

    par.removeChild(sel);

    sel = createCoreMenu("provider_menu");
    par.appendChild(sel);

    if (providerArray == null) {
        console.log("No provider found");
        clearProjections();
        sel.appendChild(createPaperItem(no_provider_option, "provider/" + -1));
    } else {
        sel.appendChild(createPaperItem(choose_provider, "provider/" + -1));

        var x = 0;
        for (; x < providerArray.length; x++) {
            sel.appendChild(createPaperItem(providerArray[x].provider, "provider/" + providerArray[x].urlIndex));
        }
    }
}

function setPolyProjections(projectionArray){
    var sel = document.getElementById("provider_menu");
    var par = sel.parentNode;

    par.removeChild(sel);

    sel = createCoreMenu("provider_menu");
    par.appendChild(sel);

    if (projectionArray == null) {
        console.log("No projection found");
        sel.appendChild(createPaperItem(no_provider_option, "provider/" + -1));
    } else {
        sel.appendChild(createPaperItem(choose_provider, "provider/" + -1));

        var x = 0;
        for (; x < providerArray.length; x++) {
            sel.appendChild(createPaperItem(providerArray[x].provider, "provider/" + providerArray[x].urlIndex));
        }
    }
}

function setPolyTables(tablesArray) {
    console.log("poly table");
    var sel = document.getElementById("table_menu");
    var par = sel.parentNode;

    par.removeChild(sel);

    sel = createCoreMenu("table_menu");
    par.appendChild(sel);

    if (tablesArray == null) {
        console.log("No provider found");
        clearProjections();
        sel.appendChild(createPaperItem(no_table_found, "table/" + -1));
    } else {
        sel.appendChild(createPaperItem(choose_table, "table/" + -1));

        var x = 0;
        for (; x < tablesArray.length; x++) {
            sel.appendChild(createPaperItem(tablesArray[x], "table/" + tablesArray[x]));
        }
    }
}

function clearProjections(){
    document.getElementById("no_projection_label").hidden = false;
    var sel = document.getElementById("sidebar-projections");
    sel.innerHTML="";
}

function setProjections(projections) {
    if(projections ==null || projections.length<0){
        document.getElementById("no_projection_label").hidden = false;
    }else{
        document.getElementById("no_projection_label").hidden = true;
    }

    var sel = document.getElementById("sidebar-projections");
    sel.innerHTML="";

    for (var x = 0; x < projections.length; x++) {
        var proj = projections[x].field;
        sel.appendChild(createPaperCheckbox(proj));
    }
}

function setDBResult(tableResult) {
    var columns = tableResult.columns;
    var data = tableResult.data;
    console.log("Columns: " + JSON.stringify(columns));
    console.log("Data: " + JSON.stringify(data));

    setProjections(columns);

    grid.setColumns(columns);
    grid.setData(data);
    grid.invalidate();

}

function createPaperItem(name, value) {
    var option = document.createElement('paper-item');
    //option.label = value;
    option.id = value;
    option.innerHTML = name;
    return option;
}

function createCoreMenu(id) {
    var option = document.createElement('core-menu');
    option.id = id;
    option.selected = 0;
    return option;
}

function createPaperCheckbox(label) {
    var option = document.createElement('paper-checkbox');
    option.role = "checkbox";
    option.label = label;
    return option;
}

function createSelectOption(name, value) {
    var option = document.createElement('option');
    option.value = value;
    option.innerHTML = name;
    return option;
}

function createSpanElement(spanText) {
    var span = document.createElement('span');
    span.innerHTML = spanText;
    return span;
}
