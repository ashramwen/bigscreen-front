"use strict";angular.module("BigScreen.AppShared",["ngAnimate","ngSanitize","ui.bootstrap","LocalStorageModule","ui.router","BigScreen.Secure"]).constant("AppConfig",{StoragePrefix:"BigScreen",USER_SESSION:"USER_SESSION"}).config(["localStorageServiceProvider","AppConfig",function(e,r){e.setPrefix(r.StoragePrefix).setStorageType("localStorage").setStorageCookie(30,"/").setNotify(!0,!0)}]),angular.module("BigScreen.AppShared").directive("switchery",["$timeout",function(){return{restrict:"E",scope:{on:"=ngModel",reverse:"=?",ngChange:"&"},templateUrl:"app/components/AppShared/directives/switchery/switchery.template.html",replace:!0,link:function(e,r,t){e.yesText=t.yesText||"On",e.noText=t.noText||"Off",e.switch=function(){t.hasOwnProperty("readonly")||(e.on=!e.on)},e.ngChange&&"function"==typeof e.ngChange&&e.$watch("on",function(r,t){void 0!==r&&void 0!==t&&e.$eval(e.ngChange)})}}}]),angular.module("BigScreen.AppShared").directive("appRoom",["$timeout",function(){return{restrict:"E",templateUrl:"app/components/AppShared/directives/room/room.html",replace:!0,scope:{room:"="},link:function(){}}}]),angular.module("BigScreen.AppShared").directive("appMeetingRoom",["$timeout",function(){return{restrict:"E",templateUrl:"app/components/AppShared/directives/meeting-room/meeting-room.html",replace:!0,scope:{room:"="},link:function(){}}}]),angular.module("BigScreen.Portal",["ngResource","BigScreen.AppShared"]).config(["$resourceProvider",function(e){e.defaults.stripTrailingSlashes=!1}]),angular.module("BigScreen.Portal").controller("WelcomeController",["$scope",function(){}]),angular.module("BigScreen.Portal").controller("OfficeUsageController",["$scope",function(e){e.rooms=[{id:"8-7-11-N",name:"十里亭",busy:1},{id:"8-7-13-N",name:"幽篁阁"},{id:"8-7-12-N",name:"文昌阁",busy:1},{id:"8-7-15-N",name:"勿幕阁",busy:1},{id:"8-7-14-N",name:"安定阁"},{id:"8-7-16-N",name:"安远阁"},{id:"8-7-17-N",name:"尚检阁",busy:1}]}]),angular.module("BigScreen.Portal").factory("ParkingService",["$resource","$q",function(e,r){var t=new Date,a={year:t.getFullYear(),month:t.getMonth(),day:t.getDate()},i=e(thirdPartyAPIUrl,{startTime:new Date(a.year,a.month,a.day,8,0,0,0).getTime(),endTime:new Date(a.year,a.month,a.day,20,0,0,0).getTime(),interval:"1h"},{getCarInFrequency:{url:thirdPartyAPIUrl+"carparking/CarInFrequency",method:"GET",headers:{apiKey:thirdPartyAPIKey}},getCarOutFrequency:{url:thirdPartyAPIUrl+"carparking/CarOutFrequency",method:"GET",headers:{apiKey:thirdPartyAPIKey}}}),s=i.getCarInFrequency,o=i.getCarOutFrequency;return function(){var e=r.defer();return r.all([s().$promise,o().$promise]).then(function(r){var t=[r[0].aggregations.byHour.buckets,r[1].aggregations.byHour.buckets];e.resolve(t)},function(){e.reject()}),e.promise}}]).factory("ParkingChart",["$rootScope","ParkingService",function(e,r){function t(e,r){for(var t=[],a=[],i=[],s=0,o=e.length>r.length?e.length:r.length;o>s;s++)e[s]&&(t[s]=e[s].key,a.push(e[s].doc_count)),r[s]&&(t[s]=r[s].key,i.push(r[s].doc_count));return{x:t,dataIn:a,dataOut:i}}var a,i={tooltip:{trigger:"axis"},legend:{data:["进入高峰","驶出高峰"],textStyle:{fontSize:24}},xAxis:{type:"category",boundaryGap:!1,data:[],axisLabel:{formatter:function(e){return moment(e).format("H:mm")}}},yAxis:{type:"value"},series:[{name:"进入高峰",type:"line",smooth:!0,areaStyle:{normal:{color:"#89a8b9"}},markPoint:{data:[{type:"max",name:"最大值"}]}},{name:"驶出高峰",type:"line",smooth:!0,areaStyle:{normal:{color:"#2ec3ed"}},markPoint:{data:[{type:"max",name:"最大值"}]}}]},s={init:function(e){a=echarts.init(e),a.setOption(i)},setData:function(){r().then(function(e){var r=t(e[0],e[1]);a.setOption({xAxis:{data:r.x},series:[{name:"进入高峰",data:r.dataIn},{name:"驶出高峰",data:r.dataOut}]})})}};return s}]),angular.module("BigScreen.Portal").controller("ParkingAreaController",["$scope","$timeout","ParkingChart",function(e,r,t){e.init=function(){t.init(document.getElementById("parking-chart")),t.setData()},e.$on("theHour",function(){t.setData()})}]),angular.module("BigScreen.Portal").controller("OfficeSpaceController",["$scope",function(e){e.firstRooms=[{id:1,light:1,fan:1,empty:!1,name:"工位区",type:"work"},{id:2,light:1,fan:1,empty:!1,name:"工位区",type:"work"},{id:3,light:1,fan:1,empty:!1,name:"休闲区",type:"rest"},{id:4,light:0,fan:0,empty:!0,name:"工位区",type:"work"},{id:5,light:1,fan:1,empty:!1,name:"工位区",type:"work"},{id:6,light:1,fan:1,empty:!1,name:"工位区",type:"work"},{id:7,light:1,fan:1,empty:!1,name:"休闲区",type:"rest"},{id:8,light:1,fan:1,empty:!1,name:"休闲区",type:"rest"}],e.secondRooms=[{id:9,light:1,fan:1,empty:!1,name:"休闲区",type:"rest"},{id:10,light:0,fan:0,empty:!0,name:"休闲区",type:"rest"},{id:11,light:1,fan:1,empty:!1,name:"休闲区",type:"rest"}]}]),angular.module("BigScreen.Portal").factory("PopulationService",["$resource","$q",function(e,r){var t=new Date,a={year:t.getFullYear(),month:t.getMonth(),day:t.getDate()},i=e(thirdPartyAPIUrl,{startTime:new Date(a.year,a.month,a.day,8,0,0,0).getTime(),endTime:new Date(a.year,a.month,a.day,20,0,0,0).getTime(),interval:"1h"},{getCarInFrequency:{url:thirdPartyAPIUrl+"carparking/CarInFrequency",method:"GET",headers:{apiKey:thirdPartyAPIKey}},getCarOutFrequency:{url:thirdPartyAPIUrl+"carparking/CarOutFrequency",method:"GET",headers:{apiKey:thirdPartyAPIKey}}}),s=i.getCarInFrequency,o=i.getCarOutFrequency;return function(){var e=r.defer();return r.all([s().$promise,o().$promise]).then(function(r){var t=[r[0].aggregations.byHour.buckets,r[1].aggregations.byHour.buckets];e.resolve(t)},function(){e.reject()}),e.promise}}]).factory("PopulationChart",["$rootScope","PopulationService",function(){function e(e,r){for(var t=[],a=[],i=[],s=0,o=e.length>r.length?e.length:r.length;o>s;s++)e[s]&&(t[s]=e[s].key,a.push(e[s].doc_count)),r[s]&&(t[s]=r[s].key,i.push(r[s].doc_count));return{x:t,dataIn:a,dataOut:i}}var r,t={tooltip:{trigger:"item",formatter:"{a} <br/>{b}: {c} ({d}%)"},series:[{name:"空间利用率",type:"pie",radius:["30%","70%"],labelLine:{normal:{show:!1}},data:[{value:335,name:"人员",itemStyle:{normal:{color:"#cae2ef"}}},{value:310,name:"空",itemStyle:{normal:{color:"#48abdd"}}}]}]},a={init:function(e){r=echarts.init(e),r.setOption(t)},setData:function(){ParkingService().then(function(t){var a=e(t[0],t[1]);r.setOption({xAxis:{data:a.x},series:[{name:"进入高峰",data:a.dataIn},{name:"驶出高峰",data:a.dataOut}]})})}};return a}]),angular.module("BigScreen.Portal").controller("EnvironmentController",["$scope","PopulationChart",function(e,r){e.init=function(){r.init(document.getElementById("population-chart"))}}]),angular.module("BigScreen.AppShared").filter("leftHalf",function(){return function(e){var r=[];return _.each(e,function(e,t){t%2!=0&&r.push(e)}),r}}).filter("rightHalf",function(){return function(e){var r=[];return _.each(e,function(e,t){t%2!=1&&r.push(e)}),r}}),angular.module("BigScreen.Secure",["BigScreen.AppShared"]),angular.module("BigScreen.Secure").factory("SessionService",["localStorageService","$rootScope","AppConfig",function(e,r,t){var a={};return a.setPortalAdmin=function(a){e.set(t.USER_SESSION,a),r.portalAdmin=a},a.getPortalAdmin=function(){return e.get(t.USER_SESSION)},a.expire=function(){r.portalAdmin=null,e.remove(t.USER_SESSION)},a.restore=function(){e.get(t.USER_SESSION)},a.restore(),a}]),angular.module("BigScreen.Secure").factory("SecurityService",["localStorageService","AppUtils","SessionService","$$Auth",function(e,r,t,a){function i(){this.unauthorized=!1}var s={};return s.errorHandler=function(e){var r=new i;switch(e.status){case"Unauthorized":r.unauthorized=!0}return r},s.login=function(){return a.login({password:"1qaz2wsx",permanentToken:!0,userName:"beehive_admin"}).$promise},s}]),angular.module("BigScreen.Secure").controller("SecureController",["$scope","$rootScope","$state","AppUtils","SecurityService","SessionService",function(e,r,t,a,i,s){a.showLoading(),i.login().then(function(e){s.setPortalAdmin(e),t.go("app.Portal.OfficeSpace"),a.hideLoading()},function(e){console.log(e),a.hideLoading()})}]),angular.module("BigScreen.Portal").factory("PortalService",["AppUtils","$state",function(e,r){var t={};return t.getStateDisplayName=function(e){return r.get(e).getName()},t.getStateChan=function(e){var t=[];t.push(e);for(var a=e;a.previous;)a=r.get(a.previous),t.push(a);return t.reverse(),t},t.isActive=function(e){var a=t.getStateChan(r.current),i=r.get(e);return a.indexOf(i)>-1},t.getPortalNavs=function(){return[{name:"办公空间总览",state:r.get("app.Portal.OfficeSpace"),icon:"fa-tachometer"},{name:"办公环境监控",state:r.get("app.Portal.Environment"),icon:"fa-line-chart"},{name:"会议室",state:r.get("app.Portal.OfficeUsage"),icon:"fa-globe"},{name:"智能停车场",state:r.get("app.Portal.ParkingArea"),icon:"fa-cogs"}]},t}]);var MyApp=angular.module("BigScreen",["ui.router","BigScreen.Secure","BigScreen.AppShared","BigScreen.Portal"]);MyApp.config(["$httpProvider","$stateProvider","$urlRouterProvider","$logProvider",function(e,r,t,a){delete e.defaults.headers.common["X-Requested-With"],a.debugEnabled(!1),e.defaults.headers.common["Content-Type"]="application/json",e.defaults.headers.common.Authorization="Bearer super_token",e.interceptors.push(["$q",function(e){return{request:function(e){return MyApp.utils.doLoading(),e},response:function(e){return MyApp.utils.whenLoaded(),e},responseError:function(r){return MyApp.utils.whenLoaded(),401==r.status,e.reject(r)}}}])}]).run(["$rootScope","$state","$stateParams","AppUtils",function(e,r,t,a){e.$state=r,e.$stateParams=t,window.state=r,MyApp.utils=a}]),angular.module("BigScreen").factory("$$User",["$resource",function(e){var r=e(MyAPIs.USER+"/:userID",{userID:"@userID"},{get:{method:"GET",url:MyAPIs.USER+"/me"},update:{method:"PATCH",url:MyAPIs.USER+"/me"},setCustomData:{url:MyAPIs.USER+"/me/customData/:name",method:"PUT",params:{name:"@name"}},getCustomData:{url:MyAPIs.USER+"/me/customData/:name",method:"GET",params:{name:"@name"}},bindThing:{url:MyAPIs.THING+"/:globalThingIDs/users/:userIDs",params:{userIDs:"@userIDs",globalThingIDs:"@globalThingIDs"},method:"POST"},unbindThing:{url:MyAPIs.THING+"/:globalThingIDs/users/:userIDs",params:{userIDs:"@userIDs",globalThingIDs:"@globalThingIDs"},method:"DELETE"},bindTag:{url:MyAPIs.TAG+"/:tags/users/:userIDs",method:"POST",params:{userIDs:"@userIDs",tags:"@tags"}},unbindTag:{url:MyAPIs.TAG+"/:tags/users/:userIDs",method:"DELETE",params:{userIDs:"@userIDs",tags:"@tags"}},getTags:{url:MyAPIs.TAG+"/user/:userID",method:"GET",params:{userID:"@userID"},isArray:!0},getThings:{url:MyAPIs.THING+"/user/:userID",method:"GET",params:{userID:"@userID"},isArray:!0},getPermissions:{url:MyAPIs.USER+"/permissionTree",method:"GET",isArray:!0},changePassword:{url:MyAPIs.USER+"/changepassword",method:"POST"},query:{url:MyAPIs.USER+"/simplequery",method:"POST",isArray:!0,transformRequest:function(e){return JSON.stringify(e)}}});return r}]).factory("$$Auth",["$resource",function(e){var r=e(MyAPIs.OPERATOR,{},{initpassword:{method:"POST",url:MyAPIs.OPERATOR+"/initpassword"},activate:{url:MyAPIs.OPERATOR+"/activate",method:"POST"},login:{url:MyAPIs.OPERATOR+"/login",method:"POST"},logout:{url:MyAPIs.OPERATOR+"/logout",method:"POST"},validate:{url:MyAPIs.OPERATOR+"/validatetoken",method:"POST"}});return r}]).factory("$$UserManager",["$resource",function(e){var r=e(MyAPIs.USER_MANAGER+"/:userID",{userID:"@userID"},{update:{method:"PATCH",url:MyAPIs.USER_MANAGER+"/:userID",params:{userID:"@userID"}},remove:{method:"DELETE",url:MyAPIs.USER_MANAGER+"/:userID",params:{userID:"@userID"}},create:{url:MyAPIs.USER_MANAGER,method:"POST"},changePassword:{url:MyAPIs.USER_MANAGER+"/:userID/resetpassword",method:"POST",params:{userID:"@userID"}},query:{url:MyAPIs.USER+"/simplequery",method:"POST",isArray:!0,transformRequest:function(e){return JSON.stringify(e)}}});return r}]).factory("$$UserGroup",["$resource",function(e){var r=e(MyAPIs.USER_GROUP+"/:id",{id:"@userGroupID"},{addUser:{method:"POST",url:MyAPIs.USER_GROUP+"/:userGroupID/user/:userID",params:{userGroupID:"@userGroupID",userID:"@userID"}},deleteUser:{method:"DELETE",url:MyAPIs.USER_GROUP+"/:userGroupID/user/:userID",params:{userGroupID:"@userGroupID",userID:"@userID"}},update:{method:"POST",url:MyAPIs.USER_GROUP},remove:{method:"DELETE"},get:{url:MyAPIs.USER_GROUP+"/:userGroupID",method:"GET",params:{userGroupID:"@userGroupID"}},getList:{url:MyAPIs.USER_GROUP+"/all",method:"GET",isArray:!0},getMyGroups:{url:MyAPIs.USER_GROUP+"/list",method:"GET",isArray:!0},withUserData:{url:MyAPIs.USER_GROUP+"/simplequery",method:"POST",transformRequest:function(e){return e.includeUserData=1,e}},create:{url:MyAPIs.USER_GROUP,method:"POST"},query:{url:MyAPIs.USER_GROUP+"/simplequery",method:"POST",isArray:!0},getPermissions:{url:MyAPIs.USER_GROUP,method:"GET"},bindThing:{url:MyAPIs.THING+"/:globalThingIDs/userGroups/:userGroupIDs",params:{userGroupIDs:"@userGroupIDs",globalThingIDs:"@globalThingIDs"},method:"POST"},unbindThing:{url:MyAPIs.THING+"/:globalThingIDs/userGroups/:userGroupIDs",params:{userGroupIDs:"@userGroupIDs",globalThingIDs:"@globalThingIDs"},method:"DELETE"},bindTag:{url:MyAPIs.TAG+"/:tags/userGroups/:userGroupIDs",params:{userGroupIDs:"@userGroupIDs",tags:"@tags"},method:"POST"},unbindTag:{url:MyAPIs.TAG+"/:tags/userGroups/:userGroupIDs",params:{userGroupIDs:"@userGroupIDs"},method:"DELETE"},getTags:{url:MyAPIs.TAG+"/userGroup/:userGroupID",params:{userGroupID:"@userGroupID"},method:"GET",isArray:!0},getThings:{url:MyAPIs.THING+"/userGroup/:userGroupID",params:{userGroupID:"@userGroupID"},method:"GET",isArray:!0}});return r}]).factory("$$Thing",["$resource",function(e){var r=e(MyAPIs.THING+"/:globalThingID",{},{getGateways:{url:MyAPIs.THING+"/gateway",method:"GET",isArray:!0},save:{url:MyAPIs.THING,params:{globalThingID:"@globalThingID"},method:"POST"},getAll:{url:MyAPIs.THING+"/search",method:"GET",isArray:!0},remove:{method:"DELETE"},bindTags:{url:MyAPIs.THING+"/:thingids/tags/custom/:tags",params:{thingids:"@things",tags:"@tags"},method:"POST"},removeTags:{url:MyAPIs.THING+"/:things/tags/custom/:tags",params:{things:"@things",tags:"@tags"},method:"DELETE"},byTag:{url:MyAPIs.THING+"/search?tagType=:tagType&displayName=:displayName",params:{tagType:"@tagType",displayName:"@displayName"},method:"GET",isArray:!0},byType:{url:MyAPIs.THING+"/types/:typeName",params:{typeName:"@typeName"},method:"GET",isArray:!0},sendCommand:{url:MyAPIs.THING_IF+"/command/",method:"POST",isArray:!0},getTypeByTag:{method:"GET",url:MyAPIs.THING+"/types/fulltagname/:fullTagNames",isArray:!0,params:{fullTagNames:"@fullTagNames"}},getTriggers:{method:"GET",url:MyAPIs.TRIGGER+"/things/:globalThingID",isArray:!0,params:{globalThingID:"@globalThingID"}},getOnboardingInfo:{method:"GET",url:MyAPIs.ONBOARDING+"/:vendorThingID",params:{vendorThingID:"@vendorThingID"}},getEndNodes:{url:MyAPIs.THING+"/:globalThingID/endnodes",params:{globalThingID:"@globalThingID"},method:"GET",isArray:!0},getEndNode:{url:MyAPIs.CLOUD_THING_IF+"/apps/:kiiAppID/targets/THING::thingID/states",params:{thingID:"@thingID",kiiAppID:"@kiiAppID"},headers:{Authorization:"Bearer c63Z840BhnyLgyL6TAoKeq0iGdUM6L1vZemenWrWjxc"},method:"GET"},replaceEndNode:{url:MyAPIs.CLOUD_THING_IF+"/apps/:kiiAppID/things/:kiiThingID/end-nodes/:thingID",params:{thingID:"@thingID",kiiAppID:"@kiiAppID",kiiThingID:"@kiiThingID"},headers:{Authorization:"Bearer c63Z840BhnyLgyL6TAoKeq0iGdUM6L1vZemenWrWjxc"},transformRequest:function(e){return e=_.clone(e),_.each(e,function(r,t){"endNodeVendorThingID"!=t&&"endNodePassword"!=t&&delete e[t]}),JSON.stringify(e)},method:"PATCH"},removeEndNode:{method:"DELETE",url:MyAPIs.CLOUD_THING_IF+"/apps/:kiiAppID/things/:kiiThingID/end-nodes/:thingID",params:{thingID:"@thingID",kiiAppID:"@kiiAppID",kiiThingID:"@kiiThingID"},headers:{Authorization:"Bearer c63Z840BhnyLgyL6TAoKeq0iGdUM6L1vZemenWrWjxc"}},getCommands:{method:"POST",url:MyAPIs.THING_IF+"/command/list",isArray:!0},getThingsByLocationType:{url:MyAPIs.REPORTS+"/thingQuery",method:"POST",isArray:!0},getThingsByIDs:{url:MyAPIs.THING+"/queryDetailByIDs",method:"POST",isArray:!0}});return r}]).factory("$$Tag",["$resource",function(e){var r=e(MyAPIs.TAG+"/:id",{id:"@tagName"},{query:{method:"GET"},queryAll:{url:MyAPIs.TAG+"/search?tagType=Custom",method:"GET",isArray:!0},create:{url:MyAPIs.TAG+"/custom",method:"POST"},update:{url:MyAPIs.TAG+"/custom",method:"POST"},remove:{url:MyAPIs.TAG+"/custom/:id",params:{id:"@tagName"},method:"DELETE"}});return r}]).factory("$$Location",["$resource",function(e){var r=e(MyAPIs.TAG+"/:id",{id:"@tagName"},{queryAll:{method:"GET",isArray:!0,url:MyAPIs.TAG+"/search?tagType=Location"},getTopLevel:{method:"GET",url:MyAPIs.LOCATION_TAGS+"/topLevel",isArray:!0,cache:!0},getSubLevel:{method:"GET",url:MyAPIs.LOCATION_TAGS+"/:location/subLevel",params:{type:"@location"},isArray:!0,cache:!0},getThingsByLocation:{method:"GET",url:MyAPIs.LOCATION_TAGS+"/:location/things",params:{type:"@location"},isArray:!0},getParent:{method:"GET",url:MyAPIs.LOCATION_TAGS+"/:location/parent",isArray:!0}});return r}]).factory("$$Type",["$resource",function(e){var r=e(MyAPIs.TYPE,{},{getAll:{method:"GET",isArray:!0,cache:!0},getSchema:{url:MyAPIs.SCHEMA+"?thingType=:type&name=:type&version=1",method:"GET",cache:!0},saveSchema:{url:MyAPIs.SCHEMA,method:"POST"},updateSchema:{url:MyAPIs.SCHEMA+"/:id",method:"PUT",params:{id:"@id"}},byTags:{url:MyAPIs.TYPE+"/fulltagname/:tags",params:{tags:"@tags"},method:"GET",isArray:!0}});return r}]).factory("$$Permission",["$resource",function(e){var r=e(MyAPIs.PERMISSION,{},{get:{url:MyAPIs.SYSTEM_PERMISSION,method:"GET"}});return r}]).factory("$$Supplier",["$resource",function(e){var r=e(MyAPIs.SUPPLIER,{},{getAll:{url:MyAPIs.SUPPLIER+"/all",method:"GET",isArray:!0}});return r}]).factory("$$Trigger",["$resource",function(e){var r=e(MyAPIs.TRIGGER,{},{getAll:{url:MyAPIs.TRIGGER+"/all",method:"GET",isArray:!0,transformResponse:function(e){return e=JSON.parse(e),e=_.reject(e,function(e){return e.type==r.TypeEnum.SIMPLE&&e.source&&e.source.thingID?!0:!1})}},get:{url:MyAPIs.TRIGGER+"/:triggerID",method:"GET"},save:{url:MyAPIs.TRIGGER+"/createTrigger",method:"POST"},remove:{url:MyAPIs.TRIGGER+"/:triggerID",method:"DELETE"},enable:{url:MyAPIs.TRIGGER+"/:triggerID/enable",method:"PUT",params:{triggerID:"@triggerID"}},disable:{url:MyAPIs.TRIGGER+"/:triggerID/disable",method:"PUT",params:{triggerID:"@triggerID"}}});return r.TypeEnum={SIMPLE:"Simple",GROUP:"Group",SUMMARY:"Summary"},r}]),angular.module("BigScreen.Portal").controller("PortalController",["$scope","$rootScope","$state","AppUtils","PortalService","SessionService","$interval",function(e,r,t,a,i,s,o){function n(){if(e.rotation)for(var r=0,a=e.portalNavs.length;a>r;r++)if(e.portalNavs[r].isActive)return void t.go(a-1>r?e.portalNavs[r+1].state.name:e.portalNavs[0].state.name)}function l(){for(var r,a=0,i=e.portalNavs.length;i>a;a++)r=e.portalNavs[a],r.isActive=r.state.name==t.current.name;e.current=t.current}var c=s.getPortalAdmin();c||t.go("app.Secure"),e.portalNavs=i.getPortalNavs(),e.getStateChan=i.getStateChan,e.getStateDisplayName=i.getStateDisplayName,e.isActive=i.isActive,e.time=new Date,e.current=t.current,e.menuOff=!1,e.rotation=!0,l(),e.turnOffMenu=function(){e.menuOff=!0},e.turnOnMenu=function(){e.menuOff=!1},e.toggleMenu=function(){e.menuOff=!e.menuOff},e.getName=function(){},e.changeNav=function(r){e.isOpen=!1,t.go(r.state.abstract?r.state.redirectTo:r.state.name,t.params)};var u=36e5;o(function(){e.time=moment().startOf("minute").valueOf(),e.time%u===0&&r.$broadcast("theHour"),n()},6e4),r.$watch("portalNavs",function(r){r&&0!=r.length?e.turnOffMenu():e.turnOnMenu()},!0),r.$on("$stateChangeSuccess",function(){l()})}]),function(){var e=appConfig[appConfig.ENV].siteUrl;window.thirdPartyAPIUrl=appConfig[appConfig.ENV].thirdPartyAPIUrl,window.thirdPartyAPIKey=appConfig[appConfig.ENV].thirdPartyAPIKey;var r=appConfig[appConfig.ENV].cloudUrl,t=e+"/api";window.MyAPIs={LOCATION_TAGS:"/locationTags",OPERATOR:"/oauth2",USER:"/users",USER_MANAGER:"/usermanager",USER_GROUP:"/usergroup",THING:"/things",TAG:"/tags",TYPE:"/things/types",PERMISSION:"/permission",TRIGGER:"/triggers",THING_IF:"/thing-if",ONBOARDING:"/onboardinghelper",SUPPLIER:"/devicesuppliers",SYSTEM_PERMISSION:"/sys/permissionTree",USER_SYNC:"/usersync",SCHEMA:"/industrytemplate",REPORTS:"/reports"};for(var a in window.MyAPIs)window.MyAPIs[a]=t+window.MyAPIs[a];window.MyAPIs.CLOUD_THING_IF=r+"/thing-if",window.webSocketPath=appConfig[appConfig.ENV].wsUrl;var i="Beehive";window.AppTags={USER:i+"USER",PERMISSION:i+"PERMISSION"},window.pageListMaxLength=20,window.siteUrl=e}(),angular.module("BigScreen.AppShared").factory("AppUtils",["$rootScope","$http","$location","$q","$state","$timeout","$uibModal","AppConfig",function(e,r,t,a,i,s,o,n){return window.app={},app.utils={requestInProcess:0,storagePrefix:n.StoragePrefix+".",initialize:function(){this._initialize()},_initialize:function(){this._IEPlaceholder(),e._=_,String.prototype.lowerFirstLetter=function(){return this.charAt(0).toLowerCase()+this.slice(1)},Array.prototype.removeFirst=function(){return this.slice(1,this.length)},Array.prototype.remove=function(e){var r=this.indexOf(e);return r>-1?this.splice(r,1):this}},_IEPlaceholder:function(){var e=document,r=e.getElementsByTagName("input"),t="placeholder"in e.createElement("input"),a=function(e){var r=e.getAttribute("placeholder"),t=e.defaultValue;""==t&&(e.value=r),$(e).on("focus",function(){e.value===r&&(this.value="")}),$(e).on("blur",function(){""===e.value&&(this.value=r)})};if(!t)for(var i=0,s=r.length;s>i;i++){var o=r[i],n=o.getAttribute("placeholder");"text"!==o.type&&"password"!==o.type||!n||a(o)}},setLocalStorageItem:function(e,r){localStorage.setItem(this.storagePrefix+e,JSON.stringify(r))},getLocalStorageItem:function(e){return $.parseJSON(localStorage.getItem(this.storagePrefix+e))},getSessionItem:function(e){return $.parseJSON(sessionStorage.getItem(this.storagePrefix+e))},setSessionItem:function(e,r){sessionStorage.setItem(this.storagePrefix+e,JSON.stringify(r))},clearSession:function(){sessionStorage.clear()},removeSessionItem:function(e){sessionStorage.removeItem(this.storagePrefix+e)},doLoading:function(){this.requestInProcess++,this.showLoading()},whenLoaded:function(){this.requestInProcess--,0==this.requestInProcess&&this.hideLoading()},showLoading:function(){$("#spinner").show()},hideLoading:function(){$("#spinner").hide()},alert:function(e,r){r=r||"提示";var t="";t+='<div class="modal-content">',t+='  <div class="modal-header ng-scope">',t+='      <h3 class="modal-title">'+r+"</h3>",t+="  </div>",t+='  <div class="modal-body clearfix">',t+='    <div class="col-sm-12">',t+="      "+e,t+="    </div>",t+="  </div>",t+='  <div class="modal-footer ng-scope">',t+='      <button class="btn btn-primary" style="width:100%;" type="button" ng-click="ok()">Ok</button>',t+="  </div>",t+="</div>";var a=o.open({animation:!0,template:t,controller:["$scope","$uibModalInstance",function(e,r){e.ok=function(){r.dismiss("cancel")}}],size:"sm"});return a.result},confirm:function(e,r,t){var a="";a+='<div class="modal-content">',a+='  <div class="modal-header ng-scope">',a+='      <h3 class="modal-title">'+e+"</h3>",a+="  </div>",a+='  <div class="modal-body clearfix">',a+='    <div class="col-sm-12">',a+="      "+r,a+="    </div>",a+="  </div>",a+='  <div class="modal-footer ng-scope">',a+='      <button class="btn btn-primary" type="button" ng-click="ok()">Confirm</button>',a+='      <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>',a+="  </div>",a+="</div>";var i=o.open({animation:!0,template:a,controller:["$scope","$uibModalInstance","func",function(e,r,t){e.ok=function(){angular.isFunction(t)?r.close(t()):r.dismiss("cancel")},e.cancel=function(){r.dismiss("cancel")}}],size:"sm",resolve:{func:function(){return t}}});return i.result}},app.utils}]),angular.module("BigScreen").controller("AppController",["$scope",function(){}]),angular.module("BigScreen").config(["$stateProvider","$urlRouterProvider",function(e,r){e.state("app",{url:"",templateUrl:"app/app.html",controller:"AppController","abstract":!0}).state("app.Secure",{url:"/Secure",templateUrl:"app/components/Secure/Secure.html",controller:"SecureController"}).state("app.Portal",{url:"/Portal",templateUrl:"app/components/Portal/Portal.html",controller:"PortalController"}),r.otherwise("Secure")}]),angular.module("BigScreen.Portal").config(["$stateProvider","$urlRouterProvider",function(e){e.state("app.Portal.Welcome",{url:"/Welcome",templateUrl:"app/components/Portal/Welcome/Welcome.html",controller:"WelcomeController",getName:function(){return"Welcome"}}).state("app.Portal.OfficeSpace",{url:"/OfficeSpace",templateUrl:"app/components/Portal/OfficeSpace/OfficeSpace.html",controller:"OfficeSpaceController",getName:function(){return"办公空间总览"}}).state("app.Portal.Environment",{url:"/Environment",templateUrl:"app/components/Portal/Environment/Environment.html",controller:"EnvironmentController",getName:function(){return"办公环境监控"}}).state("app.Portal.OfficeUsage",{url:"/OfficeUsage",templateUrl:"app/components/Portal/OfficeUsage/OfficeUsage.html",controller:"OfficeUsageController",getName:function(){return"会议室"}}).state("app.Portal.ParkingArea",{url:"/ParkingArea",templateUrl:"app/components/Portal/ParkingArea/ParkingArea.html",controller:"ParkingAreaController",getName:function(){return"智能停车场"}})}]),angular.module("BigScreen").run(["$templateCache",function(e){e.put("app/app.html",'<div ng-init="init()"><div id="spinner" style="display:none;"><div class="loader">Loading...</div></div><div ui-view=""></div></div>'),e.put("app/components/Portal/Portal.html",'<main class="app-portal"><div class="header-bar"><div class="title">{{current.getName()}}</div><div class="menu" uib-dropdown="" is-open="isOpen" auto-close="outsideClick"><div uib-dropdown-toggle=""></div><ul class="dropdown-menu" uib-dropdown-menu="" role="menu" aria-labelledby="single-button"><li class="menuitem" ng-repeat="nav in portalNavs" ng-class="{\'active\':nav.isActive}"><a ng-click="changeNav(nav)"><i class="fa fa-fw" ng-class="nav.icon"></i> {{nav.name}}</a></li><li class="divider"></li><li role="menuitem" class="switch"><span>轮播:</span><switchery ng-model="rotation"></switchery></li></ul></div><div class="time">{{time | date:\'EEE MMM d H:mm\'}}</div></div><div class="al-main"><div class="al-content"><div ui-view="" class="container-fluid portal-content-body"></div></div></div></main>'),e.put("app/components/Secure/Secure.html",""),e.put("app/components/Portal/Environment/Environment.html",'<div class="app-portal-environment" ng-init="init()"><div class="pull-left"><div class="wrap title-wrap">用电量</div><div class="wrap electricity-wrap"><div class="pull-left"><span class="helper"></span> <img src="images/icon_electricity.png" height="216" width="405" alt=""></div><div class="pull-left bar-wrap"><div class="bar"><span class="desc">照明+空调</span> <span class="value">120 W</span><div class="progress"><div class="progress-bar light" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%"></div></div></div><div class="bar"><span class="desc">插座</span> <span class="value">588 W</span><div class="progress"><div class="progress-bar socket" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%"></div></div></div></div></div><div class="wrap population-wrap"><div class="pull-left population"><div class="title">办公室人员</div><div class="people"><div class="text">员工 /100</div><div class="people-bar"><div class="people-container"><div class="number">888</div><img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""></div></div></div><div class="people"><div class="text">访客 /40</div><div class="people-bar"><div class="people-container"><div class="number gray">100</div><img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""> <img src="images/icon_person.png" width="23" height="57" alt=""></div></div></div></div><div class="pull-left usage"><div class="tip pull-left">空间利用率 /100%</div><div id="population-chart" class="pull-left"></div></div></div></div><div class="pull-right air-wrap"><div class="title">办公室空气质量</div><div class="type temp"><div class="text">温度 舒适/24℃</div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%"></div></div></div><div class="type co2"><div class="text">CO2含量 优/10%</div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%"></div></div></div><div class="type pm25"><div class="text">PM2.5 优/31</div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%"></div></div></div><div class="foot"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> 智能模式已启动，为您自动调适最舒适环境</div></div></div>'),e.put("app/components/Portal/OfficeSpace/OfficeSpace.html",'<div class="app-portal-officespace"><img class="bg" src="images/bg_officespace.png" alt=""><div class="room-row"><app-room ng-repeat="r in firstRooms" room="r"></app-room></div><div class="room-row second"><app-room ng-repeat="r in secondRooms" room="r" class="sm"></app-room></div></div>'),e.put("app/components/Portal/OfficeUsage/OfficeUsage.html",'<div class="app-portal-officeusage"><div class="column-wrap"><div class="column" ng-repeat="room in rooms"><app-meeting-room room="room"></app-meeting-room></div></div><img src="images/icon_description.png" width="550" height="70" alt=""></div>'),e.put("app/components/Portal/ParkingArea/ParkingArea.html",'<div class="app-portal-parkingarea" ng-init="init()"><div class="row"><img src="images/icon_clock.png" height="36" width="36" alt=""><div class="hint"><div class="title">离开停车场 - 驶出停车场</div><div class="remark">每月平均 <span>12分钟</span></div><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%"></div></div></div><div class="desc"><div><i class="fa fa-exclamation-circle" aria-hidden="true"></i> 记得为下次约会预留时间</div></div></div><div class="row"><img src="images/icon_clock.png" height="36" width="36" alt=""><div class="hint"><div class="title">进出高峰时段</div></div><div class="desc"><div><i class="fa fa-exclamation-circle" aria-hidden="true"></i> 提示您避开车多拥挤时段</div></div></div><div class="row"><div id="parking-chart"></div></div></div>'),e.put("app/components/Portal/Welcome/Welcome.html","<div class=\"app-portal-welcome\"><h3>{{'Common.Hello'}}</h3></div>"),e.put("app/components/AppShared/directives/meeting-room/meeting-room.html",'<div class="meeting-room" ng-class="{\'busy\': room.busy}"><div class="room-head"><div class="name"><div class="title">{{room.name}}</div><div class="id">{{room.id}}</div></div><div class="status"></div></div><div class="room-body"><ul><li>15:00-16:00</li><li>16:00-17:00</li></ul></div><div class="room-foot"><div class="icon-wrap"><div class="icon light"></div><div class="vl"></div><div class="icon air"></div><div class="vl"></div><div class="icon person"></div></div></div></div>'),e.put("app/components/AppShared/directives/room/room.html",'<div class="room" ng-class="room.type"><div class="icon light" ng-class="{\'off\': !room.light}"><i></i><span>维修中!</span></div><div class="icon air" ng-class="{\'off\': !room.fan}"><i></i><span>维修中!</span></div><div class="icon person" ng-class="{\'off\': room.empty}"><i></i></div><div class="name">{{room.name}}</div></div>'),e.put("app/components/AppShared/directives/switchery/switchery.template.html",'<div class="switchery pull-right" ng-class="{\'on\':reverse?!on: on}" ng-click="switch()"><div class="selector"><div class="option">{{yesText}}</div><div class="option">{{noText}}</div></div><div class="slider"><div class="dile"></div><div class="dile"></div><div class="dile"></div></div></div>')
}]);