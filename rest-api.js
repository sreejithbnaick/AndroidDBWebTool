/**
 * Created by sreejith on 24/4/15.
 */
function getProviders(){
    var url = "http://"+$("#ip").val();
    console.log(url);
    var xhr = makeCorsRequest(url,function(){
        console.log("getProviders: "+xhr.responseText);
        $.getScript('web.js',function(){
            setPolyProviders(JSON.parse(xhr.responseText));
        });
        document.getElementById("providerDropDownMenu").disabled = false;
    },function(){
        console.log("getProviders: onerror");
        $.getScript('web.js',function(){
            setPolyProviders(null);
        });
        document.getElementById("providerDropDownMenu").disabled = true;
    });
}

function getTables(){
    var providerIndex = document.getElementById("provider_menu").selectedItem.id.split("/")[1];
    if(providerIndex < 0) {
        setPolyTables(null);
        document.getElementById("tableDropDownMenu").disabled = true;
        return;
    }

    var url = "http://"+$("#ip").val()+"/"+providerIndex;
    console.log(url);

    var xhr = makeCorsRequest(url,function(){
        console.log("getTables: "+xhr.responseText);
        $.getScript('web.js',function(){
            setPolyTables(JSON.parse(xhr.responseText));
        });
    },function(){
        console.log("getTables: onerror");
        $.getScript('web.js',function(){
            setPolyTables(null);
        });
        document.getElementById("tableDropDownMenu").disabled = true;
    });
}

function getDBColumns(){
    var providerIndex = document.getElementById("provider_menu").selectedItem.id.split("/")[1];
    if(providerIndex <0)
        return;
    var table = document.getElementById("table_menu").selectedItem.id.split("/")[1];
    if(table == -1)
        return;

    var url = "http://"+$("#ip").val()+"/"+providerIndex+"/"+table+"/projections";
    console.log(url);

    var xhr = makeCorsRequest(url,function(){
        console.log("getDBColumns: "+xhr.responseText);
        $.getScript('web.js',function(){
            setProjections(JSON.parse(xhr.responseText));
        });
    },function(){
        console.log("getDBColumns: onerror");
        $.getScript('web.js',function(){
            setProjections(null);
        });
    });
}

function loadDB(){
    var providerIndex = document.getElementById("provider_menu").selectedItem.id.split("/")[1];
    if(providerIndex <0)
        return;
    var table = document.getElementById("table_menu").selectedItem.id.split("/")[1];
    if(table == -1)
        return;
    var projections = getSelectedProjections();

    var url = "http://"+$("#ip").val()+"/"+providerIndex+"/"+table+"?type=json";

    if(projections!=null){
        url+="&proj="+projections;
    }
    console.log(url);

    var xhr = makeCorsRequest(url,function(){
        console.log("loadDB: "+xhr.responseText);
        $.getScript('web.js',function(){
            setDBResult(JSON.parse(xhr.responseText));
        });
    },function(){
        console.log("loadDB: onerror");
        $.getScript('web.js',function(){
            setDBResult(null);
        });
    });
}

function getSelectedProjections(){
    var div = document.getElementById("sidebar-projections");
    var childs = div.childNodes;
    var result =null;
    for(var x=0;x<childs.length;x++){
        var child = childs[x];
        if(child.checked){
            if(result ==null)
                result = child.label;
            else
                result = result+","+child.label;
        }
    }
    return result;
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
function makeCorsRequest(url,onload,onerror) {
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