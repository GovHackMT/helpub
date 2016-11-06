/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var MainPage = function (page) {
    var thiz = this;
    thiz.page = page;
    thiz.call = "";

    this.getEl = function (selector) {
        return thiz.page.find(selector);
    }

    this.back = function (cb) {
        cb();
    }

    this.init = function () {

        thiz.page.click(".icon-calls.pic", function () {

            $$this = $$(this);
            navigator.camera.cleanup();
            thiz.call = $$this.data("sigla");
            navigator.camera.getPicture(thiz.cameraSuccess, thiz.cameraError, { destinationType: Camera.DestinationType.DATA_URL });

            // CameraPreview.startCamera();
        });

        thiz.page.click(".icon-calls.no-pic", function () {

            $$this = $$(this);
            var st;
            thiz.call = $$this.data("sigla");
            helpubApp.confirm("Deseja realmente confirmar esse chamado?</br></br> Será enviada em <span id='send-time'>0:08</span>.", "<b>Atenção!</b>",
                function () {
                    clearInterval(st);
                    thiz.salvarChamado();
                }
                , function () {
                    clearInterval(st);
                });

            var count = 8;
            st = setInterval(function () {
                count = count - 1;
                if (count > 0) {
                    $$("#send-time").text("0:0" + count);
                } else {
                    $$(".modal-buttons").find("span").eq(1).click();
                }
            }, 1000);

            // CameraPreview.startCamera();
        });

        $$("body").on("click", "#btn-send", function () {
            thiz.salvarChamado($$("#txt-send").val(), $$("#img-send").attr("src"));
        });

        //   usuario/autenticar cpf senha 03148471113
        thiz.page.click(".btn-login", function () {

            helpubApp.modalLogin("Informe o cpf/senha", 'Login', function (username, password) {
                toolkit.showLoad();
                if (username != "" && password != "") {
                    toolkit.restRequest({
                        url: "usuario/autenticar",
                        method: "POST",
                        data: {
                            cpf: username,
                            senha: password
                        },
                        done: function (res, status, xhr) {
                            toolkit.hideLoad();
                            if (res.status) {
                                var user = res.data[0];
                                if (appVars.appSession == null) {
                                    dbHandler.insertAppSession({
                                        userId: user.idusuario,
                                        auth: user.cpf,
                                        userName: user.nomecompleto
                                    }, function () {
                                        location.reload();
                                    });
                                  
                                } else {
                                    dbHandler.updateAppSession({
                                        userId: user.idusuario,
                                        auth: user.cpf,
                                        userName: user.nomecompleto
                                    }, function () {
                                        location.reload();
                                    });
                                }

                                appVars.appSession = {
                                    userId: user.idusuario,
                                    auth: user.cpf,
                                    userName: user.nomecompleto
                                };

                            } else {
                                helpubApp.alert('CPF e/ou senha inválidos', "Atenção!");
                            }

                        },
                        fail: function (err) {
                            helpubApp.alert('Erro ao realizar o login. Por favor, tente novamente.', "Opss!");
                            console.log(err);
                        }
                    }, null, 3000);
                } else {
                    helpubApp.alert('CPF e/ou senha inválidos', "Atenção!");
                }
            });
        });

    }

    this.salvarChamado = function (texto, img) {
        toolkit.showLoad();
        toolkit.getCurrentPosition(function (err, coords) {
            window.plugins.sim.getSimInfo(function (result) {
                toolkit.restRequest({
                    url: "chamado/salvar",
                    method: "POST",
                    data: {
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                        phoneNumber: result.simSerialNumber,
                        deviceId: result.deviceId,
                        idusuario: appVars.appSession == null ? "" : appVars.appSession.userId,
                        description: texto || '',
                        type: thiz.call,
                        img: img || ''
                    },
                    done: function (res, status, xhr) {
                        toolkit.hideLoad();
                        helpubApp.closeModal(".popup-check");
                        toolkit.addNotification(helpubApp, "Solicitação efetuada!", "csd", 2000);
                    },
                    fail: function (err) {
                        helpubApp.alert("Erro ou realizar a solicitação. Por favor, tente novamente.", "Opss!");
                    }
                });
            });
        });
    }

    this.cameraSuccess = function (imageData) {
        navigator.camera.cleanup();
        helpubApp.popup('.popup-check');
        $$("#img-send").attr("src", "data:image/jpeg;base64," + imageData);
    }
    /*
   
    */
    this.cameraError = function () {
        navigator.camera.cleanup();
    }


};