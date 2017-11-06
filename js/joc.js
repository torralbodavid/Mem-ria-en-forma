/*
 * Copyright (c) 2017. This code has been developed by David Torralbo Pérez. @torralbo_
 */
var jocFigures = {

    /*
     Inicialitza les següents funcions
     */
    init:function(){
        this.initSelectors();
        this.botoIniciar();
        this.botoSortir();
        this.figures();
        this.onClickFigures();
    },

    /*
     Inicialitza els selectors necessaris
     */
    initSelectors: function(){
        this.selectors = {};
        this.selectors.comptador = $('#time');
        this.selectors.btn_iniciar = $('#startGame');
        this.selectors.intents = $('#intents');
        this.selectors.figuresAtzar = $('#figuresAtzar');
        this.selectors.figuresSeleccionades = $('#figuresSeleccionades');
        this.selectors.panell = $('#panell');
        this.selectors.divPanell = $('#divPanell');
        this.selectors.points = $('#points');
        this.selectors.sortir = $('#sortir');
        this.selectors.ranking = $('#ranking');
    },

    /*
    Inicialitza el comptador
     */
    startComptador: function(intents) {
        var segons = 0;
        var duration = 60 * 1;
        var timer = duration, minutes, seconds;

        if(intents == 12355){
            var counter = 3;
            id = setInterval((function() {
                counter--;
                if(counter < 0) {
                    //Torna a mostrar-se tot!
                    this.selectors.panell.addClass("hidden");
                    this.selectors.figuresAtzar.addClass("hidden");
                    this.selectors.divPanell.append('<div id="panell" class="row boxFigures" align="center">\n' +
                        '            <div class="col-sm-3 col-xs-6"><div class="figura shake" id="square"></div></div>\n' +
                        '            <div class="col-sm-3 col-xs-6"><div class="figura shake" id="circle"></div></div>\n' +
                        '            <div class="col-sm-3 col-xs-6"><div class="figura shake" id="cross"></div></div>\n' +
                        '            <div class="col-sm-3 col-xs-6"><div class="figura shake" id="triangle"></div></div>\n' +
                        '        </div>');
                    counter = 3;
                    clearInterval(id);
                } else {
                    //Compte enrere dels 3 segons...
                    this.selectors.divPanell.empty();
                    this.selectors.figuresAtzar.removeClass("hidden");
                }
            }.bind(this)), 1000);
        }

        var downloadTimer = setInterval((function () {

            //Si s'ha accionat el botó més d'un cop...
            if(intents >= 1){
                clearInterval(downloadTimer);
            }

            //Si els segons d'espera són 3...
            if(segons >= 3){
                this.selectors.divPanell.removeClass("hidden");
                this.selectors.panell.removeClass("hidden");
                this.selectors.figuresAtzar.addClass("hidden");
                segons = 0;
            }

            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            //Si és el primer intent, actualitzem el comptador...
            if(intents == 0) {
                this.selectors.comptador.text(minutes + ":" + seconds);
            }


            if (--timer < -1) {
                timer = duration;
            } else if(timer <= -1){
                //Si el temps finalitza
                clearInterval(downloadTimer);
                this.quanAcabaTemps();
            }

            segons = segons+1;


        }.bind(this)), 1000);

    },

    /*
    S'accionarà quan es premi el botor d'iniciar
     */
    botoIniciar: function () {
        this.selectors.btn_iniciar.on('click', (function() {
            this.selectors.ranking.attr('data-original-title',"Millor puntuació: "+Cookies.get('puntuacio'));

            var intents = this.selectors.intents.text();

            this.startComptador(intents);

            if(intents == 0) {
                this.selectors.figuresSeleccionades.empty();
                this.figuresPantalla();
                this.selectors.panell.addClass("hidden");
                this.selectors.figuresAtzar.removeClass("hidden");
            }

            this.selectors.intents.text(parseInt(this.selectors.intents.text())+1);

        }).bind(this))
    },

    /*
    S'accionarà quan es premi el botor de sortir
     */
    botoSortir: function () {
        this.selectors.sortir.on('click', (function() {
            this.quanAcabaTemps();
            this.selectors.panell.addClass("hidden");

        }).bind(this))
    },

    /*
    S'iniciarà quan finalitzi el temps o al pulsar el botó de sortir
     */
    quanAcabaTemps: function () {
        this.selectors.intents.text(parseInt(0));
        this.selectors.points.text(0);

        //ocultem ambdós div
        this.selectors.divPanell.addClass("hidden");
        this.selectors.figuresAtzar.addClass("hidden");
        this.selectors.figuresSeleccionades.addClass("hidden");

        if(Cookies.get('puntuacio') < this.selectors.points.text()) {
            Cookies.set('puntuacio', this.selectors.points.text());
        }
    },

    /*
    Retorna una figura a l'atzar
     */
    figures: function () {
        var figures = ["circle", "square", "cross", "triangle"];
        return figures[Math.floor(Math.random() * figures.length)];
    },

    /*
    Imprimeix les figures en pantalla
     */
    figuresPantalla: function () {
        //eliminem el contingut del div figuresAtzar
        this.selectors.figuresAtzar.empty();

        for (i = 0; i < 4; i++) {
            //generem una figura aleatòria
            var figura = this.figures();
            this.selectors.figuresAtzar.append('<div class="col-sm-3 col-xs-6"><div class="figura" id="'+figura+'"></div></div>');
        }

    },

    /*
    Comprova arrays
     */
    comprovaArray: function () {

        // Comprovem array aleatori
        var figuresAtzar = [];
        $("#figuresAtzar > div > div").each(function () {
            var id = $(this).attr("id");
            figuresAtzar.push(id);
        });

        // Comprovem array usuari
        var figuresUsuari = [];
        $("#figuresSeleccionades > div > div").each(function () {
            var id = $(this).attr("id");
            figuresUsuari.push(id);
        });

        //Comprovem si són iguals
        if(figuresAtzar.length !== figuresUsuari.length)
            return false;
        for(var i = figuresAtzar.length; i--;) {
            if(figuresAtzar[i] !== figuresUsuari[i])
                return false;
        }
        return true;

    },

    /*
    Quan es faci clic a les figures
     */
    onClickFigures: function () {


        //comptem el nombre de clics a figures
        var nombreClics = 0;
        var punts = 0;

        this.selectors.divPanell.on('click', '#panell .figura', (function(ev) {
            //s'afegeixen a un div
            this.selectors.figuresSeleccionades.removeClass("hidden");
            this.selectors.figuresSeleccionades.append('<div class="col-sm-3 col-xs-6"><div class="figura" id="'+ev.target.id+'"></div></div>');
            nombreClics = nombreClics+1;

            //si el nombre de clics és de 4...
            if(nombreClics == 4){

                if(this.comprovaArray()){
                    punts = punts+1;
                    this.selectors.points.text(parseInt(punts));
                }

                this.startComptador(12355);
                this.selectors.figuresSeleccionades.empty();
                this.figuresPantalla();
                nombreClics = 0;

            }
        }.bind(this)))
    }


};

jocFigures.init();