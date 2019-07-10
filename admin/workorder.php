<?php  
include('../includes/common.php');
$title='工单列表';
include('./head.php');
if ($islogin!=1) 
{
	exit('<script language=\'javascript\'>window.location.href=\'./login.php\';</script>');
}
echo '<style>
.gdan_gout{width:100%;height:auto;background-color:#fff;padding-bottom:1em}
.gdan_txt{height:3em;line-height:3em;text-indent:1em;font-family:"微软雅黑";font-weight:800;}
.gdan_txt>span{position:absolute;right:4em;}
.gdan_zhugan{width:96%;height:auto;padding-top:1em;margin-left:2%;padding-left:.5em;padding-right:1em;margin-bottom:1em;border-top:dashed 1px #a9a9a9}
.gdan_kjia1{width:auto;margin-left:4em;margin-top:-3em}
.gdan_xiaozhi{width:100%;height:1em;color:#a9a9a9;margin-bottom:1em}
.gdan_xiaozhi>span{position:absolute;right:4em;}
.gdan_huifu{width:100%;height:auto;margin-top:1em;border-top:solid #ccc 1px}
.gdan_srk{width:98%;height:8em;margin-left:1%;margin-top:1em;border-color:#6495ed}
.gdan_huifu1{width:6em;height:2.5em;border:none;background-color:#1e90ff;color:#fff;margin:.5em 0 .5em 1%}
.gdan_jied{width:100%;height:3em;line-height:3em;text-align:center;color:#129DDE}
</style>
   <div class="col-sm-12 col-md-10 center-block" style="float: none;">
';
$my=(isset($_GET['my'])?$_GET['my']:NULL);
if ($my=='view') 
{
	$id=intval($_GET['id']);
	$rows=$DB->get_row('select * from shua_workorder where id=\''.$id.'\' limit 1');
	if (!$rows) 
	{
		showmsg('当前记录不存在！',3);
	}
	$contents=explode('*',$rows['content']);
	$siterow=$DB->get_row('select zid,qq from shua_site where zid=\''.$rows['zid'].'\' limit 1');
	$myimg='//q2.qlogo.cn/headimg_dl?bs=qq&dst_uin='.$siterow['qq'].'&src_uin='.$siterow['qq'].'&fid='.$siterow['qq'].'&spec=100&url_enc=0&referer=bu_interface&term_type=PC';
	$kfimg='https://imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/work-order/css/img/custom-service-avatar.svg';
	echo '<div class="block">
<div class="block-title">
<div class="block-options pull-right"><a href="./workorder.php" class="btn btn-default"><i class="fa fa-times"></i></a></div>
<h3 class="panel-title"><i class="fa fa-sticky-note-o"></i>&nbsp;&nbsp;<b>工单详情</b></h3>
</div>

<div class="gdan_gout">
	<div class="gdan_txt">沟通记录 - ';
	echo count($contents);
	echo '<span>状态：';
	echo display_status($rows['status']);
	echo '</span></div>
	<!------------------开始沟通------------------------>
	<div class="gdan_zhugan" style="border: none;">
		<a href="./sitelist.php?zid=';
	echo $rows['zid'];
	echo '" target="_blank"><img src="';
	echo $myimg;
	echo '" class="img-circle" width="40"/></a>
		<div class="gdan_kjia1">
			<div class="gdan_xiaozhi">问题描述<span>';
	echo $rows['addtime'];
	echo '</span></div>
			';
	echo $contents[0];
	echo '<br/><br/>
			订单编号：';
	echo ($rows['orderid']?'<a href="./list.php?id='.$rows['orderid'].'" target="_blank">'.$rows['orderid'].'</a>':'无订单号');
	echo '<br/>
			问题类型：';
	echo display_type($rows['type']);
	echo '		</div>
	</div>
';
	$i=1;
	while ($i<count($contents)) 
	{
		$content=explode('^',$contents[$i]);
		if (count($content)==3) 
		{
			echo "<div class=\"gdan_zhugan\">\\r\\n\\t<img src=\"".($content[0]==1 ? $kfimg : $myimg)."\" class=\"img-circle\" width=\"40\"/>\\r\\n\\t<div class=\"gdan_kjia1\">\\r\\n\\t<div class=\"gdan_xiaozhi\">".($content[0]==1 ? '官方客服' : $userrow['user']).'<span>'.$content[1]."</span></div>\\r\\n\\t".$content[2]."\\r\\n\\t</div>\\r\\n</div>";
		}
		$i=$i+1;
	}
	if ($rows['status']==2) 
	{
		echo '<div class="gdan_jied">此工单已经结单</div>
';
	}
	else 
	{
		echo '<div class="gdan_huifu">
<form action="./workorder.php?my=reply&id=';
		echo $id;
		echo '" method="POST">
	<textarea class="gdan_srk" name="content" placeholder="回复后工单状态自动变为已处理 ,分站站点将会收到通知哦！" required></textarea>
	<input type="submit" name="submit" value="提交回复" class="gdan_huifu1" />
	<input type="button" name="submit" value="完结工单" class="gdan_huifu1" style="background-color: mediumseagreen;" onclick="window.location.href=\'./workorder.php?my=complete&id=';
		echo $id;
		echo '\'"/>
</form>
</div>
';
	}
	echo '</div>
<div class="gdan_txt"><a href="./workorder.php">>>返回工单列表</a></div>
</div>
';
}
else 
{
	if ($my=='reply') 
	{
		$id=intval($_GET['id']);
		$rows=$DB->get_row('select * from shua_workorder where id=\''.$id.'\' limit 1');
		if (!$rows) 
		{
			showmsg('当前记录不存在！',3);
		}
		else 
		{
			if ($rows['status']==2) 
			{
				showmsg('此工单已经结单',3);
			}
		}
		$content=str_replace(array(0=>'*',1=>'^',2=>'|'),'',trim(strip_tags(daddslashes($_POST['content']))));
		if (empty($content)) 
		{
			showmsg('补充信息不能为空！');
		}
		else 
		{
			$content=addslashes($rows['content']).'*1^'.$date.'^'.$content;
			if ($DB->query('update shua_workorder set content=\''.$content.'\',status=1 where id=\''.$id.'\'')) 
			{
				exit('<script language=\'javascript\'>alert(\'回复工单成功！\');history.go(-1);</script>');
			}
			else 
			{
				showmsg('回复工单失败！'.$DB->error(),4);
			}
		}
	}
	else 
	{
		if ($my=='complete') 
		{
			$id=intval($_GET['id']);
			$rows=$DB->get_row('select * from shua_workorder where id=\''.$id.'\' limit 1');
			if (!$rows) 
			{
				showmsg('当前记录不存在！',3);
			}
			else 
			{
				if ($rows['status']==2) 
				{
					showmsg('此工单已经结单',3);
				}
			}
			if ($DB->query('update shua_workorder set status=2 where id=\''.$id.'\'')) 
			{
				exit('<script language=\'javascript\'>alert(\'完结工单成功！\');history.go(-1);</script>');
			}
			else 
			{
				showmsg('完结工单失败！'.$DB->error(),4);
			}
		}
		else 
		{
			if ($my=='delete') 
			{
				$id=intval($_GET['id']);
				$sql='DELETE FROM shua_workorder WHERE id=\''.$id.'\'';
				if ($DB->query($sql)) 
				{
					exit('<script language=\'javascript\'>alert(\'删除成功！\');history.go(-1);</script>');
				}
				else 
				{
					showmsg('删除失败！'.$DB->error(),4);
				}
			}
			else 
			{
				$count1=$DB->count('SELECT count(*) FROM shua_workorder WHERE 1');
				$count2=$DB->count('SELECT count(*) FROM shua_workorder WHERE status=0');
				$count3=$DB->count('SELECT count(*) FROM shua_workorder WHERE status=1');
				$count4=$DB->count('SELECT count(*) FROM shua_workorder WHERE status=2');
				if (isset($_GET['status'])) 
				{
					$status=intval($_GET['status']);
					$sql=' status='.$status;
				}
				else 
				{
					$sql=' 1';
				}
				$numrows=$DB->count('SELECT count(*) from shua_workorder WHERE'.$sql);
				$pagesize=30;
				$pages=intval($numrows/$pagesize);
				if ($numrows%$pagesize) 
				{
					$pages=$pages+1;
				}
				if (isset($_GET['page'])) 
				{
					$page=intval($_GET['page']);
				}
				else 
				{
					$page=1;
				}
				$offset=$pagesize*($page-1);
				echo '<div class="block">
<div class="block-title clearfix">
<h2>工单列表&nbsp;&nbsp;<a href="./workorder.php" class="btn btn-primary btn-xs">全部(';
				echo $count1;
				echo ')</a>&nbsp;<a href="./workorder.php?status=0" class="btn btn-info btn-xs">待处理(';
				echo $count2;
				echo ')</a>&nbsp;<a href="./workorder.php?status=1" class="btn btn-warning btn-xs">处理中(';
				echo $count3;
				echo ')</a>&nbsp;<a href="./workorder.php?status=2" class="btn btn-success btn-xs">已完成(';
				echo $count4;
				echo ')</a></h2>
</div>
     <div class="table-responsive">
       <table class="table table-striped">
         <thead><tr><th>ID</th><th>ZID</th><th>类型</th><th>订单号</th><th>问题描述</th><th>状态</th><th>提交时间</th><th>操作</th></tr></thead>
         <tbody>
';
				$rs=$DB->query('SELECT * FROM shua_workorder WHERE'.$sql.' order by id desc limit '.$offset.','.$pagesize);
				while ($res=$DB->fetch($rs)) 
				{
					$content=explode('*',$res['content']);
					$content=mb_substr($content[0],0,16,'utf-8');
					echo '<tr><td><b>'.$res['id'].'</b></td><td><a href="./sitelist.php?zid='.$res['zid'].'" target="_blank">'.$res['orderid'].'</a></td><td>'.display_type($res['type']).'</td><td><a href="./list.php?id='.$res['orderid'].'" target="_blank">'.$res['orderid'].'</a></td><td><a href="./workorder.php?my=view&id='.$res['id'].'">'.$content.'</a></td><td>'.display_status($res['status']).'</td><td>'.$res['addtime'].'</td><td><a href="./workorder.php?my=view&id='.$res['id'].'" class="btn btn-info btn-xs">查看</a>&nbsp;<a href="./workorder.php?my=delete&id='.$res['id'].'" class="btn btn-xs btn-danger" onclick="return confirm(\'你确实要删除此工单吗？\');">删除</a></td></tr>';
				}
				echo '          </tbody>
       </table>
     </div>
';
				echo '<div class="text-center"><ul class="pagination">';
				$first=1;
				$prev=$page-1;
				$next=$page+1;
				$last=$pages;
				if ($page>1) 
				{
					echo '<li><a href="workorder.php?page='.$first.$link.'">首页</a></li>';
					echo '<li><a href="workorder.php?page='.$prev.$link.'">&laquo;</a></li>';
				}
				else 
				{
					echo '<li class="disabled"><a>首页</a></li>';
					echo '<li class="disabled"><a>&laquo;</a></li>';
				}
				$i=1;
				while ($i<$page) 
				{
					echo '<li><a href="workorder.php?page='.$i.$link.'">'.$i.'</a></li>';
					$i=$i+1;
				}
				echo '<li class="disabled"><a>'.$page.'</a></li>';
				if ($pages>=10) 
				{
					$s=10;
				}
				else 
				{
					$s=$pages;
				}
				$i=$page+1;
				while ($i<=$s) 
				{
					echo '<li><a href="workorder.php?page='.$i.$link.'">'.$i.'</a></li>';
					$i=$i+1;
				}
				echo '';
				if ($page<$pages) 
				{
					echo '<li><a href="workorder.php?page='.$next.$link.'">&raquo;</a></li>';
					echo '<li><a href="workorder.php?page='.$last.$link.'">尾页</a></li>';
				}
				else 
				{
					echo '<li class="disabled"><a>&raquo;</a></li>';
					echo '<li class="disabled"><a>尾页</a></li>';
				}
				echo '</ul></div>';
			}
		}
	}
}
echo '    </div>
 </div>
</div>
';
function display_type($type)
{
	if ($type==1) 
	{
		return '业务补单';
	}
	if ($type==2) 
	{
		return '卡密错误';
	}
	if ($type==3) 
	{
		return '充值没到账';
	}
	if ($type==4) 
	{
		return '中途改了密码';
	}
	return '其它问题';
}
function display_status($status)
{
	if ($status==1) 
	{
		return '<font color="red">处理中</font>';
	}
	if ($status==2) 
	{
		return '<font color="green">已完成</font>';
	}
	return '<font color="blue">待处理</font>';
}
?>