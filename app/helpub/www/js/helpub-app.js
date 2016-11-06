var helpubApp;
var mainView;
var w = window.innerWidth;
var h = window.innerHeight;

function buildMenu() {

    if (appVars.appSession != null) {
        var panelLeftTemplate = $$('script#panelLeftTemplate').html();
        var panelLeftCompiledTemplate = Template7.compile(panelLeftTemplate);
        $$("body").append(panelLeftCompiledTemplate({
            userName: appVars.appSession.userName,
            pictureProfile: toolkit.getFullFilePath(appVars.appSession.pictureProfile)
        }));
    }

    //example
    $$(document).click("#mni-config", function () {
        appSharedPages.loadConfig();
    });
    
}

function initNerdSpell() {

    // window.open = cordova.InAppBrowser.open;

    document.addEventListener("offline", function () {
        if (helpubApp) {
            toolkit.addNotification(helpubApp, appVars.mainLang.general.noConnection, "noconnetion");
        }
    }, false);
    //example
    document.addEventListener("backbutton", function () {
        if (mainView != undefined) {

            if ($$(".popup-match").length) {
                helpubApp.closeModal('.popup-match');
                return;
            }
        }
    }, false);

    $$(document).click("[data-browser]", function () {
        window.open($$(this).data('browser'), '_blank', 'location=yes');
    });

    $$(document).click(".open-panel", function () {
        // alert(1)
        //CameraPreview.hide();
    });


    $$(document).click("#logout", function () {
        helpubApp.confirm("Deseja realmente sair do helpub?", "<b>Atenção!</b>",
                function () {
                    dbHandler.deleteUser(function () {
                        location.reload()
                    });
                }, function () {
                    clearInterval(st);
                });
    });


    $$(document).click("#calls", function () {
        appSharedPages.loadCalls();
    });


    toolkit.initalLoad(function () {
        //example
        var pages = {
            index: {
                init: function (page) {
                    var $$page = $$(page.container);
                    toolkit.loadLocalJsFile("js/main.js", function () {
                        window.mainPage = new MainPage($$page);
                        window.mainPage.init();
                    });
                }
            },
            config: {
                init: function (page) {
                    toolkit.loadLocalJsFile("js/config.js", function () {
                        var $$page = $$(page.container);
                        window.configPage = new ConfigPage($$page);
                        window.configPage.init();
                    });
                },
                back: function () {
                    window.configPage.back(function (reload) {
                        if (reload) {
                            setTimeout(function () {
                                helpubApp.alert(appVars.mainLang.config.restartMsg, "Nerd Spell", function () {
                                    navigator.splashscreen.show();
                                    location.reload();
                                });
                            }, 1000);
                        } else {
                            toolkit.rmLocalJsFile("js/config.js");
                            window.configPage = null;
                        }
                    });
                }
            },
            register: {
                init: function (page) {
                    var $$page = $$(page.container);
                    toolkit.loadLocalJsFile("js/register.js", function () {
                        window.registerPage = new RegisterPage($$page);
                        window.registerPage.init();
                    });
                }
            },
            calls: {
                init: function (page) {
                    var $$page = $$(page.container);
                    toolkit.loadLocalJsFile("js/calls.js", function () {
                        window.callsPage = new CallsPage($$page);
                        window.callsPage.init();
                    });
                }
            }
        };


        if (appVars.appSession != null) {
            $$(".action-btn").hide();
            $$(".no-pic").css("display", "inline-block");
        } else {
            $$(".action-btn").show();
            $$(".no-pic").hide();
        }

        Template7.global = {
            str: appVars.mainLang,
            lang: appVars.lang,
            isAndroid: window.device.platform == 'Android',
            isIOS: window.device.platform != 'Android'
        };

        // Let's register Template7 helper so we can pass json string in links
        Template7.registerHelper('json_stringify', function (context) {
            return JSON.stringify(context);
        });

        // Initialize your app
        helpubApp = new Framework7({
            material: window.device.platform == 'Android',
            animateNavBackIcon: true,
            // swipePanel: 'left',
            tapHold: true,
            precompileTemplates: false,
            template7Pages: true,
            init: false,
            modalButtonCancel: appVars.mainLang.general.cancel,
            template7Data: {
                'url:config.html': {},
                'url:register.html': {},
                'url:calls.html': {}
            }

        });

        document.addEventListener('pageInit', function (e) {
            var page = e.detail.page;
            var pageInit = pages[page.name];
            if (pageInit != undefined) {
                pageInit.init(page);
            }
        });

        document.addEventListener('pageBack', function (e) {
            var page = e.detail.page;
            var pageBack = pages[page.name];
            if (pageBack != undefined) {
                if (pageBack.back != undefined)
                    pageBack.back(page);
            }
        });

        helpubApp.init();
    
        // Add main View
        mainView = helpubApp.addView('.view-main', {
            domCache: true
        });

      
        setTimeout(function () {
            navigator.splashscreen.hide();
        }, 600);

    });
}

//This pages are only accessed after that all app was loaded calls.html
var appSharedPages = {
    loadConfig: function () {
        mainView.router.load({
            url: 'config.html',
            context: {
                byMale: appVars.appSession.findMale,
                byFemale: appVars.appSession.findFemale,
                inKm: appVars.appSession.isDistanceKm,
                inMile: !appVars.appSession.isDistanceKm,
                miValue: appVars.appSession.distanceLimit,
                kmValue: appVars.appSession.distanceLimit,
                startAge: appVars.appSession.startAge,
                endAge: appVars.appSession.endAge
            }
        });
    },
    loadCalls: function () {

        toolkit.showLoad();
        window.plugins.sim.getSimInfo(function (result) {
            toolkit.restRequest({
                url: "usuario/listar-solicitacoes",
                method: "GET",
                data: {
                    deviceid: result.deviceId,
                    phonenumber: result.simSerialNumber || '',
                    cpf: appVars.appSession == null ? 0 : appVars.appSession.auth
                },
                done: function (res, status, xhr) {
                    toolkit.hideLoad();
                    var newArr = [];

                    for(var i = 0; i < res.length;i ++){
                        var value = res[i];
                        if(value.situacao == 'A') {
                            value.situacaotexto = "Em aberto";
                        } else if(value.situacao == 'E') {
                            value.situacaotexto = "Em andamento";
                        }  else if(value.situacao == 'C') {
                            value.situacaotexto = "Cancelado";
                        } else if(value.situacao == 'F') {
                            value.situacaotexto = "Finalizado";
                        }

                        value.datacadastro = toolkit.formatISODate(value.datacadastro);
                        value.dataatendimento = toolkit.formatISODate(value.dataatendimento);
                        value.datacancelamento = toolkit.formatISODate(value.datacancelamento);
                        value.datafechamento = toolkit.formatISODate(value.datafechamento);

                        newArr.push(value); 
                    }

                    mainView.router.load({
                        url: 'calls.html',
                        context: {
                            list: newArr
                        }
                    });  
                },
                fail: function (err) {
                }
            });

        });
    }
}