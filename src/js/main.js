//$(function () {
    $('.no-js').removeClass('.no-js');


    var root_id = "#city";
    var file = $(root_id).attr('data-src');

    var svg_template = '<svg class="animation-layer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 940 300">';

    var config = {
        scene: [
            {
                type: "delayed",
                start: "inViewport",
                duration: 200,
                delay: 0,
                elements: [
                    "#bay",
                    "#Gator"
                ],
                _shapes: [],
                _svg: null,
                _snap: null,
                _vivus: null,
                _callback: null
            },
            {
                type: "oneByOne",
                start: "inViewport",
                duration: 200,
                delay: 0,
                elements: [
                    "#fordøyelsebasseng",
                    "#green_roofs"
                ],
                _shapes: [],
                _svg: null,
                _snap: null,
                _vivus: null,
                _callback: null
            },
            {
                type: "oneByOne",
                start: "inViewport",
                duration: 200,
                delay: 0,
                elements: [
                    "#Random_byggings",
                    "#trees"
                ],
                _shapes: [],
                _svg: null,
                _snap: null,
                _vivus: null,
                _callback: animationDone
            }
        ],
        sequence: [
            {
                type: "oneByOne",
                start: "manual",
                pause: 3000,
                duration: 200,
                delay: 0,
                elements: [
                    "#HL_Forhøyet__x0D_kaifront "
                ],
                _shapes: [],
                _svg: null,
                _snap: null,
                _vivus: null,
                _callback: null
            },
            {
                type: "oneByOne",
                start: "manual",
                pause: 3000,
                duration: 200,
                delay: 0,
                elements: [
                    "#HL_Grønne_tak"
                ],
                _shapes: [],
                _svg: null,
                _snap: null,
                _vivus: null,
                _callback: null
            },
            {
                type: "oneByOne",
                start: "manual",
                pause: 3000,
                duration: 200,
                delay: 0,
                elements: [
                    "#HL_Åpne_bekker"
                ],
                _shapes: [],
                _svg: null,
                _snap: null,
                _vivus: null,
                _callback: null
            },
            {
                type: "oneByOne",
                start: "manual",
                pause: 3000,
                duration: 200,
                delay: 0,
                elements: [
                    "#HL_Overvannsdam"
                ],
                _shapes: [],
                _svg: null,
                _snap: null,
                _vivus: null,
                _callback: null
            },
            {
                type: "oneByOne",
                start: "manual",
                pause: 3000,
                duration: 200,
                delay: 0,
                elements: [
                    "#HL_Trygg_flomvei"
                ],
                _shapes: [],
                _svg: null,
                _snap: null,
                _vivus: null,
                _callback: null
            },
            {
                type: "oneByOne",
                start: "manual",
                pause: 3000,
                duration: 200,
                delay: 0,
                elements: [
                    "#HL_Infiltrasjon_i_grunn"
                ],
                _shapes: [],
                _svg: null,
                _snap: null,
                _vivus: null,
                _callback: null
            }
        ],
        "static": [
            "#trees"
        ]
    };


    Snap.load(file, function(f){
        fileLoaded(f);
    });

    function fileLoaded(f){
        parseFile(f);

        addLayers(config.scene);
        addLayers(config.sequence);


    }

    function sequence(){
        var curSeq = null;
        var curIndex = 0;
        var seq = config.sequence;
        var seqCount = config.sequence.length;

        cycle();

        function load(seq){
            curSeq = seq;
            curSeq._vivus.play(1);
            curSeq._snap.select('[id^=text]').animate({
                opacity: 1
            }, 400);
        }
        function unload(seq){
            curSeq._vivus.play(-5);
            curSeq._snap.select('[id^=text]').animate({
                opacity: 0
            }, 200);
            curSeq = null;
        }
        function cycle(){
            if(curSeq !== null){
                unload(curSeq);
                curIndex = curIndex < seqCount-1 ? ++curIndex : 0;
            }
            load(seq[curIndex]);

            setTimeout(cycle, seq[curIndex].pause);
        }
    }

    function addLayers(animation){
        $.each(animation, function(i, anim){
            // create svg element and append to dom
            anim._svg = $(svg_template).appendTo($(root_id))[0];

            // create Snap.js context
            anim._snap = Snap(anim._svg);

            anim._snap.attr({ display: "hidden" }); // animation starts out hidden
            // add shapes to svg
            $.each(anim._shapes, function(i, shape){
                anim._snap.append(shape);
            });
            anim._snap.selectAll('[id^=text]').attr({ // hide text
                opacity: 0
            });
            anim._vivus = new Vivus(anim._svg, {
                type: anim.type, //delayed, async, oneByOne, script, scenario or scenario-sync
                duration: anim.duration,
                start: anim.start, //manual, autostart
                pathTimingFunction: Vivus.EASE_OUT,
                animTimingFunction: Vivus.LINEAR,
                onReady: function(el) {
                    //el._animation_start = Date.now();
                }
            }, anim._callback);
        });
    }

    function parseFile(f){
        $.each(config.scene, function(i, x){
            $.each(x.elements, function (j, shape) {
                x._shapes.push(f.select(shape));
            });
        });
        $.each(config.sequence, function(i, x){
            $.each(x.elements, function (j, shape) {
                x._shapes.push(f.select(shape));
            });
        });
    }

    function animationDone(e){
        //e._animation_end = Date.now();
        //e._animation_duration = e._animation_end - e._animation_start;
        //console.log("Animation ended in " + e._animation_duration/1000 + "s");
        //console.log(e);

        sequence();
    }

//});