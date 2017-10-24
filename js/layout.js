/*
 * Copyright (c) 2017. This code has been developed by David Torralbo Pérez. @torralbo_
 */
var layout = {

    /*
     Inicialitza les següents funcions
     */
    init:function(){
        this.initSelectors();
        this.ocultaNav();
        this.blocaScroll();
    },

    /*
     Inicialitza els selectors necessaris
     */
    initSelectors: function(){
        this.selectors = {};
        this.selectors.nav = $('.nav a');
        this.selectors.navcollapse = $('.navbar-collapse');
    },

    /*
    Impedeix que la pàgina es mogui en una webapp
     */
    blocaScroll: function () {
        document.ontouchmove = function(event){
            event.preventDefault();
        }
    },

    /*
    Oculta el menú un cop s'hagi escollit una opció
     */
    ocultaNav: function () {
        this.selectors.nav.click((function () {
            this.selectors.navcollapse.collapse('hide');
        }.bind(this)));
    },



};

layout.init();