/**
*author:eline_han
*/
$.fn.Search = function (options) {
  var _cfg={
    inputPlaceholderTxt:'Search...',//输入框占位文字
    width:300,//控件宽度
    postType:'POST',
    searchKeyName:'term',//提交请求数据的键名
    url:'http://10.167.107.96:8500/hr/GetUserSVInfoByWord?isjsonp=true',//提交请求的地址
    dataType:'jsonp',//请求的数据类型
    outputListLabelKeyName:'label',
    outputListValueKeyName:'value',
    outputListValueIsurl:false,
    autoFocus:true,
    submitFn:function(){
      console.log('submit!')
    }//搜索触发的方法
  };
  var opt=$.extend({},_cfg,options);
  var arr = ['<input type="text" class="input" placeholder="', opt.inputPlaceholderTxt,'">'];
  arr.push('<span class="searchgroup-btn">');
  arr.push('<a href="javascript:;" class="searchsubmit"><i class="searchicon"></i></a>');
  arr.push('</span>');
  this.addClass('searchgroup').html(arr.join(''));
  var el=this,ipt=el.find('.input');
  document.addEventListener('click',function(){
    if(ipt.width()>0){
      el.find('ul').remove();
      ipt.css('width','0px').val('');
    }
  },false);
  this.on('click', function(){
    if(ipt.width()===0) ipt.css('width',opt.width+'px').focus();
    return false;
  });
  this.on('keyup', '.input', function (e) {
    var e=e||window.event,
        value=this.value,
        data={};
    if (e.keyCode==40||e.keyCode==13) {
      return;
    };
    data[opt.searchKeyName]=value;
    if(value.length>3){
      $.ajax({
        type:opt.postType,
        contentType: "test/html;charset=utf-8",
        url:opt.url,
        data:data,
        dataType:opt.dataType,
        success:function(res){
          if(res instanceof String) res=JSON.parse(res);
          if(res instanceof Object){
            
          }
          _list(res);
          opt.autoFocus && el.find('li.selected').length<=0 && _autoFocus();
        }
      });
    }else{
      _list("至少输入四个字符！");
    };
  }).on('keydown', '.input', function (e){
    var e=e||window.event;
    if (e.keyCode==40) {
      var fcus=el.find('li.selected');
      fcus.removeClass('selected').next().addClass('selected');
      ipt.val(fcus.next().find('a')[0].id);
    };
    if (e.keyCode==13) {
      el.find('ul li.selected a').trigger('click');
    };
  }).on('click', '.searchsubmit', function(){
    ipt.width()>0 && opt.submitFn();
  });
  var _autoFocus=function(){
    el.find('ul li').eq(0).addClass('selected');
  };
  var _list=function(data){
    el.find('ul').remove();
    var _c=['<ul class="list">'];
    if(data instanceof Array){
      data=$.map(data,function(item,index){
        return {
          label:item[opt.outputListLabelKeyName],
          value:item[opt.outputListValueKeyName]
        }
      })
      $.each(data,function(index,item){
        var _attr=opt.outputListValueIsurl?'href':'id';
        _c.push('<li><a ',_attr,'="',item.value,'">',item.label,'</a></li>');
      });
    }else{
      _c.push('<li>',data,'</li>');
    }
    _c.push('</ul>');
    el.append(_c.join('')).find('ul').on('click','a',function(){
      if(!opt.outputListValueIsurl){
        ipt.val(this.id);
        el.find('ul').remove();
      };
    });
  };
  return this;
}