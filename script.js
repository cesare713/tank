$(document).ready(function(){
    
    var life = 3; //hero 수
    var level = 0;
    var speed = 500; // hero가 움직이는 시간
    var dir = "t"; // direction of hero, 초기값은 top
    var curpos = { // of current position of hero
        x:225, y:400
    }
    var score = 0;
    var kill = 0; // 현재 stage의 적군 수
    var bullet = "<img id='mybul' src='images/bullet.png' alt='bullet' />";
    var ebul = "<img class='ebul' src='images/bullet.png' alt='bullet' />";
    var reload = 900; // 재장전시간
    var bs = 800; // 포탄이 날아가는 시간
    var emax = 5; // 최대 적군의 수
    var fire = true; // 포탄 장전 가능 여부
    var hero = "<img id='hero' src='images/hero.png'>";
    var enemy = "<img class='enemy' src='images/enemy.png'>";
    var expl = "images/explode.gif";
    var bpos = { x:0, y:0 };
    var ebpos = [];
    var maxtank = 5;
    
    setInterval(function(){
        $("#life").text(fire);
    },100);
    
    function ini(){
        level++;
        $("#level").text("Stage : "+ level);
        var firstpos = { x:225, y:430 } // 최초 hero의 위치
        $("#mybul").stop();
        $("#stage").empty();
        $("#stage").append(hero);
        $("#hero").css({
            left: firstpos.x +"px", top: firstpos.y +"px"
        });
        kill = emax;
        fire = true;
        epos = [];
        en = -1;
        killno = -1;
    }
    
    // stage 탈출 추적기
    function bound(x,y){
        if(x < 0 ){
            return "xover-";
        }else if(x > 450){
            return "xover+";
        }else if(y < 0 ){
            return "yover-";
        }else if(y > 450){
            return "yover+";
        }else{
            return "ok";
        }
    }
    
    // hero 위치 추적기
    function where(){
        curpos.x = parseInt($("#hero").css("left"));
        curpos.y = parseInt($("#hero").css("top"));
        if(bound(curpos.x, curpos.y) == "xover-"){
            $("#hero").stop().animate({left:"50px"},100);
        }else if(bound(curpos.x, curpos.y) == "xover+"){
            $("#hero").stop().animate({left:"450px"},100);
        }else if(bound(curpos.x, curpos.y) == "yover-"){
            $("#hero").stop().animate({top: "50px"},100);
        }else if(bound(curpos.x, curpos.y) == "yover+"){
            $("#hero").stop().animate({top: "450px"},100);
        }
    }
//        console(curpos.x +","+ curpos.y);
    
    // hero 포탄 위치 추적기
    var killno = -1;
    function hpfind(){
        bpos.x = parseInt($("#mybul").css("left"));
        bpos.y = parseInt($("#mybul").css("top"));
        // 피격 판정
        for(i=0; i < epos.length; i++){
            if((bpos.x > epos[i][0] && bpos.x < epos[i][0]+30) && (bpos.y > epos[i][1] && bpos.y < epos[i][1]+30)){
                
                if(!$(".e"+i).hasClass("dead")){
                    kill--;
                    score += 10;
                    $("#score").text("Score : "+ score);
                    if($(".dead").length >= maxtank){
                        // .dead 중 data 가장 작은 값 구하기
                        var arr = [];
                        for(j=0; j < $(".dead").lengthl; j++){
                            arr[j] = parseInt($(".dead").eq(j).attr("data"));
                        }
                        var min = Math.min.apply(null,arr);
                           $(".dead[data="+ min +"]").fadeOut(function(){
                                var n = $(this).index(".enemy");
                                epos[n] = [600,600];
                                $(this).attr("data",10000);
                            });
                        
//                        var champ = 0;
//                        for(j=o; j < $(".dead").length-1; j++){
//                            if($(".dead").eq(champ).attr("data") > $(".dead").eq(j+1).attr("data")){
//                                champ = j+1;
//                            }
//                        }
//                        $(".dead").eq(champ).fadeOut(function(){
//                            var n = $(this).index(".enemy");
//                            epos[n] = [600,600];
//                            $(this).attr("data",10000);
//                        });
                    }
                    killno++;
                }
                $(".e"+ i).stop().attr("src",expl).addClass("dead").attr("data",killno);
                clearTimeout(no[i]); // 피격된 적은 움직이지 못하게 함
                $("#mybul").remove();
                bpos.x = null;
                bpos.y = null;
                if(kill <= 0){
                    setTimeout(function(){
                        var conf = confirm("Stage Clear");
                        if(conf){
                            emax += 3;
                            ini();
                        }
                    }, 1000);
                }
            }
        }
    }
     
    // hero 피격 판정
    function herohit(){
        for(i=0; i < ebpos.length; i++){
           if(
                (curpos.x > epos[i][0] && curpos.x < ebpos[i][0]+ 30) &&
                (curpos.y > epos[i][1] && curpos.y < ebpos[i][1]+ 30)
           ){
               life--;
               $("#hero").attr("src",expl)
           } 
        }
    }

    // 적군 위치 추적기
    var epos = [];
    var ereload = [];
    function ewhere(who, edir){
        var i = who.replace(".e","");
        epos[i] = [];
        epos[i][0] = parseInt($(who).css("left"));
        epos[i][1] = parseInt($(who).css("top")); 
        if(bound(epos[i][0], epos[i][1]) == "xover-"){
            $(who).stop().css({left:"50px"},100);
        }else if(bound(epos[i][0], epos[i][1]) == "xover+"){
            $(who).stop().css({left:"450px"},100);
        }else if(bound(epos[i][0], epos[i][1]) == "yover-"){
            $(who).stop().css({top:"50px"},100);
        }else if(bound(epos[i][0], epos[i][1]) == "yover+"){
            $(who).stop().css({top:"450px"},100);
        }
        // 적군 포 발사
        if(ereload[i]){
            ereload[i] = false;
            setTimeout(function(){ ereload[i] = true;
            }, 500); // 포 쏘는 시간 간격
            $("#stage").append(ebul);
            $(".ebul:last-of-type").addClass("eb"+ i);
            $(".eb"+ i).css({
                left: epos[i][0] +15 +"px",
                top: epos[i][1] +15 +"px",
                transform: "rotate("+ (edir*90-90) +"deg)"
            });
            if(edir % 2 == 0){
                var pm;
                if(edir == 0){ pm = "-="; }else{ pm = "+="; }
//               == edir == 0 ? pm = "-=" : pm = "+=";    
                $(".eb"+ i).animate({ left: pm +"500px" }, { 
                    duration: speed, 
                    easing: "linear",
                    step: function(){
                        ebpos[i] = [];
                        ebpos[i][0] = parseInt($(".eb"+i).css("left"));
                        ebpos[i][1] = parseInt($(".eb"+i).css("top"));
                    },
                    complete: function(){
                        $(".eb"+i).remove();
                    }
                });
            }else{
                var pm;
                if(edir == 1){ pm = "-="; }else{ pm = "+="; }
//               == edir == 0 ? pm = "-=" : pm = "+=";    
                $(".eb"+ i).animate({ top: pm+"500px" }, { 
                    duration: speed, 
                    easing: "linear",
                    step: function(){
                        ebpos[i] = [];
                        ebpos[i][0] = parseInt($(".eb"+i).css("left"));
                        ebpos[i][1] = parseInt($(".eb"+i).css("top"));
                    },
                    complete: function(){
                        $(".eb"+i).remove();
                    }
                });
            }
        }
    }
    
    // 랜덤 정수 만들기
    function rand(min,max){
        return Math.floor(Math.random()*(max-min+1) + min);
    }
    
    // ←37, ↑38, ↓39, ↑40, spacebar32  
    var key = "";
      $(document).keydown(function(e){
          key = e.keyCode;
      });  
    $(document).keyup(function(){
        key = "";
    });
    
    $(document).keydown(function(){
        switch(key){
            case 37:
                $("#hero").css("transform","rotate(-90deg)");
                dir = "l";
                $("#hero").stop().animate({
                    left: "-=30px"    
                },{duration: speed, 
                   easing: "linear", 
                   step: function(){
                        where();
                    }
                });
                break;
            case 38:
                $("#hero").css("transform","rotate(0deg)");
                dir = "t";
                $("#hero").stop().animate({
                    top: "-=30px"    
                },{duration: speed, 
                   easing: "linear", 
                   step: function(){
                        where();
                    }
                });
                break;
            case 39:
                $("#hero").css("transform","rotate(90deg)");
                dir = "r";
                $("#hero").stop().animate({
                    left: "+=30px"    
                },{duration: speed, 
                   easing: "linear", 
                   step: function(){
                        where();
                    }
                });
                break;
            case 40:
                $("#hero").css("transform","rotate(180deg)");
                dir = "b";
                $("#hero").stop().animate({
                    top: "+=30px"    
                },{duration: speed, 
                   easing: "linear", 
                   step: function(){
                        where();
                    }
                });
                break;
            case 32: // hero 포 쏘기
                if(fire){
                    var buld = 0;
                    switch (dir){
                        case "l": buld =-90; break;
                        case "t": buld =-0; break;
                        case "r": buld =90; break;
                        case "b": buld =180; break;
                    }
                    $("#stage").append(bullet);
                    $("#mybul").css({
                        left: curpos.x + 15 +"px",
                        top: curpos.y + 15 +"px",
                        transform: "rotate("+ buld +"deg)"
                    });
                    switch (dir){
                        case "l": 
                            $("#mybul").animate({
                                left: "-=500px"
                            },{
                                duration: bs,
                                easing: "linear",
                                step: function(){
                                    fire = false;
                                    hpfind();
                                },
                                complete: function(){
                                    $("#mybul").remove();
                                }
                            });
                            setTimeout(function(){ fire = true;}, reload);
                            break;
                        case "t": 
                            $("#mybul").animate({
                                top: "-=500px"
                            },{
                                duration: bs,
                                easing: "linear",
                                step: function(){
                                    fire = false;
                                    hpfind();
                                },
                                complete: function(){
                                    $("#mybul").remove();
                                }
                            });
                            setTimeout(function(){ fire = true;}, reload);
                            break;
                        case "r": 
                            $("#mybul").animate({
                                left: "+=500px"
                            },{
                                duration: bs,
                                easing: "linear",
                                step: function(){
                                    fire = false;
                                    hpfind();
                                },
                                complete: function(){
                                    $("#mybul").remove();
                                }
                            });
                            setTimeout(function(){ fire = true;}, reload);
                            break;
                        case "b": 
                            $("#mybul").animate({
                                top: "+=500px"
                            },{
                                duration: bs,
                                easing: "linear",
                                step: function(){
                                    fire = false;
                                    hpfind();
                                },
                                complete: function(){
                                    $("#mybul").remove();
                                }
                            });
                            setTimeout(function(){ fire = true;}, reload);
                            break;
                    }
                }
                break;
        }
        
    });
    
    ini();
    
    // 적군 만들기
    var en = -1;
    function menemy(){
        if($(".enemy").length < emax){
           en++;
            var ex = rand(0,450);
            var ey = rand(0,350);
            $("#stage").append(enemy);
            $(".enemy:last-of-type").addClass("e"+en);
            $(".e"+en).css({
                left: ex +"px",
                top: ey +"px"
            });
            $(".enemy").css("transform","rotate(180deg)");
            emove(".e"+en);
            ereload[en] = true;
       }
    }

    setInterval(menemy,rand(500,3000));
    
    // 적군 움직이기
    function emove(who){
        var edir = rand(0,3); // 움직일 4가지의 방향
        var em = 180; // 움직일 거리
//        var emove = rand(20,80); // 움직일 거리
        switch (edir){
            case 0:
                $(who).css("transform","rotate(270deg)");
                $(who).stop().animate({ 
                    left: "-="+ em +"px" 
                  }, {
                        duration: 3000, 
                        easing: "linear",
                        step: function(){
                        ewhere(who,edir);    
                        }
                });
                break;
            case 1:
                $(who).css("transform","rotate(0deg)");
                $(who).stop().animate({ 
                    top: "-="+ em +"px" 
                },{
                    duration: 3000, 
                    easing: "linear",
                    step: function(){
                    ewhere(who,edir);   
                    }
                }); 
                break;
            case 2:
                $(who).css("transform","rotate(90deg)");
                $(who).stop().animate({ 
                    left: "+="+ em +"px" 
                },{ 
                    duration: 3000,
                    easing: "linear",
                    step: function(){
                    ewhere(who,edir);    
                    }
                }); 
                break;
            case 3:
                $(who).css("transform","rotate(180deg)");
                $(who).stop().animate({ 
                    top: "+="+ em +"px" 
                },{
                    duration: 3000,
                    easing: "linear",
                    step: function(){
                    ewhere(who,edir);    
                    }
                }); 
                break;
        }
        var n = who.replace(".e","");
        no[n] = setTimeout(emove,rand(500,3000), who);
    }
    var no = [];
    
    
    function efire(x,y,dir){
        
    }
    
});