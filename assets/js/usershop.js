var $_GET = (function(){
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();
function changepwd(id,skey) {
	pwdlayer = layer.open({
	  type: 1,
	  title: '修改密码',
	  skin: 'layui-layer-rim',
	  content: '<div class="form-group"><div class="input-group"><div class="input-group-addon">密码</div><input type="text" id="pwd" value="" class="form-control" placeholder="请填写新的密码" required/></div></div><input type="submit" id="save" onclick="saveOrderPwd('+id+',\''+skey+'\')" class="btn btn-primary btn-block" value="保存">'
	});
}
function saveOrderPwd(id,skey) {
	var pwd=$("#pwd").val();
	if(pwd==''){layer.alert('请确保每项不能为空！');return false;}
	var ii = layer.load(2, {shade:[0.1,'#fff']});
	$.ajax({
		type : "POST",
		url : "../ajax.php?act=changepwd",
		data : {id:id,pwd:pwd,skey:skey},
		dataType : 'json',
		success : function(data) {
			layer.close(ii);
			if(data.code == 0){
				layer.msg('保存成功！');
				layer.close(pwdlayer);
			}else{
				layer.alert(data.msg);
			}
		} 
	});
}
function getPoint() {
	if($('#tid option:selected').val()==undefined || $('#tid option:selected').val()=="0"){
		$('#inputsname').html("");
		$('#need').val('');
		$('#alert_frame').hide();
		return false;
	}
	history.replaceState({}, null, './shop.php?cid='+$('#cid').val()+'&tid='+$('#tid option:selected').val());
	var multi = $('#tid option:selected').attr('multi');
	var count = $('#tid option:selected').attr('count');
	var price = $('#tid option:selected').attr('price');
	var shopimg = $('#tid option:selected').attr('shopimg');
	var close = $('#tid option:selected').attr('close');
	if(multi==1 && count>1){
		$('#need').val('￥'+price +"元 ➠ "+count+"个");
	}else{
		$('#need').val('￥'+price +"元");
	}
	if(close == 1){
		$('#submit_buy').val('当前商品已停止下单');
		$('#submit_buy').html('当前商品已停止下单');
		layer.alert('当前商品维护中，停止下单！');
	}else if(price == 0){
		$('#submit_buy').val('立即免费领取');
		$('#submit_buy').html('立即免费领取');
	}else{
		$('#submit_buy').val('立即购买');
		$('#submit_buy').html('立即购买');
	}
	if(multi == 1){
		$('#display_num').show();
	}else{
		$('#display_num').hide();
	}
	var desc = $('#tid option:selected').attr('desc');
	if(desc!='' && alert!='null'){
		$('#alert_frame').show();
		$('#alert_frame').html(unescape(desc));
	}else{
		$('#alert_frame').hide();
	}
	$('#inputsname').html("");
	var inputname = $('#tid option:selected').attr('inputname');
	if(inputname=='hide'){
		$('#inputsname').append('<input type="hidden" name="inputvalue" id="inputvalue" value="'+$.cookie('mysid')+'"/>');
	}else if(inputname!=''){
		$('#inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="inputname">'+inputname+'</div><input type="text" name="inputvalue" id="inputvalue" value="'+($_GET['qq']?$_GET['qq']:'')+'" class="form-control" required onblur="checkInput()"/></div></div>');
	}else{
		$('#inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="inputname">下单ＱＱ</div><input type="text" name="inputvalue" id="inputvalue" value="'+($_GET['qq']?$_GET['qq']:'')+'" class="form-control" required onblur="checkInput()"/></div></div>');
	}
	var inputsname = $('#tid option:selected').attr('inputsname');
	if(inputsname!=''){
		$.each(inputsname.split('|'), function(i, value) {
			if(value.indexOf('{')>0 && value.indexOf('}')>0){
				var addstr = '';
				var selectname = value.split('{')[0];
				var selectstr = value.split('{')[1].split('}')[0];
				$.each(selectstr.split(','), function(i, v) {
					if(v.indexOf(':')>0){
						i = v.split(':')[0];
						v = v.split(':')[1];
					}else{
						i = v;
					}
					addstr += '<option value="'+i+'">'+v+'</option>';
				});
				$('#inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="inputname'+(i+2)+'">'+selectname+'</div><select name="inputvalue'+(i+2)+'" id="inputvalue'+(i+2)+'" class="form-control">'+addstr+'</select></div></div>');
			}else{
			if(value=='说说ID'||value=='说说ＩＤ')
				var addstr='<div class="input-group-addon onclick" onclick="get_shuoshuo(\'inputvalue'+(i+2)+'\',$(\'#inputvalue\').val())">自动获取</div>';
			else if(value=='日志ID'||value=='日志ＩＤ')
				var addstr='<div class="input-group-addon onclick" onclick="get_rizhi(\'inputvalue'+(i+2)+'\',$(\'#inputvalue\').val())">自动获取</div>';
			else if(value=='作品ID'||value=='作品ＩＤ'||value=='快手作品ID')
				var addstr='<div class="input-group-addon onclick" onclick="get_kuaishou(\'inputvalue'+(i+2)+'\',$(\'#inputvalue\').val())">自动获取</div>';
			else if(value=='抖音评论ID')
				var addstr='<div class="input-group-addon onclick" onclick="getCommentList(\'inputvalue'+(i+2)+'\',$(\'#inputvalue\').val())">自动获取</div>';
			else
				var addstr='';
			$('#inputsname').append('<div class="form-group"><div class="input-group"><div class="input-group-addon" id="inputname'+(i+2)+'">'+value+'</div><input type="text" name="inputvalue'+(i+2)+'" id="inputvalue'+(i+2)+'" value="" class="form-control" required/>'+addstr+'</div></div>');
			}
		});
	}
	if($("#inputname").html() == '快手ID'||$("#inputname").html() == '快手ＩＤ'||$("#inputname").html() == '快手用户ID'){
		$('#inputvalue').attr("placeholder", "在此输入快手作品链接 可自动获取");
		if($("#inputname2").html() == '作品ID'||$("#inputname2").html() == '作品ＩＤ'||$("#inputname2").html() == '快手作品ID'){
			$('#inputvalue2').attr("placeholder", "不要在这里手动输入任何内容");
		}
	}else if($("#inputname").html() == '歌曲ID'||$("#inputname").html() == '歌曲ＩＤ'){
		$('#inputvalue').attr("placeholder", "在此输入歌曲的分享链接 可自动获取");
	}else if($("#inputname").html() == '火山ID'||$("#inputname").html() == '火山作品ID'||$("#inputname").html() == '火山视频ID'||$("#inputname").html() == '火山ＩＤ'){
		$('#inputvalue').attr("placeholder", "在此输入火山视频的链接 可自动获取");
	}else if($("#inputname").html() == '抖音ID'||$("#inputname").html() == '抖音作品ID'||$("#inputname").html() == '抖音视频ID'||$("#inputname").html() == '抖音ＩＤ'||$("#inputname").html() == '抖音主页ID'){
		$('#inputvalue').attr("placeholder", "在此输入抖音的分享链接 可自动获取");
	}else if($("#inputname").html() == '微视ID'||$("#inputname").html() == '微视作品ID'||$("#inputname").html() == '微视ＩＤ'){
		$('#inputvalue').attr("placeholder", "在此输入微视的作品链接 可自动获取");
	}else if($("#inputname").html() == '小红书ID'||$("#inputname").html() == '小红书作品ID'){
		$('#inputvalue').attr("placeholder", "在此输入小红书的作品链接 可自动获取");
	}else if($("#inputname").html() == '皮皮虾ID'||$("#inputname").html() == '皮皮虾作品ID'){
		$('#inputvalue').attr("placeholder", "在此输入皮皮虾的作品链接 可自动获取");
	}else if($("#inputname").html() == '微视主页ID'){
		$('#inputvalue').attr("placeholder", "在此输入微视的主页链接 可自动获取");
	}else if($("#inputname").html() == '头条ID'||$("#inputname").html() == '头条ＩＤ'){
		$('#inputvalue').attr("placeholder", "在此输入今日头条的链接 可自动获取");
	}else if($("#inputname").html() == '美拍ID'||$("#inputname").html() == '美拍ＩＤ'||$("#inputname").html() == '美拍作品ID'||$("#inputname").html() == '美拍视频ID'){
		$('#inputvalue').attr("placeholder", "在此输入美拍视频链接 可自动获取");
	}else if($("#inputname").html() == '哔哩哔哩视频ID'||$("#inputname").html() == '哔哩哔哩ID'||$("#inputname").html() == '哔哩视频ID'){
		$('#inputvalue').attr("placeholder", "在此输入哔哩哔哩视频链接 可自动获取");
	}else if($("#inputname").html() == '最右帖子ID'){
		$('#inputvalue').attr("placeholder", "在此输入最右帖子链接 可自动获取");
	}else if($("#inputname").html() == '全民视频ID'||$("#inputname").html() == '全民小视频ID'){
		$('#inputvalue').attr("placeholder", "在此输入全民小视频链接 可自动获取");
	}else if($("#inputname").html() == '美图作品ID'||$("#inputname").html() == '美图视频ID'){
		$('#inputvalue').attr("placeholder", "在此输入美图作品链接 可自动获取");
	}else{
		$('#inputvalue').removeAttr("placeholder");
		$('#inputvalue2').removeAttr("placeholder");
	}
	if($('#tid option:selected').attr('isfaka')==1){
		$('#inputvalue').attr("placeholder", "用于接收卡密以及查询订单使用");
		$('#display_left').show();
		$.ajax({
			type : "POST",
			url : "../ajax.php?act=getleftcount",
			data : {tid:$('#tid option:selected').val()},
			dataType : 'json',
			success : function(data) {
				$('#leftcount').val(data.count)
			}
		});
		if($.cookie('email'))$('#inputvalue').val($.cookie('email'));
	}else{
		$('#display_left').hide();
	}
	var alert = $('#tid option:selected').attr('alert');
	if(alert!='' && alert!='null'){
		var ii=layer.alert(''+unescape(alert)+'',{
			btn:['我知道了'],
			title:'商品提示'
		},function(){
			layer.close(ii);
		});
	}
}
function get_shuoshuo(id,uin,km,page){
	km = km || 0;
	page = page || 1;
	if(uin==''){
		layer.alert('请先填写QQ号！');return false;
	}
	var ii = layer.load(2, {shade:[0.1,'#fff']});
	$.ajax({
		type : "GET",
		url : "../ajax.php?act=getshuoshuo&uin="+uin+"&page="+page+"&hashsalt="+hashsalt,
		dataType : 'json',
		success : function(data) {
			layer.close(ii);
			if(data.code == 0){
				var addstr='';
				$.each(data.data, function(i, item){
					addstr+='<option value="'+item.tid+'">'+item.content+'</option>';
				});
				var nextpage = page+1;
				var lastpage = page>1?page-1:1;
				if($('#show_shuoshuo').length > 0){
					if(km==1){
						$('#show_shuoshuo').html('<div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="get_shuoshuo(\''+id+'\',$(\'#km_inputvalue\').val(),'+km+','+lastpage+')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\''+id+'\');">'+addstr+'</select><div class="input-group-addon onclick" title="下一页" onclick="get_shuoshuo(\''+id+'\',$(\'#km_inputvalue\').val(),'+km+','+nextpage+')"><i class="fa fa-chevron-right"></i></div></div>');
					}else{
						$('#show_shuoshuo').html('<div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="get_shuoshuo(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+lastpage+')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\''+id+'\');">'+addstr+'</select><div class="input-group-addon onclick" title="下一页" onclick="get_shuoshuo(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+nextpage+')"><i class="fa fa-chevron-right"></i></div></div>');
					}
				}else{
					if(km==1){
						$('#km_inputsname').append('<div class="form-group" id="show_shuoshuo"><div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="get_shuoshuo(\''+id+'\',$(\'#km_inputvalue\').val(),'+km+','+lastpage+')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\''+id+'\');">'+addstr+'</select><div class="input-group-addon onclick" title="下一页" onclick="get_shuoshuo(\''+id+'\',$(\'#km_inputvalue\').val(),'+km+','+nextpage+')"><i class="fa fa-chevron-right"></i></div></div></div>');
					}else{
						$('#inputsname').append('<div class="form-group" id="show_shuoshuo"><div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="get_shuoshuo(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+lastpage+')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\''+id+'\');">'+addstr+'</select><div class="input-group-addon onclick" title="下一页" onclick="get_shuoshuo(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+nextpage+')"><i class="fa fa-chevron-right"></i></div></div></div>');
					}
				}
				set_shuoshuo(id);
			}else{
				layer.alert(data.msg);
			}
		} 
	});
}
function set_shuoshuo(id){
	var shuoid = $('#shuoid').val();
	$('#'+id).val(shuoid);
}
function get_rizhi(id,uin,km,page){
	km = km || 0;
	page = page || 1;
	if(uin==''){
		layer.alert('请先填写QQ号！');return false;
	}
	var ii = layer.load(2, {shade:[0.1,'#fff']});
	$.ajax({
		type : "GET",
		url : "../ajax.php?act=getrizhi&uin="+uin+"&page="+page+"&hashsalt="+hashsalt,
		dataType : 'json',
		success : function(data) {
			layer.close(ii);
			if(data.code == 0){
				var addstr='';
				$.each(data.data, function(i, item){
					addstr+='<option value="'+item.blogId+'">'+item.title+'</option>';
				});
				var nextpage = page+1;
				var lastpage = page>1?page-1:1;
				if($('#show_rizhi').length > 0){
					$('#show_rizhi').html('<div class="input-group"><div class="input-group-addon onclick" onclick="get_rizhi(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+lastpage+')"><i class="fa fa-chevron-left"></i></div><select id="blogid" class="form-control" onchange="set_rizhi(\''+id+'\');">'+addstr+'</select><div class="input-group-addon onclick" onclick="get_rizhi(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+nextpage+')"><i class="fa fa-chevron-right"></i></div></div>');
				}else{
					if(km==1){
						$('#km_inputsname').append('<div class="form-group" id="show_rizhi"><div class="input-group"><div class="input-group-addon onclick" onclick="get_rizhi(\''+id+'\',$(\'#km_inputvalue\').val(),'+km+','+lastpage+')"><i class="fa fa-chevron-left"></i></div><select id="blogid" class="form-control" onchange="set_rizhi(\''+id+'\');">'+addstr+'</select><div class="input-group-addon onclick" onclick="get_rizhi(\''+id+'\',$(\'#km_inputvalue\').val(),'+km+','+nextpage+')"><i class="fa fa-chevron-right"></i></div></div></div>');
					}else{
						$('#inputsname').append('<div class="form-group" id="show_rizhi"><div class="input-group"><div class="input-group-addon onclick" onclick="get_rizhi(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+lastpage+')"><i class="fa fa-chevron-left"></i></div><select id="blogid" class="form-control" onchange="set_rizhi(\''+id+'\');">'+addstr+'</select><div class="input-group-addon onclick" onclick="get_rizhi(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+nextpage+')"><i class="fa fa-chevron-right"></i></div></div></div>');
					}
				}
				set_rizhi(id);
			}else{
				layer.alert(data.msg);
			}
		} 
	});
}
function set_rizhi(id){
	var blogid = $('#blogid').val();
	$('#'+id).val(blogid);
}
function fillOrder(id,skey){
	if(!confirm('是否确定补交订单？'))return;
	$.ajax({
		type : "POST",
		url : "../ajax.php?act=fill",
		data : {orderid:id,skey:skey},
		dataType : 'json',
		success : function(data) {
			layer.alert(data.msg);
			$("#submit_query").click();
		}
	});
}
function getsongid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('.qq.com')<0){layer.alert('请输入正确的歌曲的分享链接！');return false;}
	try{
		var songid = songurl.split('s=')[1].split('&')[0];
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的歌曲的分享链接！');return false;
	}
	$('#inputvalue').val(songid);
}
function getkuaishouid(){
	var kuauishouurl=$("#inputvalue").val();
	if(kuauishouurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(kuauishouurl.indexOf('http')<0){layer.alert('请输入正确的快手作品链接！');return false;}
	if(kuauishouurl.indexOf('/s/')>0){
		var ii = layer.load(2, {shade:[0.1,'#fff']});
		$.ajax({
			type : "POST",
			url : "../ajax.php?act=getkuaishou",
			data : {url:kuauishouurl},
			dataType : 'json',
			success : function(data) {
				layer.close(ii);
				if(data.code == 0){
					$('#inputvalue').val(data.authorid);
					if($('#inputvalue2').length>0)$('#inputvalue2').val(data.videoid);
					layer.msg('ID获取成功！下单即可');
				}else{
					layer.alert(data.msg);return false;
				}
			}
		});
	}else{
	try{
		if(kuauishouurl.indexOf('userId=')>0){
			var authorid = kuauishouurl.split('userId=')[1].split('&')[0];
		}else{
			var authorid = kuauishouurl.split('photo/')[1].split('/')[0];
		}
		if(kuauishouurl.indexOf('photoId=')>0){
			var videoid = kuauishouurl.split('photoId=')[1].split('&')[0];
		}else{
			var videoid = kuauishouurl.split('photo/')[1].split('/')[1].split('?')[0];
		}
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的快手作品链接！');return false;
	}
	$('#inputvalue').val(authorid);
	if($('#inputvalue2').length>0)$('#inputvalue2').val(videoid);
	}
}
function get_kuaishou(id,ksid){
	if(ksid==''){
		ksid = $('#inputvalue2').val();
		if(ksid==''){
			layer.alert('请先填写快手作品链接！');return false;
		}
	}
	var zpid = $('#'+id).val();
	if(ksid.indexOf('http')>=0){
		var kuauishouurl = ksid;
	}else if(zpid.indexOf('http')>=0){
		var kuauishouurl = zpid;
	}else if(zpid==''){
		layer.alert('请先填写快手作品链接！');return false;
	}else{
		return true;
	}
	if(kuauishouurl.indexOf('http')<0){layer.alert('请输入正确的快手作品链接！');return false;}
	if(kuauishouurl.indexOf('/s/')>0){
		var ii = layer.load(2, {shade:[0.1,'#fff']});
		$.ajax({
			type : "POST",
			url : "../ajax.php?act=getkuaishou",
			data : {url:kuauishouurl},
			dataType : 'json',
			success : function(data) {
				layer.close(ii);
				if(data.code == 0){
					$('#inputvalue').val(data.authorid);
					$('#inputvalue2').val(data.videoid);
					layer.msg('ID获取成功！下单即可');
				}else{
					layer.alert(data.msg);return false;
				}
			}
		});
	}else{
	try{
		if(kuauishouurl.indexOf('userId=')>0){
			var authorid = kuauishouurl.split('userId=')[1].split('&')[0];
		}else{
			var authorid = kuauishouurl.split('photo/')[1].split('/')[0];
		}
		if(kuauishouurl.indexOf('photoId=')>0){
			var videoid = kuauishouurl.split('photoId=')[1].split('&')[0];
		}else{
			var videoid = kuauishouurl.split('photo/')[1].split('/')[1].split('?')[0];
		}
	}catch(e){
		layer.alert('请输入正确的快手作品链接！');return false;
	}
	$('#inputvalue').val(authorid);
	$('#inputvalue2').val(videoid);
	}
}
function gethuoshanid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('.huoshan.com')<0){layer.alert('请输入正确的链接！');return false;}
	if(songurl.indexOf('/s/')>0){
		var ii = layer.load(2, {shade:[0.1,'#fff']});
		$.ajax({
			type : "POST",
			url : "../ajax.php?act=gethuoshan",
			data : {url:songurl},
			dataType : 'json',
			success : function(data) {
				layer.close(ii);
				if(data.code == 0){
					$('#inputvalue').val(data.songid);
					layer.msg('ID获取成功！下单即可');
				}else{
					layer.alert(data.msg);return false;
				}
			}
		});
	}else{
		try{
			if(songurl.indexOf('video/')>0){
				var songid = songurl.split('video/')[1].split('/')[0];
			}else if(songurl.indexOf('item/')>0){
				var songid = songurl.split('item/')[1].split('/')[0];
			}else if(songurl.indexOf('room/')>0){
				var songid = songurl.split('room/')[1].split('/')[0];
			}else{
				var songid = songurl.split('user/')[1].split('/')[0];
			}
			layer.msg('ID获取成功！下单即可');
		}catch(e){
			layer.alert('请输入正确的链接！');return false;
		}
		$('#inputvalue').val(songid);
	}
}
function getdouyinid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('.douyin.com')<0 && songurl.indexOf('.iesdouyin.com')<0){layer.alert('请输入正确的链接！');return false;}
	if(songurl.indexOf('/v.douyin.com/')>0){
		var ii = layer.load(2, {shade:[0.1,'#fff']});
		$.ajax({
			type : "POST",
			url : "../ajax.php?act=getdouyin",
			data : {url:songurl},
			dataType : 'json',
			success : function(data) {
				layer.close(ii);
				if(data.code == 0){
					$('#inputvalue').val(data.songid);
					layer.msg('ID获取成功！下单即可');
				}else{
					layer.alert(data.msg);return false;
				}
			}
		});
	}else{
	try{
		if(songurl.indexOf('video/')>0){
			var songid = songurl.split('video/')[1].split('/')[0];
		}else if(songurl.indexOf('music/')>0){
			var songid = songurl.split('music/')[1].split('/')[0];
		}else{
			var songid = songurl.split('user/')[1].split('/')[0];
		}
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的链接！');return false;
	}
	$('#inputvalue').val(songid);
	}
}
function gettoutiaoid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('.toutiao.com')<0){layer.alert('请输入正确的链接！');return false;}
	try{
		if(songurl.indexOf('user/')>0){
			var songid = songurl.split('user/')[1].split('/')[0];
		}else{
			var songid = songurl.split('profile/')[1].split('/')[0];
		}
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的链接！');return false;
	}
	$('#inputvalue').val(songid);
}
function getweishiid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('.qq.com')<0){layer.alert('请输入正确的链接！');return false;}
	try{
		if(songurl.indexOf('feed/')>0){
			var songid = songurl.split('feed/')[1].split('/')[0];
		}else if(songurl.indexOf('personal/')>0){
			var songid = songurl.split('personal/')[1].split('/')[0];
		}else{
			var songid = songurl.split('id=')[1].split('&')[0];
		}
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的链接！');return false;
	}
	$('#inputvalue').val(songid);
}
function getxiaohongshuid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('/t.cn/')>0){
		var ii = layer.load(2, {shade:[0.1,'#fff']});
		$.ajax({
			type : "POST",
			url : "../ajax.php?act=getxiaohongshu",
			data : {url:songurl},
			dataType : 'json',
			success : function(data) {
				layer.close(ii);
				if(data.code == 0){
					$('#inputvalue').val(data.songid);
					layer.msg('ID获取成功！下单即可');
				}else{
					layer.alert(data.msg);return false;
				}
			}
		});
	}else{
	if(songurl.indexOf('xiaohongshu.com')<0 && songurl.indexOf('pipix.com')<0){layer.alert('请输入正确的链接！');return false;}
	try{
		var songid = songurl.split('item/')[1].split('?')[0];
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的链接！');return false;
	}
	}
	$('#inputvalue').val(songid);
}
function getbilibiliid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('bilibili.com')<0){layer.alert('请输入正确的视频链接！');return false;}
	try{
		var songid = songurl.split('video/av')[1].split('/')[0];
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的视频链接！');return false;
	}
	$('#inputvalue').val(songid);
}
function getzuiyouid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('izuiyou.com')<0){layer.alert('请输入正确的帖子链接！');return false;}
	try{
		var songid = songurl.split('detail/')[1].split('?')[0];
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的帖子链接！');return false;
	}
	$('#inputvalue').val(songid);
}
function getmeipaiid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('meipai.com')<0){layer.alert('请输入正确的视频链接！');return false;}
	try{
		var songid = songurl.split('media/')[1].split('?')[0];
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的视频链接！');return false;
	}
	$('#inputvalue').val(songid);
}
function getquanminid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('hao222.com')<0){layer.alert('请输入正确的视频链接！');return false;}
	try{
		var songid = songurl.split('vid=')[1].split('&')[0];
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的视频链接！');return false;
	}
	$('#inputvalue').val(songid);
}
function getmeituid(){
	var songurl=$("#inputvalue").val();
	if(songurl==''){layer.alert('请确保每项不能为空！');return false;}
	if(songurl.indexOf('meitu.com')<0){layer.alert('请输入正确的视频链接！');return false;}
	try{
		var songid = songurl.split('feed_id=')[1].split('&')[0];
		layer.msg('ID获取成功！下单即可');
	}catch(e){
		layer.alert('请输入正确的视频链接！');return false;
	}
	$('#inputvalue').val(songid);
}
function getCommentList(id,aweme_id,km,page){
	km = km || 0;
	page = page || 1;
	if(aweme_id==''){
		layer.alert('请先填写抖音作品ID！');return false;
	}
	if(aweme_id.length != 19){
		layer.alert('抖音作品ID填写错误');return false;
	}
	var ii = layer.load(2, {shade:[0.1,'#fff']});
	$.ajax({
		type : "GET",
		url : "https://api.douyin.qlike.cn/api.php?act=GetCommentList&aweme_id="+aweme_id+"&page="+page,
		dataType : 'json',
		success : function(data) {
			layer.close(ii);
			if(data.total != 0){
				var addstr='';
				$.each(data.comments, function(i, item){
					addstr+='<option value="'+item.cid+'">[昵称 => '+item.user.nickname+'][内容 => '+item.text+'][赞数量=>'+item.digg_count+']</option>';
				});
				var nextpage = page+1;
				var lastpage = page>1?page-1:1;
				if($('#show_shuoshuo').length > 0){
					$('#show_shuoshuo').html('<div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="getCommentList(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+lastpage+')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\''+id+'\');">'+addstr+'</select><div class="input-group-addon onclick" title="下一页" onclick="getCommentList(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+nextpage+')"><i class="fa fa-chevron-right"></i></div></div>');
				}else{
					if(km==1){
						$('#km_inputsname').append('<div class="form-group" id="show_shuoshuo"><div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="getCommentList(\''+id+'\',$(\'#km_inputvalue\').val(),'+km+','+lastpage+')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\''+id+'\');">'+addstr+'</select><div class="input-group-addon onclick" title="下一页" onclick="getCommentList(\''+id+'\',$(\'#km_inputvalue\').val(),'+km+','+nextpage+')"><i class="fa fa-chevron-right"></i></div></div></div>');
					}else{
						$('#inputsname').append('<div class="form-group" id="show_shuoshuo"><div class="input-group"><div class="input-group-addon onclick" title="上一页" onclick="getCommentList(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+lastpage+')"><i class="fa fa-chevron-left"></i></div><select id="shuoid" class="form-control" onchange="set_shuoshuo(\''+id+'\');">'+addstr+'</select><div class="input-group-addon onclick" title="下一页" onclick="getCommentList(\''+id+'\',$(\'#inputvalue\').val(),'+km+','+nextpage+')"><i class="fa fa-chevron-right"></i></div></div></div>');
					}
				}
				set_shuoshuo(id);
			}else{
				layer.alert('您的作品好像没人评论');
			}
		},
		error: function(a) {
			layer.close(ii);
			layer.alert('网络错误，请稍后重试');
		}
	});
}
function queryOrder(type,content,page){
	$('#submit_query').val('Loading');
	$('#result2').hide();
	$('#list').html('');
	$.ajax({
		type : "POST",
		url : "../ajax.php?act=query",
		data : {type:type, qq:content, page:page},
		dataType : 'json',
		success : function(data) {
			if(data.code == 0){
				var status;
				$.each(data.data, function(i, item){
					if(item.status==1)
						status='<span class="label label-success">已完成</span>';
					else if(item.status==2)
						status='<span class="label label-warning">处理中</span>';
					else if(item.status==3)
						status='<span class="label label-danger">异常</span>&nbsp;<button type="submit" class="btn btn-info btn-xs" onclick="fillOrder('+item.id+',\''+item.skey+'\')">补交</button>';
					else if(item.status==4)
						status='<font color=red>已退款</font>';
					else
						status='<span class="label label-primary">待处理</span>';
					$('#list').append('<tr orderid='+item.id+'><td>'+item.input+'</td><td>'+item.name+'</td><td>'+item.value+'</td><td class="hidden-xs">'+item.addtime+'</td><td>'+status+'</td><td><a onclick="showOrder('+item.id+',\''+item.skey+'\')" title="查看订单详细" class="btn btn-info btn-xs">详细</a></td></tr>');
					if(item.result!=null){
						if(item.status==3){
							$('#list').append('<tr><td colspan=6><font color="red">异常原因：'+item.result+'</font></td></tr>');
						}
					}
				});
				var addstr = '';
				if(data.islast==true) addstr += '<button class="btn btn-primary btn-xs pull-left" onclick="queryOrder(\''+data.type+'\',\''+data.content+'\','+(data.page-1)+')">上一页</button>';
				if(data.isnext==true) addstr += '<button class="btn btn-primary btn-xs pull-right" onclick="queryOrder(\''+data.type+'\',\''+data.content+'\','+(data.page+1)+')">下一页</button>';
				$('#list').append('<tr><td colspan=6>'+addstr+'</td></tr>');
				$("#result2").slideDown();
				if($_GET['buyok']){
					showOrder(data.data[0].id,data.data[0].skey)
				}
			}else{
				layer.alert(data.msg);
			}
			$('#submit_query').val('立即查询');
		} 
	});
}
function showOrder(id,skey){
	var ii = layer.load(2, {shade:[0.1,'#fff']});
	var status = ['<span class="label label-primary">待处理</span>','<span class="label label-success">已完成</span>','<span class="label label-warning">处理中</span>','<span class="label label-danger">异常</span>','<font color=red>已退款</font>'];
	$.ajax({
		type : "POST",
		url : "../ajax.php?act=order",
		data : {id:id,skey:skey},
		dataType : 'json',
		success : function(data) {
			layer.close(ii);
			if(data.code == 0){
				var item = '<table class="table table-condensed table-hover">';
				item += '<tr><td colspan="6" style="text-align:center"><b>订单基本信息</b></td></tr><tr><td class="info">订单编号</td><td colspan="5">'+id+'</td></tr><tr><td class="info">商品名称</td><td colspan="5">'+data.name+'</td></tr><tr><td class="info">订单金额</td><td colspan="5">'+data.money+'元</td></tr><tr><td class="info">购买时间</td><td colspan="5">'+data.date+'</td></tr><tr><td class="info">下单信息</td><td colspan="5">'+data.inputs+'</td><tr><td class="info">订单状态</td><td colspan="5">'+status[data.status]+'</td></tr>';
				if(data.complain){
					item += '<tr><td class="info">订单操作</td><td><a href="./workorder.php?my=add&orderid='+id+'&skey='+skey+'" target="_blank" onclick="return checklogin('+data.islogin+')" class="btn btn-xs btn-default">投诉订单</a></td></tr>';
				}
				if(data.list && data.list.order_state){
					item += '<tr><td colspan="6" style="text-align:center"><b>订单实时状态</b></td><tr><td class="warning">下单数量</td><td>'+data.list.num+'</td><td class="warning">下单时间</td><td colspan="3">'+data.list.add_time+'</td></tr><tr><td class="warning">初始数量</td><td>'+data.list.start_num+'</td><td class="warning">当前数量</td><td>'+data.list.now_num+'</td><td class="warning">订单状态</td><td><font color=blue>'+data.list.order_state+'</font></td></tr>';
				}else if(data.kminfo){
					item += '<tr><td colspan="6" style="text-align:center"><b>以下是你的卡密信息</b></td><tr><td colspan="6">'+data.kminfo+'</td></tr>';
				}else if(data.result){
					item += '<tr><td colspan="6" style="text-align:center"><b>处理结果</b></td><tr><td colspan="6">'+data.result+'</td></tr>';
				}
				if(data.desc){
					item += '<tr><td colspan="6" style="text-align:center"><b>商品简介</b></td><tr><td colspan="6" style="white-space: normal;">'+data.desc+'</td></tr>';
				}
				item += '</table>';
				layer.open({
				  type: 1,
				  title: '订单详细信息',
				  skin: 'layui-layer-rim',
				  content: item
				});
			}else{
				layer.alert(data.msg);
			}
		}
	});
}
var handlerEmbed = function (captchaObj) {
	captchaObj.appendTo('#captcha');
	captchaObj.onReady(function () {
		$("#captcha_wait").hide();
	}).onSuccess(function () {
		var result = captchaObj.getValidate();
		if (!result) {
			return alert('请完成验证');
		}
		var ii = layer.load(2, {shade:[0.1,'#fff']});
		$.ajax({
			type : "POST",
			url : "../ajax.php?act=pay",
			data : {tid:$("#tid").val(),inputvalue:$("#inputvalue").val(),inputvalue2:$("#inputvalue2").val(),inputvalue3:$("#inputvalue3").val(),inputvalue4:$("#inputvalue4").val(),inputvalue5:$("#inputvalue5").val(),num:$("#num").val(),hashsalt:hashsalt,geetest_challenge:result.geetest_challenge,geetest_validate:result.geetest_validate,geetest_seccode:result.geetest_seccode},
			dataType : 'json',
			success : function(data) {
				layer.close(ii);
				if(data.code >= 0){
					$('#alert_frame').hide();
					alert('领取成功！');
					window.location.href='?buyok=1';
				}else{
					layer.alert(data.msg);
					captchaObj.reset();
				}
			} 
		});
	});
};
function toTool(cid,tid){
	history.replaceState({}, null, './shop.php?cid='+cid+'&tid='+tid);
	$("#recommend").modal('hide');
	$_GET['tid']=tid;
	$_GET["cid"]=cid;
	$("#cid").val(cid);
	$("#cid").change();
	$("#goodType").hide('normal');
	$("#goodTypeContent").show('normal');
}
function dopay(type,orderid){
	if(type == 'rmb'){
		var ii = layer.msg('正在提交订单请稍候...', {icon: 16,shade: 0.5,time: 15000});
		$.ajax({
			type : "POST",
			url : "../ajax.php?act=payrmb",
			data : {orderid: orderid},
			dataType : 'json',
			success : function(data) {
				layer.close(ii);
				if(data.code == 1){
					alert(data.msg);
					window.location.href='?buyok=1';
				}else if(data.code == -2){
					alert(data.msg);
					window.location.href='?buyok=1';
				}else if(data.code == -3){
					var confirmobj = layer.confirm('你的余额不足，请充值！', {
					  btn: ['立即充值','取消']
					}, function(){
						window.location.href='./#chongzhi';
					}, function(){
						layer.close(confirmobj);
					});
				}else{
					layer.alert(data.msg);
				}
			} 
		});
	}else{
		window.location.href='../other/submit.php?type='+type+'&orderid='+orderid;
	}
}
function cancel(orderid){
	layer.closeAll();
	$.ajax({
		type : "POST",
		url : "../ajax.php?act=cancel",
		data : {orderid: orderid, hashsalt: hashsalt},
		dataType : 'json',
		async : true,
		success : function(data) {
			if(data.code == 0){
			}else{
				layer.msg(data.msg);
				window.location.reload();
			}
		},
		error:function(data){
			window.location.reload();
		}
	});
}
function checkInput() {
	if($("#inputname").html() == '快手ID'||$("#inputname").html() == '快手ＩＤ'||$("#inputname").html() == '快手用户ID'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			getkuaishouid();
		}
	}
	else if($("#inputname").html() == '歌曲ID'||$("#inputname").html() == '歌曲ＩＤ'){
		if($("#inputvalue").val().indexOf("s=") ==-1){
			if($("#inputvalue").val().length != 12 && $("#inputvalue").val().length != 16){
				layer.alert('歌曲ID是一串12位或16位的字符!<br>输入K歌作品链接即可！');
				return false;
			}
		}else if($("#inputvalue").val()!=''){
			getsongid();
		}
	}
	else if($("#inputname").html() == '火山ID'||$("#inputname").html() == '火山作品ID'||$("#inputname").html() == '火山视频ID'||$("#inputname").html() == '火山ＩＤ'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			gethuoshanid();
		}
	}
	else if($("#inputname").html() == '抖音ID'||$("#inputname").html() == '抖音作品ID'||$("#inputname").html() == '抖音视频ID'||$("#inputname").html() == '抖音ＩＤ'||$("#inputname").html() == '抖音主页ID'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			getdouyinid();
		}
	}
	else if($("#inputname").html() == '微视ID'||$("#inputname").html() == '微视作品ID'||$("#inputname").html() == '微视ＩＤ'||$("#inputname").html() == '微视主页ID'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			getweishiid();
		}
	}
	else if($("#inputname").html() == '头条ID'||$("#inputname").html() == '头条ＩＤ'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			gettoutiaoid();
		}
	}
	else if($("#inputname").html() == '小红书ID'||$("#inputname").html() == '小红书作品ID'||$("#inputname").html() == '皮皮虾ID'||$("#inputname").html() == '皮皮虾作品ID'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			getxiaohongshuid();
		}
	}
	else if($("#inputname").html() == '美拍ID'||$("#inputname").html() == '美拍ＩＤ'||$("#inputname").html() == '美拍作品ID'||$("#inputname").html() == '美拍视频ID'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			getmeipaiid();
		}
	}
	else if($("#inputname").html() == '哔哩哔哩视频ID'||$("#inputname").html() == '哔哩哔哩ID'||$("#inputname").html() == '哔哩视频ID'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			getbilibiliid();
		}
	}
	else if($("#inputname").html() == '最右帖子ID'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			getzuiyouid();
		}
	}
	else if($("#inputname").html() == '全民视频ID'||$("#inputname").html() == '全民小视频ID'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			getquanminid();
		}
	}
	else if($("#inputname").html() == '美图作品ID'||$("#inputname").html() == '美图视频ID'){
		if($("#inputvalue").val()!='' && $("#inputvalue").val().indexOf('http')>=0){
			getmeituid();
		}
	}
}
function openCart(){
	var area = [$(window).width() > 640 ? '640px' : '95%', $(window).height() > 600 ? '600px' : '90%'];
	var options = {
		type: 2,
		title: '我的购物车',
		shadeClose: true,
		shade: false,
		maxmin: true,
		moveOut: true,
		area: area,
		content: '../?mod=cart',
		zIndex: layer.zIndex,
		success: function (layero, index) {
			var that = this;
			$(layero).data("callback", that.callback);
			layer.setTop(layero);
			if ($(layero).height() > $(window).height()) {
				layer.style(index, {
					top: 0,
					height: $(window).height()
				});
			}
		},
		cancel: function(){
			window.location.reload();
		}
	}
	if ($(window).width() < 480 || (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && top.$("body").size() > 0)) {
		options.area = [top.$("body").width() + "px", top.$("body").height() + "px"];
		options.offset = [top.$("body").scrollTop() + "px", "0px"];
	}
	layer.open(options);
}
$(document).ready(function(){
$('.goodTypeChange').click(function(){
	var id = $(this).data('id');
	var img = $(this).data('img');
	history.replaceState({}, null, './shop.php?cid='+id);
	$("#cid").val(id);
	$("#cid").change();
	$("#goodType").hide('normal');
	$("#goodTypeContent").show('normal');
});
$(".nav-tabs,.backType").click(function(){
	history.replaceState({}, null, './shop.php');
	$("#goodType").show('normal');
	$("#goodTypeContent").hide('normal');
})
$("#showSearchBar").click(function () {
	$("#display_selectclass").slideToggle();
	$("#display_searchBar").slideToggle();
});
$("#closeSearchBar").click(function () {
	$("#display_searchBar").slideToggle();
	$("#display_selectclass").slideToggle();
});
$("#doSearch").click(function () {
	var kw = $("#searchkw").val();
	if(kw==''){$("#closeSearchBar").click();return;}
	var ii = layer.load(2, {shade:[0.1,'#fff']});
	$("#tid").empty();
	$("#tid").append('<option value="0">请选择商品</option>');
	$.ajax({
		type : "POST",
		url : "../ajax.php?act=gettool",
		data : {kw:kw},
		dataType : 'json',
		success : function(data) {
			layer.close(ii);
			if(data.code == 0){
				var num = 0;
				$.each(data.data, function (i, res) {
					$("#tid").append('<option value="'+res.tid+'" cid="'+res.cid+'" price="'+res.price+'" desc="'+escape(res.desc)+'" alert="'+escape(res.alert)+'" inputname="'+res.input+'" inputsname="'+res.inputs+'" multi="'+res.multi+'" isfaka="'+res.isfaka+'" count="'+res.value+'" close="'+res.close+'" prices="'+res.prices+'" max="'+res.max+'" min="'+res.min+'">'+res.name+'</option>');
					num++;
				});
				$("#tid").val(0);
				getPoint();
				if(num==0 && cid!=0)$("#tid").html('<option value="0">没有搜索到相关商品</option>');
			}else{
				layer.alert(data.msg);
			}
		},
		error:function(data){
			layer.msg('加载失败，请刷新重试');
			return false;
		}
	});
});
$("#cid").change(function () {
	var cid = $(this).val();
	if(cid>0)history.replaceState({}, null, './shop.php?cid='+cid);
	var ii = layer.load(2, {shade:[0.1,'#fff']});
	$("#tid").empty();
	$("#tid").append('<option value="0">请选择商品</option>');
	$.ajax({
		type : "GET",
		url : "../ajax.php?act=gettool&cid="+cid+"&info=1",
		dataType : 'json',
		success : function(data) {
			layer.close(ii);
			$("#tid").empty();
			$("#tid").append('<option value="0">请选择商品</option>');
			if(data.code == 0){
				if(data.info!=null){
					$("#className").html(data.info.name);
					if(data.info.shopimg)
						$("#classImg").attr('src',data.info.shopimg.indexOf("://")>0?data.info.shopimg:'../'+data.info.shopimg);
					else
						$("#classImg").attr('src','');
				}
				var num = 0;
				$.each(data.data, function (i, res) {
					$("#tid").append('<option value="'+res.tid+'" cid="'+res.cid+'" price="'+res.price+'" desc="'+escape(res.desc)+'" alert="'+escape(res.alert)+'" inputname="'+res.input+'" inputsname="'+res.inputs+'" multi="'+res.multi+'" isfaka="'+res.isfaka+'" count="'+res.value+'" close="'+res.close+'" prices="'+res.prices+'" max="'+res.max+'" min="'+res.min+'">'+res.name+'</option>');
					num++;
				});
				if($_GET["tid"] && $_GET["cid"]==cid){
					var tid = parseInt($_GET["tid"]);
					$("#tid").val(tid);
				}else{
					$("#tid").val(0);
				}
				getPoint();
				if(num==0 && cid!=0)$("#tid").html('<option value="0">该分类下没有商品</option>');
			}else{
				layer.alert(data.msg);
			}
		},
		error:function(data){
			layer.msg('加载失败，请刷新重试');
			return false;
		}
	});
});
	$("#submit_buy").click(function(){
		var tid=$("#tid").val();
		if(tid==0){layer.alert('请选择商品！');return false;}
		var inputvalue=$("#inputvalue").val();
		if(inputvalue=='' || tid==''){layer.alert('请确保每项不能为空！');return false;}
		if($("#inputvalue2").val()=='' || $("#inputvalue3").val()=='' || $("#inputvalue4").val()=='' || $("#inputvalue5").val()==''){layer.alert('请确保每项不能为空！');return false;}
		if(($('#inputname').html()=='下单ＱＱ' || $('#inputname').html()=='ＱＱ账号' || $("#inputname").html() == 'QQ账号') && (inputvalue.length<5 || inputvalue.length>11 || isNaN(inputvalue))){layer.alert('请输入正确的QQ号！');return false;}
		var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		if($('#inputname').html()=='你的邮箱' && !reg.test(inputvalue)){layer.alert('邮箱格式不正确！');return false;}
		reg=/^[1][0-9]{10}$/;
		if($('#inputname').html()=='手机号码' && !reg.test(inputvalue)){layer.alert('手机号码格式不正确！');return false;}
		if($("#inputname2").html() == '说说ID'||$("#inputname2").html() == '说说ＩＤ'){
			if($("#inputvalue2").val().length != 24){layer.alert('说说必须是原创说说！');return false;}
		}
		checkInput();
		if($("#inputname2").html() == '作品ID'||$("#inputname2").html() == '作品ＩＤ'){
			if($("#inputvalue2").val()!='' && $("#inputvalue2").val().indexOf('http')>=0){
				$("#inputvalue").val($("#inputvalue2").val());
				get_kuaishou('inputvalue2',$('#inputvalue').val());
			}
		}
		if($("#inputname").html() == '抖音作品ID'||$("#inputname").html() == '火山作品ID'||$("#inputname").html() == '火山直播ID'){
			if($("#inputvalue").val().length != 19){layer.alert('您输入的作品ID有误！');return false;}
		}
		if($("#inputname2").html() == '抖音评论ID'){
			if($("#inputvalue2").val().length != 19){layer.alert('您输入的评论ID有误！请点击自动获取手动选择评论！');return false;}
		}
		var ii = layer.load(2, {shade:[0.1,'#fff']});
		$.ajax({
			type : "POST",
			url : "../ajax.php?act=pay",
			data : {tid:tid,inputvalue:$("#inputvalue").val(),inputvalue2:$("#inputvalue2").val(),inputvalue3:$("#inputvalue3").val(),inputvalue4:$("#inputvalue4").val(),inputvalue5:$("#inputvalue5").val(),num:$("#num").val(),hashsalt:hashsalt},
			dataType : 'json',
			success : function(data) {
				layer.close(ii);
				if(data.code == 0){
					if($('#inputname').html()=='你的邮箱'){
						$.cookie('email', inputvalue);
					}
					var paymsg = '';
					paymsg+='<button class="btn btn-success btn-block" onclick="dopay(\'rmb\',\''+data.trade_no+'\')">使用余额支付</button>';
					layer.alert('<center><h2>￥ '+data.need+'</h2><hr>'+paymsg+'<hr><a class="btn btn-default btn-block" onclick="cancel(\''+data.trade_no+'\')">取消订单</a></center>',{
						btn:[],
						title:'提交订单成功',
						closeBtn: false
					});
				}else if(data.code == 1){
					$('#alert_frame').hide();
					if($('#inputname').html()=='你的邮箱'){
						$.cookie('email', inputvalue);
					}
					alert('领取成功！');
					window.location.href='?buyok=1';
				}else if(data.code == 2){
					$.getScript("//static.geetest.com/static/tools/gt.js");
					layer.open({
					  type: 1,
					  title: '完成验证',
					  skin: 'layui-layer-rim',
					  area: ['320px', '100px'],
					  content: '<div id="captcha"><div id="captcha_text">正在加载验证码</div><div id="captcha_wait"><div class="loading"><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div></div></div></div>'
					});
					$.ajax({
						url: "../ajax.php?act=captcha&t=" + (new Date()).getTime(),
						type: "get",
						dataType: "json",
						success: function (data) {
							$('#captcha_text').hide();
							$('#captcha_wait').show();
							initGeetest({
								gt: data.gt,
								challenge: data.challenge,
								new_captcha: data.new_captcha,
								product: "popup",
								width: "100%",
								offline: !data.success
							}, handlerEmbed);
						}
					});
				}else if(data.code == 3){
					layer.alert(data.msg, {
						closeBtn: false
					}, function(){
						window.location.reload();
					});
				}else{
					layer.alert(data.msg);
				}
			} 
		});
	});
	$("#submit_cart_shop").click(function(){
		var tid=$("#tid").val();
		if(tid==0){layer.alert('请选择商品！');return false;}
		var inputvalue=$("#inputvalue").val();
		if(inputvalue=='' || tid==''){layer.alert('请确保每项不能为空！');return false;}
		if($("#inputvalue2").val()=='' || $("#inputvalue3").val()=='' || $("#inputvalue4").val()=='' || $("#inputvalue5").val()==''){layer.alert('请确保每项不能为空！');return false;}
		if(($('#inputname').html()=='下单ＱＱ' || $('#inputname').html()=='ＱＱ账号' || $("#inputname").html() == 'QQ账号') && (inputvalue.length<5 || inputvalue.length>11 || isNaN(inputvalue))){layer.alert('请输入正确的QQ号！');return false;}
		var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		if($('#inputname').html()=='你的邮箱' && !reg.test(inputvalue)){layer.alert('邮箱格式不正确！');return false;}
		reg=/^[1][0-9]{10}$/;
		if($('#inputname').html()=='手机号码' && !reg.test(inputvalue)){layer.alert('手机号码格式不正确！');return false;}
		if($("#inputname2").html() == '说说ID'||$("#inputname2").html() == '说说ＩＤ'){
			if($("#inputvalue2").val().length != 24){layer.alert('说说必须是原创说说！');return false;}
		}
		checkInput();
		if($("#inputname2").html() == '作品ID'||$("#inputname2").html() == '作品ＩＤ'){
			if($("#inputvalue2").val()!='' && $("#inputvalue2").val().indexOf('http')>=0){
				$("#inputvalue").val($("#inputvalue2").val());
				get_kuaishou('inputvalue2',$('#inputvalue').val());
			}
		}
		if($("#inputname").html() == '抖音作品ID'||$("#inputname").html() == '火山作品ID'||$("#inputname").html() == '火山直播ID'){
			if($("#inputvalue").val().length != 19){layer.alert('您输入的作品ID有误！');return false;}
		}
		if($("#inputname2").html() == '抖音评论ID'){
			if($("#inputvalue2").val().length != 19){layer.alert('您输入的评论ID有误！请点击自动获取手动选择评论！');return false;}
		}
		var ii = layer.load(2, {shade:[0.1,'#fff']});
		$.ajax({
			type : "POST",
			url : "../ajax.php?act=pay&method=cart_add",
			data : {tid:tid,inputvalue:$("#inputvalue").val(),inputvalue2:$("#inputvalue2").val(),inputvalue3:$("#inputvalue3").val(),inputvalue4:$("#inputvalue4").val(),inputvalue5:$("#inputvalue5").val(),num:$("#num").val(),hashsalt:hashsalt},
			dataType : 'json',
			success : function(data) {
				layer.close(ii);
				if(data.code == 0){
					if($('#inputname').html()=='你的邮箱'){
						$.cookie('email', inputvalue);
					}
					$('#cart_count').html(data.cart_count);
					$('#alert_cart').slideDown();
					layer.msg('添加至购物车成功~点击下方进入购物车列表结算');
				}else if(data.code == 3){
					layer.alert(data.msg, {
						closeBtn: false
					}, function(){
						window.location.reload();
					});
				}else{
					layer.alert(data.msg);
				}
			} 
		});
	});
	$("#submit_query").click(function(){
		var qq=$("#qq3").val();
		var type=$("#searchtype").val();
		queryOrder(type,qq,1);
	});

$("#num_add").click(function () {
	var i = parseInt($("#num").val());
	if ($("#need").val() == ''){
		layer.alert('请先选择商品');
		return false;
	}
	var multi = $('#tid option:selected').attr('multi');
	var count = parseInt($('#tid option:selected').attr('count'));
	if (multi == '0'){
		layer.alert('该商品不支持选择数量');
		return false;
	}
	i++;
	$("#num").val(i);
	var price = parseFloat($('#tid option:selected').attr('price'));
	var prices = $('#tid option:selected').attr('prices');
	if(prices!='' || prices!='null'){
		var discount = 0;
		$.each(prices.split(','), function(index, item){
			if(i>=parseInt(item.split('|')[0]))discount = parseFloat(item.split('|')[1]);
		});
		price = price - discount;
	}
	price = price * i;
	count = count * i;
	if(count>1)$('#need').val('￥'+price.toFixed(2) +"元 ➠ "+count+"个");
	else $('#need').val('￥'+price.toFixed(2) +"元");
});
$("#num_min").click(function (){
	var i = parseInt($("#num").val());
	if(i<=1){
    	layer.msg('最低下单一份哦！'); 
      	return false;
    }
	if ($("#need").val() == ''){
		layer.alert('请先选择商品');
		return false;
	}
	var multi = $('#tid option:selected').attr('multi');
	var count = parseInt($('#tid option:selected').attr('count'));
	if (multi == '0'){
		layer.alert('该商品不支持选择数量');
		return false;
	}
	i--;
	if (i <= 0) i = 1;
	$("#num").val(i);
	var price = parseFloat($('#tid option:selected').attr('price'));
	var prices = $('#tid option:selected').attr('prices');
	if(prices!='' || prices!='null'){
		var discount = 0;
		$.each(prices.split(','), function(index, item){
			if(i>=parseInt(item.split('|')[0]))discount = parseFloat(item.split('|')[1]);
		});
		price = price - discount;
	}
	price = price * i;
	count = count * i;
	if(count>1)$('#need').val('￥'+price.toFixed(2) +"元 ➠ "+count+"个");
	else $('#need').val('￥'+price.toFixed(2) +"元");
});
$("#num").keyup(function () {
	var i = parseInt($("#num").val());
	if(isNaN(i))return false;
	var price = parseFloat($('#tid option:selected').attr('price'));
	var count = parseInt($('#tid option:selected').attr('count'));
	var prices = $('#tid option:selected').attr('prices');
	if(i<1) $("#num").val(1);
	if(prices!='' || prices!='null'){
		var discount = 0;
		$.each(prices.split(','), function(index, item){
			if(i>=parseInt(item.split('|')[0]))discount = parseFloat(item.split('|')[1]);
		});
		price = price - discount;
	}
	price = price * i;
	count = count * i;
	if(count>1)$('#need').val('￥'+price.toFixed(2) +"元 ➠ "+count+"个");
	else $('#need').val('￥'+price.toFixed(2) +"元");
});


if($_GET['buyok']){
	var orderid = $_GET['orderid'];
	$("#tab-query").tab('show');
	$("#submit_query").click();
	isModal=false;
}else if($_GET['chadan']){
	$("#tab-query").tab('show');
	isModal=false;
}
if($_GET['cid']){
	var cid = parseInt($_GET['cid']);
	$("#cid").val(cid);
}
$("#cid").change();


});

