var dashboard = {};

dashboard.vm = {};

dashboard.vm.init = function() {
    this.doOnce = m.prop(true);
    this.courierList = m.prop([]);
    this.backupCourierList = m.prop([]);
    this.activeItem = m.prop(0);
    this.activeSort = m.prop("");
    this.itemDetails = m.prop({});
    this.apiHits = m.prop("");
    this.mapInitialized = m.prop(false);
    this.mode = m.prop("list");
}

dashboard.controller = function() {
    dashboard.vm.init();
}

dashboard.getList = function() {
    m.request({
        method: "GET",
        url: "https://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel"
    }).then(
        function(response) {
            console.log(response);
            dashboard.vm.courierList(response.parcels);
            dashboard.vm.itemDetails(response.parcels[0]);
            //dashboard.vm.backupCourierList(response.parcels);
            dashboard.vm.backupCourierList(owl.deepCopy(response.parcels));
        });
}

dashboard.getApiHits = function() {
    m.request({
        method: "GET",
        url: "https://zoomcar-ui.0x10.info/api/courier?type=json&query=api_hits"
    }).then(
        function(response) {
            dashboard.vm.apiHits(response["api_hits"]);
            setTimeout(dashboard.getApiHits, 5000);
        });
}

dashboard.search = function(e) {
    dashboard.vm.courierList(dashboard.vm.backupCourierList());
    if (e.target.value != "") {
        var list = [];
        dashboard.vm.courierList().map(function(value, index) {
            if (value["name"].toUpperCase().search(e.target.value.toUpperCase()) != -1 || value["price"].toUpperCase().search(e.target.value.toUpperCase()) != -1 || value["weight"].toUpperCase().search(e.target.value.toUpperCase()) != -1)
                list.push(value)
        })
        dashboard.vm.courierList(list);
    }
}

dashboard.sort = function(value) {
    if (value == "value") {
        if (dashboard.vm.activeSort() == "value") {
            dashboard.vm.activeSort("");
            dashboard.vm.courierList(owl.deepCopy(dashboard.vm.backupCourierList()));
            console.log(dashboard.vm.courierList());
            console.log(dashboard.vm.backupCourierList());
        } else {
            dashboard.vm.activeSort("value");
            dashboard.vm.courierList().sort(function(a, b) {
                return parseFloat(a.price.replace(",", "")) - parseFloat(b.price.replace(",", ""));
            });
        }
    } else if (value == "weight") {
        if (value == "weight") {
            if (dashboard.vm.activeSort() == "weight") {
                dashboard.vm.activeSort("");
                dashboard.vm.courierList(owl.deepCopy(dashboard.vm.backupCourierList()));
            } else {
                dashboard.vm.activeSort("weight");
                dashboard.vm.courierList().sort(function(a, b) {
                    console.log(parseFloat(a.weight.replace("kg", "")));
                    return parseFloat(a.weight.replace("kg", "")) - parseFloat(b.weight.replace("kg", ""));
                });
            }
        }
    }
    dashboard.vm.itemDetails(dashboard.vm.courierList()[dashboard.vm.activeItem()]);
}

dashboard.loadItem = function(value, index) {
    dashboard.vm.activeItem(index);
    dashboard.vm.itemDetails(value);
    dashboard.vm.mapInitialized(false);
    dashboard.vm.mode("item");
}



dashboard.loadMap = function() {
    if (!dashboard.vm.mapInitialized()) {
        var myLatLng = {
            lat: dashboard.vm.itemDetails()["live_location"].latitude,
            lng: dashboard.vm.itemDetails()["live_location"].longitude
        };
        var image = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';
        var map = new google.maps.Map(document.getElementById('map_canvas'), {
            zoom: 15,
            center: myLatLng
        });
        marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            icon: image
        });
        dashboard.vm.mapInitialized(true);
    }


}


dashboard.likeItem = function(value) {
    if (localStorage.getItem(value) === null) {
        localStorage.setItem(value, "1");
    } else {
        localStorage.removeItem(value);
    }
}

dashboard.changeMode = function(){
    dashboard.vm.mode("list");
}

dashboard.view = function() {
    if (dashboard.vm.doOnce()) {
        dashboard.getList();
        dashboard.getApiHits();
        dashboard.vm.doOnce(false);
    }
    return m(".container-fluid", [
        m(".header.row",
            m(".header-content.row", [
                m(".big-logo.col-md-6.hidden-sm.hidden-xs", m("img[src=images/big-logo.png]")),
                m(".small-logo.col-xs-6.hidden-md.hidden-lg", m("img[src=images/small-logo.png]")),
                m(".api-hits.col-md-6.col-xs-6", [
                    m(".api", "API Hits : " + dashboard.vm.apiHits()),
                    m(".parcel", "Parcel Count : " + dashboard.vm.courierList().length),
                ])
            ])
        ),
        m(".content", m(".content-1", [
            m(".list.col-md-6.col-xs-12.col-sm-12", {
                class: dashboard.vm.mode() == "item" ? "hidden-sm hidden-xs" : ""
            }, m(".list-content", [
                m(".search", [m("i.fa.fa-search"), m("input[type=text][placeholder=Search by parcel-name/price/weight]", {
                    oninput: dashboard.search
                })]), (function() {
                    var list = [];
                    dashboard.vm.courierList().map(function(value, index) {
                        list.push(m(".list-item", {
                            onclick: dashboard.loadItem.bind('', value, index),
                            class: dashboard.vm.activeItem() == index ? "highlight" : ""
                        }, [
                            m(".item-name", value.name + " ( " + value.weight + " ) "),
                            m(".item-price", [m("i.fa.fa-inr"), m(".price", value.price)])
                        ]))
                    })
                    return m(".list-content-items", list);
                })(),
                m(".sort", [
                    m(".lab", [m("i.fa.fa-sort"), m("span", "Sort")]),
                    m(".value", {
                        onclick: dashboard.sort.bind('', "value"),
                        class: dashboard.vm.activeSort() == "value" ? "highlight" : ""
                    }, "Value"),
                    m(".weight", {
                        onclick: dashboard.sort.bind('', 'weight'),
                        class: dashboard.vm.activeSort() == "weight" ? "highlight" : ""
                    }, "Weight")
                ])
            ])), (function() {
                if (Object.keys(dashboard.vm.itemDetails()).length != 0)
                    return m(".item.col-md-6.col-xs-12.col-sm-12",{
                        class: dashboard.vm.mode() == "list" ? "hidden-sm hidden-xs" : ""
                    }, m(".item-content", [
                        m(".close.hidden-md.hidden-lg",m("i.fa.fa-close",{
                            onclick:dashboard.changeMode.bind('','list')
                        })),
                        m(".item-details", [
                            m(".image", m("img.img-responsive[src=" + dashboard.vm.itemDetails()["image"] + "]")),
                            m(".details", [
                                m(".name", dashboard.vm.itemDetails()["name"]),
                                m(".field", [m("i.fa.fa-cart-arrow-down"), m("span", dashboard.vm.itemDetails()["type"])]),
                                m(".field", [m("i.fa.fa-inr"), m("span", dashboard.vm.itemDetails()["price"])]),
                                m(".field", [m("i.fa.fa-weibo"), m("span", dashboard.vm.itemDetails()["weight"])]),
                                m(".field", m("span", "Q "), dashboard.vm.itemDetails()["quantity"]),
                                m(".field", [m("i.fa.fa-phone"), m("span", dashboard.vm.itemDetails()["phone"])]),
                                m(".color[style='background:" + dashboard.vm.itemDetails()["color"] + "']"),
                            ])
                        ]),
                        m("#map_canvas", {
                            config: dashboard.loadMap
                        }),
                        m(".actions", [
                            m(".action", {
                                onclick: dashboard.likeItem.bind('', dashboard.vm.itemDetails()["name"]),
                                class: localStorage.getItem(dashboard.vm.itemDetails()["name"]) === null ? "" : "blue"
                            }, [m("i.fa.fa-thumbs-up"), m("span", "Like")]),
                           // m(".action", [m("i.fa.fa-share"), m("span", "Share")])
                           m(".action",m(".fb-share-button[data-href=https://developers.facebook.com/docs/plugins/][data-layout=button]"))
                        ])
                    ]));
            })()
        ]))
    ]);
}
