<?php
/**
 * 分站排行
**/
include("../includes/common.php");
$title='分站排行';
include './head.php';
if($islogin==1){}else exit("<script language='javascript'>window.location.href='./login.php';</script>");
?>
    <div class="col-xs-12 col-sm-10 col-md-8 center-block" style="float: none;">
<?php
$thtime=date("Y-m-d").' 00:00:00';
$lastday=date("Y-m-d",strtotime("-1 day")).' 00:00:00';
if($_GET['last']==1){
	$sql = "select a.zid,(select b.sitename from shua_site as b where a.zid=b.zid) as sitename,count(id) as count,sum(money) as money from shua_orders as a where addtime>'$lastday' and addtime<'$thtime' and zid>1 group by zid order by money desc limit 10";
	$title = '昨日分站排行&nbsp;[<a href="rank.php">查看今日</a>]';
}else{
	$sql = "select a.zid,(select b.sitename from shua_site as b where a.zid=b.zid) as sitename,count(id) as count,sum(money) as money from shua_orders as a where addtime>'$thtime' and zid>1 group by zid order by money desc limit 10";
	$title = '今日分站排行&nbsp;[<a href="rank.php?last=1">查看昨日</a>]';
}

?>
<div class="block">
     <div class="block-title"><h2><?php echo $title?></h2></div>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead><tr><th class="text-center">排名</th><th class="text-center">站点ID</th><th class="text-center">站点名称</th><th class="text-center">订单数</th><th class="text-center">销售金额</th></tr></thead>
          <tbody>
<?php
$rs=$DB->query($sql);
$i=1;
while($res = $DB->fetch($rs))
{
echo '<tr><td class="text-center"><span class="badge badge-danger">'.$i.'</span></td><td class="text-center"><b>'.$res['zid'].'</b></td><td class="text-center">'.$res['sitename'].'</td><td class="text-center">'.$res['count'].'</td><td class="text-center">'.$res['money'].'</td></tr>';
$i++;
}
?>
          </tbody>
        </table>
      </div>
    </div>
 </div>
</div>