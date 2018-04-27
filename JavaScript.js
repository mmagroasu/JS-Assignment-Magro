require([
            "esri/tasks/Locator",
            "esri/Map",
            "esri/views/MapView",
            "esri/layers/FeatureLayer",
            "esri/widgets/Legend",
            "esri/widgets/Search",
            "esri/widgets/LayerList",
            "dojo/domReady!"
],
          function (
            Locator, Map, MapView,
            FeatureLayer, Legend, Search, LayerList
          ) {
              var locatorTask = new Locator({
                  url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
              });
              var map = new Map({
                  basemap: "topo"
              });
              var view = new MapView({
                  container: "viewDiv",
                  map: map,
                  extent: {
                      xmin: -1.2631441076240186E7,
                      ymin: 3820427.905014247,
                      xmax: -1.2349953541655242E7,
                      ymax: 4050452.804745327,
                      spatialReference: 102100
                  }
              });
              var searchWidget = new Search({
                  view: view
              });
              var template = { // autocasts as new PopupTemplate()
                  title: "Roads in AZ",
                  content: [{
                      // It is also possible to set the fieldInfos outside of the content
                      // directly in the popupTemplate. If no fieldInfos is specifically set
                      // in the content, it defaults to whatever may be set within the popupTemplate.
                      fieldName: "OBJECTID",
                      label: "OBJECTID",
                      visible: true,
                      format: {
                          digitSeparator: true,
                          places: 0
                      }, 
                      fieldName: "RTE_ID",
                      label: "Route ID",
                      visible: true,
                      format: {
                          digitSeparator: true,
                          places: 0
                      }
                  }]
              };

              // Add the search widget to the top right corner of the view
              view.ui.add(searchWidget, {
                  position: "top-right"
              });

              /********************
               * Add feature layer
               ********************/
              // Major roadways in AZ
              var featureLayer = new FeatureLayer({
                  url: "https://services3.arcgis.com/0OPQIK59PJJqLK0A/arcgis/rest/services/All_Major_Highways/FeatureServer",
                  popupTemplate: template
              });
              map.add(featureLayer);
              view.when(function () {
                  var featureLayer = map.layers.getItemAt(0);
                  var legend = new Legend({
                      view: view,
                      layerInfos: [{
                          layer: featureLayer,
                          title: "Major Roads in Central Arizona"
                      }]
                  });
                  view.ui.add(legend, "bottom-right");
                  var layerList = new LayerList({
                      view: view
                  });

                  // Add widget to the top right corner of the view
                  view.ui.add(layerList, "top-right");
              });
          });