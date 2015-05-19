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

var selection = [];
var ID_proj_checkbox = "proj_checkbox";

var checkBoxIdGenerator = 0;
var selection;
var selectionValue;

function onBodyLoad(){
    var sel = document.getElementById("mainHeader");
    sel.style.width = window.innerWidth+(document.body.scrollWidth-window.innerWidth)+"px";
    if (window.innerWidth < 1600) {
        sel.style.height = "105px";
        document.getElementById("topTable").style.top = "1em";
    } else {
        sel.style.height = "64px";
        document.getElementById("topTable").style.top = "0px";
    }
}

window.addEventListener('polymer-ready', function (e) {
   validateIP();
});

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
                getDBColumns();
            });
        }
    });
});

window.addEventListener('resize', function (e) {
    var sel = document.getElementById("mainHeader");
    sel.style.width = window.innerWidth+(document.body.scrollWidth-window.innerWidth)+"px";
    if (e.target.innerWidth < 1600) {
        sel.style.height = "105px";
        document.getElementById("topTable").style.top = "1em";
    } else {
        sel.style.height = "64px";
        document.getElementById("topTable").style.top = "0px";
    }
});

var canDrag = false;
window.addEventListener('polymer-ready', function (e) {
    addEventListener('drag-start', function (e) {
        var dragInfo = e.detail;
        var btn = document.querySelector('#floatingBtn');
        var rect = document.getElementById("floatingBtn").getBoundingClientRect();

        var count = 0;
        canDrag = false;
        dragInfo.drag = function (e) {
            var y = e.event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
            var x = e.event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);

            if (count == 0) {
                //console.log(x + " " + y);
                //console.log(rect.left + " " + rect.top + " " + rect.right + " " + rect.bottom);
                if (rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom) {
                    canDrag = true;
                    btn.style.left = "0px";
                    btn.style.top = "0px";
                    dragInfo.avatar.appendChild(btn);
                    btn.hidden = true;
                    console.log("Drag");
                }
                else {
                    canDrag = false;
                    console.log("Can't drag");
                }
            }
            if (canDrag) {
                btn.style.top = x;
                btn.style.left = y;
                if (count > 5)
                    btn.hidden = false;
            }
            count++;
        };
        dragInfo.drop = drop;
    });
});

//
function drop(dragInfo) {
    if (canDrag) {
        var f = dragInfo.event;
        var child = dragInfo.avatar.childNodes[0];
        child.hidden = false;
        child.style.left = f.clientX + 'px';
        child.style.top = f.clientY + 'px';
        document.body.appendChild(child);
    }
    document.querySelector('#floatingBtn').hidden = false;
    //console.log(child.style);
}

document.addEventListener('polymer-ready', function () {
    var navicon = document.getElementById('navicon');
    var drawerPanel = document.getElementById('drawerPanel');
    navicon.addEventListener('click', function () {
        drawerPanel.togglePanel();
    });
});

function validateIP() {
    var input = $("#ip").val()+":"+$("#port").val();
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

function setPolyProjections(projectionArray) {
    var sel = document.getElementById("selection_menu");
    var order = document.getElementById("order_menu");

    var par = sel.parentNode;
    var orderPar = order.parentNode;

    par.removeChild(sel);
    orderPar.removeChild(order);

    sel = createCoreMenu("selection_menu");
    order = createCoreMenu("order_menu");

    par.appendChild(sel);
    orderPar.appendChild(order);

    if (projectionArray == null) {
        console.log("No column found");
        document.getElementById("selectionDropDownMenu").disabled = true;
        document.getElementById("orderDropDownMenu").disabled = true;

        sel.appendChild(createPaperItem(no_column_option, "selection/" + -1));
        order.appendChild(createPaperItem(no_column_option, "order/" + -1));
    } else {
        document.getElementById("selectionDropDownMenu").disabled = false;
        document.getElementById("orderDropDownMenu").disabled = false;

        sel.appendChild(createPaperItem(choose_column_option, "selection/" + -1));
        order.appendChild(createPaperItem(choose_column_option, "order/" + -1));

        var x = 0;
        for (; x < projectionArray.length; x++) {
            sel.appendChild(createPaperItem(projectionArray[x], "selection/" + projectionArray[x]));
            order.appendChild(createPaperItem(projectionArray[x], "order/" + projectionArray[x]));
        }
    }
}

function setPolyTables(tablesArray) {
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
    document.getElementById("tableDropDownMenu").disabled = false;
}

function clearProjections() {
    document.getElementById("no_projection_label").hidden = false;
    var sel = document.getElementById("sidebar-projections");
    sel.innerHTML = "";
}

function setProjections(projections) {
    if (projections == null || projections.length < 0) {
        document.getElementById("no_projection_label").hidden = false;
        return;
    } else {
        document.getElementById("no_projection_label").hidden = true;
    }

    var sel = document.getElementById("sidebar-projections");
    sel.innerHTML = "";

    for (var x = 0; x < projections.length; x++) {
        var proj = projections[x];
        sel.appendChild(createPaperCheckbox(ID_proj_checkbox, proj, null));
    }

    setPolyProjections(projections);
}

function setDBResult(tableResult) {
    var columns = tableResult.columns;
    var data = tableResult.data;
    console.log("Columns: " + JSON.stringify(columns));
    console.log("Data: " + JSON.stringify(data));

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

function createPaperCheckbox(type, label, onChange) {
    var option = document.createElement('paper-checkbox');
    option.role = "checkbox";
    option.label = label;
    option.id = getNewCheckBoxId(type);
    //option.onChange = onChange;
    return option;
}

function getNewCheckBoxId(type) {
    return type + "/" + (checkBoxIdGenerator++);
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
