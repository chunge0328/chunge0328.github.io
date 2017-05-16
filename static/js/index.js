/**
 * Created by 042089 on 2017/3/29.
 */
require.config({
    paths: { //优先加载海外CDN库，备选本地库
        "jquery" : "../js/libs/jquery-1.10.1.min",
        "swiper" : "../js/libs/idangerous.swiper.min",
        "lazyload" : "../js/libs/jquery.lazyload.min",
        "bootstrap" :"../js/libs/bootstrap.min"
    },
    shim: {
        lazyload : {
            deps: ['jquery'],
            exports: '$'
        },
        bootstrap : {
            deps: ['jquery'],
            exports: '$'
        }
    }
});
require(['jquery',"swiper",'lazyload',"bootstrap"], function($,Swiper) {
    // 头部提示
    var TimeFn = null;
    $(".remove-notice").click(function(){
        // 取消上次延时未执行的方法
        clearTimeout(TimeFn);
        //执行延时
        TimeFn = setTimeout(function(){
            topms();
            $(".top-ms").toggle(500);
        },300);
    });
    $(".remove-notice").dblclick(function (){
        clearTimeout(TimeFn);
        topms();
        $(".top-ms").hide();
    });
    // 下拉图片懒加载
    $("img.lazy").lazyload({
        effect: "fadeIn", // 载入使用何种效果
        threshold : 200
    });
    $('.shopNow-div').show();
    $('.cont-img').show();
    // 首页banner轮播图
    var swiper = new Swiper('.banner', {
        pagination: '.banner .pagination',
        loop:true,
        grabCursor: true,
        paginationClickable: true,
        calculateHeight : true
    });
    $('.banner a').show();
    $('.arrow-left').on('click', function(e){ // 左边切换
        e.preventDefault()
        swiper.swipeNext()
    });
    $('.arrow-right').on('click', function(e) { // 右边切换
        e.preventDefault();
        swiper.swipePrev()
    })
    // 根据屏幕宽度方法
    if (document.body.clientWidth > 950) {
        bannerimg();
        nav();
        if( $(document).height()-window.innerHeight<600) { // 底部动画
            $('.footer-div').addClass("animated")
        }
        $(window).scroll(function(){ // 导航栏背景色
            if($(window).scrollTop()>40){
                $('.header-nav').addClass('head-bg');
                $('.up-top').removeClass('hide')
            }else {
                $('.header-nav').removeClass('head-bg');
                $('.up-top').addClass('hide')
            }
            if( $(document).height()-$(window).scrollTop()<1200) { // 底部动画
                $('.footer-div').addClass("animated")
            }
        });
        $(window).resize(function(){ // 屏幕大小改变
            var bannerH = window.innerHeight; // pc端banner全屏
            $('.banner').css("height",bannerH+'px');
        });
    }else {
        mb()
    }
    if($(window).scrollTop()>40){ // 刷新回到顶部
        $('body,html').animate({ scrollTop: 0 }, 200);
    }
    //产品详情切换
    var tabsSwiper = new Swiper('.details-content .swiper-container',{
        pagination: '.details-content .pagination',
        speed:500,
        calculateHeight : true,
        onSlideChangeStart: function(){
            $(".tabs .active").removeClass('active');
            $(".tabs a").eq(tabsSwiper.activeIndex).addClass('active')
        }
    });
    // 产品详情图片切换
    $(".details-content .tabs a").on('touchstart mousedown',function(e){
        e.preventDefault();
        $(".tabs .active").removeClass('active');
        $(this).addClass('active');
        tabsSwiper.swipeTo( $(this).index() )
    });
    // 选择颜色
    $(".details-contents .color-active li").on('touchstart mousedown',function(e){
        e.preventDefault();
        if (this.style.cursor!=='not-allowed'){
            $(".color-active .active").removeClass('active');
            $(this).addClass('active');
            $('#id_child_id').val($(this).val()) //选择的val值，更改掉from的id_child_id值
            tabsSwiper.swipeTo( $(this).index() )
        }
    });
    // 数字输入框
    $('.spinner  .form-control').blur(function () {
        if(isNaN($(this).val())){
            $(this).val(1)
        }
    })
    $('.spinner .btn:first-of-type').on('click', function() {
        if($('.spinner input').val()==0){
            $('.btn-menu-down').removeAttr("disabled");
        }
        $('.spinner input').val( parseInt($('.spinner input').val(), 10) + 1);
    });
    $('.spinner .btn:last-of-type').on('click', function() {
        if($('.spinner input').val()==1){
            return;
        }
        $('.spinner input').val( parseInt($('.spinner input').val(), 10) - 1);
    });
    //切换语言
    $('#language_selector ul>li').click(function () {
        $('#language').val($(this).context.innerHTML)
        $('#language_selector').submit()
    })
});
// pc 轮播兼容满屏
function bannerimg() {
    var bannerH = window.innerHeight; // pc端banner全屏
    $('.banner').css("height",bannerH+'px');

    if($('.div-content .banner').length>0){ // 如果是首页底下大图
        $('.no-js').addClass('bg-img');
    }
}
// pc 导航 轮播 回到顶部
function nav() {
    var newProduct = new Swiper('.newProduct-swiper', { //newProduct的swiper初始化
        pagination: '.newProduct-pagination',
        paginationClickable: true,
        slidesPerView: 4,
        calculateHeight : true,
        onSlideNext:function(swiper){
            var getImgs = $(".newProduct img[data-original]");
            getImgs.each(function(num,e){
                var _this=$(this);
                _this.attr("src",_this.data("original"));
            });
        }
    })
    $('#newProduct-l').on('click', function(e){ // 左边切换
        e.preventDefault()
        newProduct.swipePrev()
    });
    $('#newProduct-r').on('click', function(e) { // 右边切换
        e.preventDefault();
        newProduct.swipeNext()
    })
    $(".up-top").click(function () { // 回到顶部
        $('body,html').animate({ scrollTop: 0 }, 200);
        return false;
    });
    $('.nav-list>li').hover(function(){ // 三级菜单
        $(this).addClass('nav-this');
        $(this).children('.sub-nav').stop(true,false).show()
    },function(){
        $(this).removeClass('nav-this');
        $(this).find('.sub-nav').hide()
    });
    $('.sub-tcen a').hover(function(){
        $(this).addClass('cur').siblings().removeClass('cur')
        var sub_index = $(this).index();
        $(this).parents('.sub-nav').find('.sub-d>div').eq(sub_index).show().siblings().hide()
    });
    var getImgs = $("img[data-src]"); // 菜单图懒加载
    getImgs.each(function(num,e){
        var _this=$(this);
        _this.attr("src",_this.data("src"));
    });
}
// 移动端
function mb() {
    var newProduct = new Swiper('.newProduct-swiper', { // 移动端根据屏幕宽度初始化swiper
        pagination: '.newProduct-pagination',
        paginationClickable: true,
        slidesPerView: 2,
        calculateHeight : true,
        onSlideNext:function(swiper){
            var getImgs = $(".newProduct img[data-original]");
            getImgs.each(function(num,e){
                var _this=$(this);
                _this.attr("src",_this.data("original"));
            });
        }
    })
    $('#newProduct-l').on('click', function(e){ // 左边切换
        e.preventDefault()
        newProduct.swipePrev()
    });
    $('#newProduct-r').on('click', function(e) { // 右边切换
        e.preventDefault();
        newProduct.swipeNext()
    })
}
// 加入购物车弹框js
function myModals(id) {
    $('#myModal').modal('show');
    $('.details-contents-buttom .btn-primary').attr("disabled",true);
    $("#formId").attr("action", "/zh-cn/basket/add/"+id+'/');
    $.ajax({
        type: "GET",
        url: "/productjson/"+id+'/',
        data: '',
        dataType: "json",
        success: function(data){
            $('#myModal-name').html(data.name);
            var html = '';
            if(data.children_details.length<1){
                $('#myModal-price').html(data.price)
                if(data.stock>0){
                    html=html+'<li value="'+data.child_id+'" data-stock="'+data.stock+'"><img src="'+data.colorimage+'" alt="'+data.color+'"></li>'
                }else {
                    html=html+'<li value="'+data.child_id+'" data-stock="'+data.stock+'" style="cursor:not-allowed"><img src="'+data.colorimage+'" alt="'+data.color+'"></li>'
                }
            }else {
                $('#myModal-price').html(data.children_details[0].price)
                $.each(data.children_details, function(idx, obj){
                    if(obj.stock>0){
                        html=html+'<li value="'+obj.child_id+'" data-stock="'+obj.stock+'"><img src="'+obj.colorimage+'" alt="'+obj.color+'"></li>'
                    }else {
                        html=html+'<li value="'+obj.child_id+'" data-stock="'+obj.stock+'" style="cursor:not-allowed"><img src="'+obj.colorimage+'" alt="'+obj.color+'"></li>'
                    }
                });
            }
            $('.color-active').html(html);
            $('.from-loading').hide();
            // 选择颜色
            $(".modal-body .color-active li").on('touchstart mousedown',function(e){
                e.preventDefault();
                if ($(this).data("stock")>0){
                    $('.details-contents-buttom .btn-primary').removeAttr("disabled");
                    $(".color-active .active").removeClass('active');
                    $(this).addClass('active');
                    $('#id_child_id').val($(this).val()) //选择的val值，更改掉from的id_child_id值
                }
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            $('.from-loading-text').html('System error, please try again later')
            console.log(textStatus);
        }
    });
}
function topms() {
    $.ajax("/setage/", {
        type: "post",
        cache: false,
        data: {csrf_token:$('#top-ms-id').val()},
        beforeSend: function (xhr) {
            // adjust XHR with additional headers
            // xhr.setRequestHeader('X-CSRFToken', "{{ csrf_token }}");
            xhr.setRequestHeader('Content-Type', "application/json; charset=utf-8");
        },
        success: function (data) {
            console.log(1)
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
        }
    });
}