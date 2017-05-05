/**
 * Created by caoxx on 2017/5/4.
 */

var $ = $.noConflict();
$.fn.slidePDF = function(can){
    can = $.extend({
        pic:null,//大图框架
        pnum:null,//小图框架
        prev:null,//大图左箭头
        next:null,//大图右箭头
        delayTime:800,//切换一张图片时间
        order:0,//当前显示的图片（从0开始）
        picdire:true,//大图滚动方向（true水平方向滚动）
        mindire:false,//小图滚动方向（true水平方向滚动）
        min_picnum:null,//小图显示数量
    }, can || {});
    var picnum = $(can.pic).find('div a').length;
    var picw = $(can.pic).find('div a').outerWidth(true);
    var pich = $(can.pic).find('div a').outerHeight(true);
    var picminnum = $(can.pnum).find('a').length;
    var picminw = $(can.pnum).find('a img').outerWidth(true);
    var picminh = $(can.pnum).find('a img').outerHeight(true);
    var tpqhnum=0;
    var xtqhnum=0;
    $(can.pic).find('div').width(picnum*picw).height(picnum*pich);
    // $(can.pnum).find('a').width(picminnum*picminw).height(picminnum*picminh);

//点击小图切换大图
    $(can.pnum).find('a').click(function () {
        tpqhnum = xtqhnum = $(this).index();
        show(tpqhnum);
        minshow(xtqhnum);
    }).eq(can.order).trigger("click");
//大图左右切换
    $(can.prev).click(function(){
        if(tpqhnum==0){tpqhnum=picnum};
        if(xtqhnum==0){xtqhnum=picnum};
        xtqhnum--;
        tpqhnum--;
        show(tpqhnum);
        minshow(xtqhnum);
    })
    $(can.next).click(function(){
        if(tpqhnum==picnum-1){tpqhnum=-1};
        if(xtqhnum==picminnum-1){xtqhnum=-1};
        xtqhnum++;
        minshow(xtqhnum)
        tpqhnum++;
        show(tpqhnum);
    })
//小图切换过程
    function minshow(xtqhnum){
        var mingdjl_num =xtqhnum-can.min_picnum+2
        var mingdjl_w=-mingdjl_num*picminw;
        var mingdjl_h=-mingdjl_num*picminh;

        if(can.mindire==true){
            console.log(222);
            $(can.pnum).find('div a').css('float','left');
            if(picminnum>can.min_picnum){
                if(xtqhnum<3){mingdjl_w=0;}
                if(xtqhnum==picminnum-1){mingdjl_w=-(mingdjl_num-1)*picminw;}
                $(can.pnum).stop().animate({'left':mingdjl_w},can.delayTime);
            }

        }else{
            $(can.pnum).find('div a').css('float','none');
            console.log(picminnum);
            console.log(can.min_picnum);

            if(picminnum<can.min_picnum){
                if(xtqhnum<3){mingdjl_h=0;}
                if(xtqhnum==picminnum-1){mingdjl_h=-(mingdjl_num-1)*picminh;}
                $(can.pnum).stop().animate({'top':mingdjl_h},can.delayTime);
            }
        }

    }
//大图切换过程
    function show(tpqhnum){
        var gdjl_w=-tpqhnum*picw;
        var gdjl_h=-tpqhnum*pich;
        if(can.picdire==true){
            $(can.pic).find('div a').css('float','left');
            $(can.pic).find('div').stop().animate({'left':gdjl_w},can.delayTime);
        }else{
            $(can.pic).find('div').stop().animate({'top':gdjl_h},can.delayTime);
        }//滚动
        $(can.pic).find('div a').eq(tpqhnum).fadeIn(can.delayTime).siblings('a').fadeOut(can.delayTime);//淡入淡出
        $(can.pnum).find('a img').eq(tpqhnum).addClass("on").parent().siblings().find("img").removeClass("on");
    };
}