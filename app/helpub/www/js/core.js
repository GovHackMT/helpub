
$$ = Dom7;
var appVars = {};
var showSlowConnectionMsg = true;

var config = {
    //SERVER_HOST: "http://192.168.0.135:8001",
    //o FILE_SERVER_HOST: "http://10.1.1.26:8008",
    SERVER_HOST: "http://172.16.14.146:5001",
    FILE_SERVER_HOST: "https://helpub.com:448",
    FILE_SERVER_SECRET_KEY: "5f774c12-ce80-4bef-9c25-498910c45f52",
    AUTHORIZATION_PREFIX: "4dc15b34-cff6-4640-af9c-b1de7642ba04",
    API_SECRET_KEY: "69534a5b-28aa-40f5-909a-447ef1e3e645",
    API_KEY: "621e36a9-4d62-4d0d-9e84-c8a61577598b",
}

var toolkit = {
    animateElement: function (el, x, cb) {
        $$(el).removeClass(x + ' animated').addClass(x + ' animated').once('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $$(el).removeClass(x + ' animated');
            if (cb)
                cb();
        });
    },
    getDescendantProp: function (obj, desc) {
        var arr = desc.split(".");
        while (arr.length && (obj = obj[arr.shift()]))
            ;
        return obj;
    },
    generateHmacHash: function (timestamp, data) {
        var strData = decodeURIComponent($$.serializeObject(data));
        var words = CryptoJS.HmacSHA256((strData ? strData : "") + timestamp, config.API_SECRET_KEY);
        var hash = CryptoJS.enc.Base64.stringify(words);
        return hash;
    },
    generateFileHash: function (timestamp, data) {
        var words = CryptoJS.HmacSHA256(timestamp + appVars.appSession.auth, config.FILE_SERVER_SECRET_KEY);
        var hash = CryptoJS.enc.Base64.stringify(words);
        return hash;
    },
    fileUploadImage: function (fileURL, params, cb) {

        function win(r) {
            var res = JSON.parse(r.response);
            if (res.status) {
                cb(null, config.FILE_SERVER_HOST + res.uri)
            } else {
                cb(true, null)
            }
        }

        function fail(error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }

        var uri = encodeURI(config.FILE_SERVER_HOST + "/main/upload-image");

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        var type = fileURL.substr(fileURL.lastIndexOf('.') + 1)
        if (type == 'jpg') {
            type = "jpeg";
        }
        options.mimeType = "image/" + type;
        options.params = params;


        var timestamp = new Date().getTime();
        var headers = {
            'X-Timestamp': timestamp,
            'Authorization': appVars.appSession.auth,
            'Hmac-Hash': toolkit.generateFileHash(timestamp)
        };

        options.headers = headers;
        var ft = new FileTransfer();
        ft.onprogress = function (progressEvent) {
        };
        ft.upload(fileURL, uri, win, fail, options);

    },
    fileUploadAudio: function (b64, cb) {

        var timestamp = new Date().getTime();
        var headers = {
            'X-Timestamp': timestamp,
            'Authorization': appVars.appSession.auth,
            'Hmac-Hash': toolkit.generateFileHash(timestamp)
        };

        $$.ajax({
            url: config.FILE_SERVER_HOST + "/main/upload-audio",
            method: "POST",
            cache: false,
            dataType: "jsonp",
            headers: headers,
            crossDomain: true,
            data: { b64: b64 },
            success: function (res, status, xhr) {
                res = res != undefined ? JSON.parse(res) : {};
                if (res.status) {
                    cb(null, res.uri)
                } else {
                    cb(true, null)
                }
            },
            error: function (xhr, status) {
                cb(true, null);
            }
        });

    },
    restRequest: function (objReq, auth, timeout, countRetry) {

        var fcNoConnection = function () {
            if (helpubApp) {
                toolkit.addNotification(helpubApp, appVars.mainLang.general.noConnection, "noconnetion");
            } else {
                toolkit.loadNoConnectionBox();
            }
        }

        var networkState = navigator.connection.type;

        if (networkState != "none") {
            var timestamp = new Date().getTime();
            if (!objReq.url || !objReq.method) {
                console.log("Parameters not found.");
                return;
            }

            var headers = {};

            var headers = {
                'Api-Secret-Key': config.API_SECRET_KEY,
                'Api-Key': config.API_KEY
            };


            if (timeout) {
                timeout += 4000;
            }
           
            $$.ajax({
                url: config.SERVER_HOST + "/" + objReq.url,
                method: objReq.method,
                cache: false,
                dataType: "jsonp",
                headers: headers,
                timeout: timeout || 0,
                crossDomain: true,
                data: objReq.data,
                success: function (res, status, xhr) {
                    if (objReq.done) {
                        res = res != undefined ? JSON.parse(res) : {};
                        objReq.done(res, status, xhr);
                    }

                },
                error: function (xhr, status) {

                    if (status == 'timeout') {
                        if (showSlowConnectionMsg) {
                            showSlowConnectionMsg = false;
                            if (helpubApp) {
                                toolkit.addNotification(helpubApp, appVars.mainLang.general.slowConnection, "slowconnetion", 2000);
                            } else {
                                alert(appVars.mainLang.general.slowConnection);
                            }
                        }

                        countRetry = (countRetry || 0);
                        if (timeout && countRetry <= 3) {
                            toolkit.restRequest(objReq, auth, timeout, countRetry + 1);
                        } else {
                            fcNoConnection();
                        }

                    } else {

                        if (status == 301) {
                            alert(appVars.mainLang.general.criticalUpdateMsg);
                            navigator.app.exitApp();
                        }
                        if (objReq.fail)
                            objReq.fail(status);
                    }
                }

            });

        } else {
            fcNoConnection();
        }

    },
    loadNoConnectionBox: function () {
        var html = ' <div id="box-noconnection">                        ' +
                '   <table class="wrapper">                             ' +
                '     <tr>                                              ' +
                ' 	   <td>                                             ' +
                ' 	      <img src="img/noconnection.png">              ' +
                ' 	      <h3>' + appVars.mainLang.general.noConnection + '</h3>' +
                ' 	   </td>                                            ' +
                ' 	</tr>                                               ' +
                '   <table>                                             ' +
                ' </div>                                                ';

        $$('body').append(html);
        navigator.splashscreen.hide();
    },
    initalLoad: function (cb) {

        var subFuncLoadLang = function () {
            // var curLang = ToolkitBridge.currentLang();
            var momentLang = {}
            var mainLang = {}
            var curLang = appVars.lang;

            if (curLang != "pt-BR") {
                curLang = "en-GB"
            }

            if (curLang == "pt-BR") {

                mainLang = {
                    general: {
                        slogan: '"Conectando Pessoas Nerds!!"',
                        noConnection: "Sem conexão. Tente novamente mais tarde.",
                        noConnectionShort: "Sem conexão.",
                        retry: "Repetir",
                        You: "Você",
                        and: "e",
                        seeProfile: "Ver perfil",
                        settings: "Configurações",
                        progress: "Progresso",
                        yes: "Sim",
                        no: "Nao",
                        unexpectedError: "Erro inesperado com a conexão do servidor.",
                        writeYourDenounce: "Escreva sua denúncia aqui...",
                        denounce: "Denúncia",
                        other: "Outro",
                        today: "Hoje",
                        partners: "Parceiros",
                        cancel: "Cancelar"
                    },
                    config: {
                    }
                };

            } else {
                //Inglês aqui
                mainLang = {
                    general: {
                        slogan: '',
                        noConnection: "",
                        noConnectionShort: "",
                        retry: "",
                        You: "",
                        and: "",
                        seeProfile: "",
                        settings: "",
                        progress: "",
                        yes: "",
                        no: "",
                        unexpectedError: "",
                        writeYourDenounce: "",
                        denounce: "",
                        other: "",
                        today: "",
                        partners: "",
                        cancel: "Cancel"
                    },
                    config: {
                    }
                };
            }

            if (typeof moment !== 'undefined') {
                moment.locale('default', momentLang);
                moment.locale("default");
            }
            appVars.mainLang = mainLang;
        };

        toolkit.getPreferredLanguage(function (err, lang) {
            appVars.lang = lang;
            subFuncLoadLang();
            toolkit.requestRuntimePermissions(function () {
                toolkit.loadDB(function (db) {
                    appVars.db = db;
                    dbHandler.connect(function (err, db) {
                        if (err) {
                            alert("Unexpected error");
                            return;
                        }

                        dbHandler.readAppSession(function (err, appSession) {
                            appVars.appSession = appSession;
                            cb();
                        });
                    });
                });
            });
        });
    },
    getPreferredLanguage: function (cb) {
        navigator.globalization.getPreferredLanguage(
                function (language) {
                    if (language.value != "pt-BR") {
                        language.value = "en-GB";
                    }
                    cb(null, language.value);
                },
                function () {
                    cb(null, 'en-GB');
                });
    },
    getCurrentPosition: function (cb) {

        var opts = {
            maximumAge: 4000,
            timeout: 15000,
            enableHighAccuracy: true
        }

        var isRetry = false;
        var fcLoc = function () {
            navigator.geolocation.getCurrentPosition(function (position) {
                var coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                cb(null, coords);
            }, function (err) {

                if (!isRetry) {
                    isRetry = true;
                    opts.timeout = 25000;
                    opts.enableHighAccuracy = false;
                    fcLoc();
                    return;
                }

                var coords = {
                    latitude: 0.0,
                    longitude: 0.0
                };

                cb(err, coords);

            }, opts);
        }

        cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
            if (window.device.platform == 'Android') {
                if (enabled) {
                    fcLoc();
                } else {
                    alert(appVars.mainLang.general.enableGps);
                    cordova.plugins.diagnostic.switchToLocationSettings();
                    navigator.app.exitApp();
                }
            } else {
                fcLoc();
            }
        }, function (err) {
            var coords = {
                latitude: 0.0,
                longitude: 0.0
            };
            cb(err, coords);
        });
    },
    requestRuntimePermissions: function (cb) {
        if (window.device.platform == 'Android' && parseFloat(window.device.version) >= 6) {
            cordova.plugins.diagnostic.requestRuntimePermissions(function (statuses) {
                var allPermissionAuthorized = true;
                for (var permission in statuses) {
                    switch (statuses[permission]) {
                        case cordova.plugins.diagnostic.runtimePermissionStatus.GRANTED:
                            console.log("Permission granted to use " + permission);
                            break;
                        case cordova.plugins.diagnostic.runtimePermissionStatus.NOT_REQUESTED:
                            console.log("Permission to use " + permission + " has not been requested yet");
                            break;
                        case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED:
                            console.log("Permission denied to use " + permission + " - ask again?");
                            allPermissionAuthorized = false;
                            break;
                        case cordova.plugins.diagnostic.runtimePermissionStatus.DENIED_ALWAYS:
                            allPermissionAuthorized = false;
                            break;
                    }
                }
                if (allPermissionAuthorized) {
                    cb();
                } else {
                    alert(appVars.mainLang.general.accessDennyMsg);
                    navigator.app.exitApp();
                }
            }, function (error) {
                console.error("The following error occurred: " + error);
            }, [
                cordova.plugins.diagnostic.runtimePermission.ACCESS_FINE_LOCATION,
                cordova.plugins.diagnostic.runtimePermission.ACCESS_COARSE_LOCATION,
                cordova.plugins.diagnostic.runtimePermission.WRITE_EXTERNAL_STORAGE,
                cordova.plugins.diagnostic.runtimePermission.READ_EXTERNAL_STORAGE,
                cordova.plugins.diagnostic.permission.READ_PHONE_STATE
            ]);
        } else {
            cb();
        }
    },
    startPush: function (cb) {

        var push = PushNotification.init({
            android: {
                senderID: "807857178009",
                gcmSandbox: false,
                sound: true,
                clearBadge: true
            },
            ios: {
                alert: true,
                badge: true,
                sound: true,
                clearBadge: true
            },
            windows: {}
        });

        push.on('notification', function (data) {
        });

        push.on('registration', function (data) {
            cb(data.registrationId);
        });

        push.on('error', function (e) {
            cb("NotRegistered");
        });


    },
    getFrontDate: function () {
        var dt = new Date();
        return dt.getDate() + "/" + dt.getMonth() + "/" + dt.getFullYear() + " " + dt.getHours() + ":" + dt.getMinutes() + ":00";
    },
    showLoad: function (text) {
        $$("#main-loader").show();

        if (text) {
            $$("#main-loader-text").html(text);
            $$("#main-loader-text").show();
        } else {
            $$("#main-loader-text").html('');
            $$("#main-loader-text").hide();
        }
    },
    hideLoad: function () {
        $$("#main-loader").hide();
        $$("#main-loader-text").html('');
        $$("#main-loader-text").hide();
    },
    getFullFilePath: function (patialPath) {
        if (!patialPath)
            return "";

        if (patialPath.indexOf("http") >= 0 || patialPath.indexOf("https") >= 0)
            return patialPath;

        return config.FILE_SERVER_HOST + patialPath;
    },
    addNotification: function (app, message, id, hold) {

        var nt = {
            message: message
        };

        if (id) {
            id = "ntf" + id;
            $$("body").find("." + id).remove();
            nt.additionalClass = id;
        }

        if (hold) {
            nt.hold = hold;
        }

        if (window.device.platform != 'Android') {
            nt.title = "Nerd Spell";
        } else {
            nt.button = {
                text: 'OK',
                color: 'red'
            }
        }
        app.addNotification(nt);
    },
    getRelativeDate: function (datetime) {
        var localTime = moment.utc(datetime).toDate();
        return moment(localTime).calendar();
    },
    preloadImgBase64: function (file, fc) {

        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.status == 200 || this.status == 0) {
                var uInt8Array = new Uint8Array(this.response);
                var i = uInt8Array.length;
                var binaryString = new Array(i);
                while (i--) {
                    binaryString[i] = String.fromCharCode(uInt8Array[i]);
                }
                var data = binaryString.join('');
                var base64 = window.btoa(data);
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(file)[1];
                var b64 = ("data:image/" + ext + ";base64," + base64);
                fc(b64);
            } else {
                fc(config.FILE_SERVER_HOST + "/static/img/no-image.jpg");
            }
        };
        xhr.onerror = function (e) {
            fc(config.FILE_SERVER_HOST + "/static/img/no-image.jpg");
        };
        xhr.open('get', file, true);
        xhr.responseType = 'arraybuffer';
        xhr.send();

    },
    preLoadImg: function (url, cb) {
        var img = new Image();
        img.src = url;
        if (img.complete) { // If the image has been cached, just call the callback
            img = null;
            if (cb) cb(url);
        } else {
            img.onerror = function () { // If fail to load the image
                img = null;
                if (cb) fcb(url);
            };
            img.onload = function () { // If loaded successfully
                //On IE6, multiple frames in a image will fire the 'onload' event for multiple times. So set to null
                img.onload = null;
                img = null;
                if (cb) cb(url);
            };
        };
    },
    stripTags: function (input, allowed) {
        allowed = (((allowed || '') + '')
                .toLowerCase()
                .match(/<[a-z][a-z0-9]*>/g) || [])
                .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '')
                .replace(tags, function ($0, $1) {
                    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                });
    },
    km2Miles: function (km) {
        return Math.round(parseFloat(km) * 0.62137);
    },
    miles2Km: function (km) {
        return Math.round(parseFloat(km) / 0.62137);
    },
    putLinksInString: function (inputText) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return inputText.replace(exp, "<a title='$1' class='url-wrapper' target='_blank' data-browser='$1' href='#'>$1</a>");
    },
    clone: function (obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = toolkit.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    },
    sortAsc: function (arr, neddle) {
        var arrMessage = [];
        if (arr != undefined && arr.length > 0) {
            Object.keys(arr)
                    .map(function (k) {
                        return [arr[k][neddle], arr[k]];
                    })
                    .sort(function (a, b) {
                        if (a[0] < b[0])
                            return -1;
                        if (a[0] > b[0])
                            return 1;
                        return 0;
                    })
                    .forEach(function (d) {
                        arrMessage.push(d[1]);
                    });
            return arrMessage;
        } else {
            return [];
        }
    },
    sortDesc: function (arr, neddle) {
        var arrMessage = [];
        if (arr != undefined && arr.length > 0) {
            Object.keys(arr)
                    .map(function (k) {
                        return [arr[k][neddle], arr[k]];
                    })
                    .sort(function (a, b) {
                        if (a[0] < b[0])
                            return 1;
                        if (a[0] > b[0])
                            return -1;
                        return 0;
                    })
                    .forEach(function (d) {
                        arrMessage.push(d[1]);
                    });
            return arrMessage;
        } else {
            return [];
        }
    },
    convertImageToCanvas: function (b64) {
        var base_image = new Image();
        base_image.src = b64;
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        canvas.width = base_image.width;
        canvas.height = base_image.height;
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(base_image, 0, 0);
        return canvas;
    },
    convertCanvasToImage: function (canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/jpeg");
        return image;
    },
    playAudio: function (url, isLocal, cb) {
        // Play the audio file at url
        if (isLocal == undefined) {
            isLocal = true;
        }

        if (isLocal) {
            url = toolkit.getMediaURL(url);
        } else {
            url = toolkit.getFullFilePath(url);
        }

        var mediaDurarion;
        var my_media = new Media(url, function () {
            my_media.release();
            if (cb != undefined) {
                cb(null, 100)
            }
        }, function (err) {
            my_media.release();
            if (cb != undefined) {
                cb(err, null)
            }
        });

        if (cb != undefined) {
            var fcStage = function (dur) {
                var mediaTimer = setInterval(function () {
                    // get media position
                    my_media.getCurrentPosition(
                        // success callback
                        function (position) {
                            if (position > -1) {
                                var per = ((position * 100) / dur);
                                if (per <= 99) {
                                    cb(null, per)
                                } else {
                                    clearInterval(mediaTimer);
                                }
                            } else {
                                clearInterval(mediaTimer);
                            }
                        },
                        // error callback
                        function (e) {
                            cb(e, null)
                        }
                    );
                }, 500);
            }

            var counter = 0;
            var timerDur = setInterval(function () {
                counter = counter + 10;
                if (counter > 2000) {
                    clearInterval(timerDur);
                }
                var dur = my_media.getDuration();
                if (dur > 0) {
                    clearInterval(timerDur);
                    mediaDurarion = dur;
                    fcStage(dur);
                }
            }, 100);
        }
        // mediaDurarion = my_media.getDuration();
        // Play audio
        my_media.play();
        return my_media;
        // 

    },
    getMediaURL: function (s) {
        if (device.platform.toLowerCase() === "android")
            return "/android_asset/www/" + s;
        return s;
    },
    buildAudioPlayer: function (src, duration) {
        //  console.log(src);
        var html = ' <div class="audio-player" data-src="' + src + '">                ' +
                '   <div class="audio-load-img"></div>                                ' +
                '   <a href="#" class="btn-play"><div class="play-img"></div></a>     ' +
                '   <a href="#" class="btn-stop"><div class="stop-img"></div></a>     ' +
                '   <div class="box-progress">                                        ' +
                '      <div class="player-progress">                                  ' +
                '         <div class="player-progress-color"></div>                   ' +
                '      </div>                                                         ' +
                '   </div>                                                            ' +
                '   <span class="duration">' + duration + '</span>                    ' +
                ' </div>                                                              ';
        return html;
    },
    loadDB: function (cb) {

        var opt = {
            name: 'Helpub.db'
        }

        if (window.device.platform == 'Android') {
            opt.location = 'default'
        } else {
            opt.iosDatabaseLocation = 'default'
        }

        window.sqlitePlugin.openDatabase(opt, function (db) {
            cb(db);
        });
    },
    getRecordExtension: function () {
        if (device.platform.toLowerCase() === "android") {
            return "amr";
        } else {
            return "wav"
        }
    },
    loadLocalJsFile: function (filename, cb) {
        var script = document.createElement('script')
        script.type = "text/javascript";
        script.src = filename;
        script.id = filename.replace("/", "-").replace(".", "-");
        script.onload = function () {
            cb()
        };
        document.getElementsByTagName("body")[0].appendChild(script)
    },
    rmLocalJsFile: function (filename) {
        var child = document.getElementById(filename.replace("/", "-").replace(".", "-"));
        document.getElementsByTagName("body")[0].removeChild(child);
    },
    formatISODate: function (date) {
        if (!date)
            return " - ";

        var date = new Date(date);
        var d = date.getDate();
        var m = (date.getMonth() + 1);
        var y = date.getFullYear();
        var h = date.getHours();
        var n = date.getMinutes();

        if ((d + "") .length == 1) {
            d = "0" + d;
        }

        if ((m + "").length == 1) {
            m = "0" + m;
        }

        if ((h + "").length == 1) {
            h = "0" + h;
        }

        if ((n + "").length == 1) {
            n = "0" + n;
        }

        return d + "/" + m + "/" + y + " " + h + ":" + n;
    }
};


var dbHandler = {
    getDB: function () {
        // return window.sqlitePlugin.openDatabase({ name: 'NerdSpell.db', iosDatabaseLocation: 'default' });
        return appVars.db;
    },
    connect: function (cb) {
        var db = dbHandler.getDB();
        var errorCB = function () {
            // db.close();
            if (cb)
                cb(err)

            // alert("Error processing SQL: " + err.code);
        }
        var successCB = function () {
            // db.close();
            if (cb)
                cb(null)
        }
        var populateDB = function (tx) {

            var sql = " CREATE TABLE IF NOT EXISTS app_session           " +
                    " (                                                  " +
                    " 	id INTEGER PRIMARY KEY AUTOINCREMENT,            " +
                    " 	user_id INTEGER,                                 " +
                    " 	auth TEXT NOT NULL,                              " +
                    " 	user_name TEXT NOT NULL                          " +
                    " );                                                 ";

            tx.executeSql(sql);
        }
        db.transaction(populateDB, errorCB, successCB);
    },
    readAppSession: function (cb) {

        var db = dbHandler.getDB();

        var sql = " SELECT id             " +
                "    , user_id          " +
                " 	 , auth             " +
                " 	 , user_name        " +
                " FROM app_session      " +
                " LIMIT 1	            ";



        db.executeSql(sql, [], function (res) {

            var obj = null;
            if (res.rows.item(0)) {
                obj = {
                    id: res.rows.item(0).id,
                    userId: res.rows.item(0).user_id,
                    auth: res.rows.item(0).auth,
                    userName: res.rows.item(0).user_name
                }
            }
            // alert("OK")
            if (cb)
                cb(null, obj);

        }, function (error) {
            alert(error);
            //db.close();
        }, function () {
            //db.close();
        });
    },
    insertAppSession: function (obj, cb) {

        var db = dbHandler.getDB();
        var errorCB = function () {
            //db.close();
            if (cb)
                cb(err)
        }

        var successCB = function (res) {
            if (cb)
                cb(null);
        }

        var sql = " INSERT INTO app_session  " +
                " (                        " +
                "      user_id             " +
                "    , auth                " +
                "    , user_name           " +
                " )                        " +
                " VALUES                   " +
                " (                        " +
                "      ?                   " +
                "    , ?                   " +
                "    , ?                   " +
                " )                        ";

        var params = [];
        params.push(obj.userId);
        params.push(obj.auth);
        params.push(obj.userName);
     
        db.executeSql(sql, params, successCB, errorCB, function () {
            //  db.close();
        });
    },
    updateAppSession: function (obj, cb) {
        var db = dbHandler.getDB();
        var errorCB = function () {
            //   db.close();
            cb(err)
        }

        var successCB = function (res) {
            if (cb)
                cb(null)
        }

        var sql = " UPDATE app_session  " +
                "    SET   auth = ?             " +
                "        , user_name = ?        " +
                " WHERE user_id = ?	        ";

        var params = [];
        params.push(obj.auth);
        params.push(obj.userName);

        db.executeSql(sql, params, successCB, errorCB, function () {
            // db.close();
        });
    },
    unsetAuth: function (obj, cb) {
        var db = dbHandler.getDB();
        var errorCB = function () {
            console.log(err);
            cb(err)
        };

        var successCB = function (res) {
            if (cb)
                cb(null);
        };

        var sql = " UPDATE app_session  " +
                "    SET   auth = ''    " +
                " WHERE user_id = ?     ";

        var params = [];
        params.push(obj.userId);

        db.executeSql(sql, params, successCB, errorCB, function () {
            //db.close();
        });
    },
    deleteUser: function (cb) {
        var db = dbHandler.getDB();
        var errorCB = function () {
            console.log(err);
            cb(err)
        };

        var successCB = function (res) {
            if (cb)
                cb(null);
        };

        var sql = "DELETE FROM app_session  " +
                  "WHERE id > 0             ";


        db.executeSql(sql, [], successCB, errorCB, function () {
            //db.close();
        });
    }
};

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

var currentPlayer;
$$(document).click(".btn-play", function () {
    var $$this = $$(this);

    var fcPlay = function () {
        $$(document).find(".btn-stop").click();
        var $$mainBox = $$this.closest(".audio-player");
        $$this.hide();
        var src = $$mainBox.data("src");
        var $$btnStop = $$mainBox.find(".btn-stop");
        var $$imgLoad = $$mainBox.find(".audio-load-img");
        $$imgLoad.css("display", "inline-block");
        var $$progress = $$mainBox.find(".player-progress-color");

        var loadIsHide = false;
        currentPlayer = toolkit.playAudio(src, false, function (err, persentage) {

            if (!loadIsHide) {
                $$imgLoad.hide();
                $$btnStop.css("display", "inline-block");
                loadIsHide = true;
            }

            $$progress.css({ 'width': persentage + '%' });
            if (persentage == 100) {
                setTimeout(function () {
                    $$progress.css({ 'width': 0 + '%' });
                }, 100);
                $$btnStop.hide();
                $$this.css("display", "inline-block");
            }
        });
    }

    if (!currentPlayer) {
        fcPlay();
    } else {
        setTimeout(function () {
            fcPlay();
        }, 600);
    }
});

$$(document).click(".btn-stop", function () {
    var $$this = $$(this);
    var $$mainBox = $$this.closest(".audio-player");
    $$this.hide();
    $$mainBox.find(".btn-play").css("display", "inline-block");
    if (currentPlayer) {
        currentPlayer.stop();
        currentPlayer = null;
    }
});