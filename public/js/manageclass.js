//Manage Class 
$(document).ready(function(){

	var winW=  document.documentElement.clientWidth;
	var winH = document.documentElement.clientHeight;
	$("#flex1").flexigrid
		(
			{
				url: 'getclassjsondata',
					dataType: 'json',
					colModel : [
					{display: '班 级 ID', name : 'id', width : 40, sortable : true, align: 'center'},
					{display: '班 级 名 称', name : 'class_name', width : 140, sortable : true, align: 'center'},
					{display: '教 师 ID', name : 'teacher_id', width : 140, sortable : true, hide: true, align: 'center'},
					{display: '教 师 登 录 名', name : 'username', width : 100, sortable : true, align: 'center'},
					{display: '管 理 教 师 ', name : 'name', width : 130, sortable : true, align: 'center'}
					],
					buttons : [
					//{name:'设置管理老师', bclass: 'select_class', onpress : goToDo},
					//{separator: true},
					{name: '编 辑', bclass: 'edit', onpress: goToDo},
					{separator: true},
					{name: '添 加', bclass: 'add', onpress : goToDo},
					{separator: true},
					{name: '删 除', bclass: 'delete', onpress : goToDo},
					{separator: true}
					],
					searchitems : [
					{display: '班级名称', name : 'class_name',isdefault: true},
					{display: '教师名称', name : 'name'},
					{display: '教师登录名', name : 'username'}
					],
					sortname: "id",
					sortorder: "asc",
					usepager: true,
					title: '班级管理',
					useRp: true,
					rp: 30,
					rpOptions :[30,50,60],
					pagestat:'显示第{from}条到{to}条，共{total}条数据。',
					procmsg:'正在处理，请稍后...',
					showTableToggleBtn: true,
					width:'auto',
					height: (winH-155),
					resizable:false,
					checkbox:true
			}
	);   
	
$('div.pSearch').click();
/* 显示提示信 息*/
function alert_msg(msg){			
	$('#alert_msg').text(msg).css('opacity','0.8').show(200,function(){
		var alert_timer = setTimeout( function(){$('#alert_msg').hide();	},800);
	});
}

/* 获得选取的信息 */
function get_selectInfo(grid){
	var dataArray = new Array();
	dataArray['id'] = $('.trSelected td:nth-child(1)',grid).text();
	dataArray['class_name'] = $('.trSelected td:nth-child(2)',grid).text();
	dataArray['teacher_id'] = $('.trSelected td:nth-child(3)',grid).text();
	dataArray['username'] = $('.trSelected td:nth-child(4)',grid).text();
	dataArray['name'] = $('.trSelected td:nth-child(5)',grid).text();
	return dataArray;
}

/*  显示对话框 */
function showDialog(datas){
	
	var html = $('<div id="shade"></div>');
	html.css({
		'opacity':'0.5',
		height:winH,
		width:winW
	});
	$('body').append(html);
	$('#dialog').css('opacity','0.9').show();
	
	if(datas){					/* 编辑 */
		$('#dialog_form input[name=id]').val(datas['id']);
		$('#dialog_form input[name=class_name]').val(datas['class_name']);
		var teacher_name = '#dialog_form option[value='+datas['teacher_id']+']';
		$(teacher_name).attr('selected','selected');
		/** 编辑的 ok 按钮 **/
		$('#okBtn').unbind('click').click(function(){
			var ifClassname = $('#dialog_form input[name=class_name]').val()==datas['class_name'] ? false : true;
			var ifchangeteacher =$('#dialog_form select[name=teacher_id] option:selected').text()==datas['name'] ? false : true;
					if(ifClassname || ifchangeteacher ){
					/** 修改了 **/
						$.post('addorupdateclass',$('form#dialog_form').serialize(),function(data){
							if(data == 'yes') {
								msg = '修改成功!';
								$('#flex1').flexReload();//表格重载  
							}else {
								msg = '修改失败!';
							}
							alert_msg(msg);
						});
						$('#cancelBtn').click();
					}else{
						$('#cancelBtn').click();			
						//alert('not');
						alert_msg('没有修改任何信息');
					}			
		});

	}else{						/** 添加 **/
		/** 添加的 ok 按钮 **/
		$('#okBtn').unbind('click').click(function(){
			var cname  = $('#dialog_form input[name=class_name]').val();
			var tid  = $('#dialog_form select[name=teacher_id]').val();
			$.post('addorupdateclass',{class_name:cname, teacher_id: tid },function(data){
				  if(data == 'yes') {
					  msg = '添加成功!';
					  $('#flex1').flexReload();//表格重载  
				  }else {
					  msg = '添加失败!';
				  }
				  alert_msg(msg);						
			});
			$('#cancelBtn').click();			
		});
	}
	/**** cancel 按钮 ****/
	$('#cancelBtn').click(function(){
		$('#dialog_form input[name=id]').val('');
		$('#dialog_form input[name=class_name]').val('');
		$('#dialog_form select[name=teacher_id]').val('');
		//$('#dialog_form input[name=name]').val('');
		//$('span.notice').text('');
		$('#shade').remove();
		$('#dialog').hide();
	});
}


function goToDo(com,grid)
{
	switch(com){
	case '删 除':
		if($('.trSelected',grid).length == 1){
			var html = $('<div id="shade"></div>');
			html.css({
				'opacity':'0.5',
					height:winH,
					width:winW
			});
			$('body').append(html);
			$('#confirm_msg').show().find('span.confirm_text').text('确定删除'+$('.trSelected',grid).length
				+'个班级？');
			$('#confirm_msg').find('span.warning_text').html(
				"请注意：该班级下所有学生也将被删除，<br/>因为不存在不属于任何一个班级的学生。");
			$('#confirm_yes').unbind('click').click(function(){
				$('#shade').remove();
				var delete_id = $('.trSelected td:nth-child(1)',grid).text();
				$.post('deleteclass',{ class_id:delete_id},function(data){
					if(data == 'yes') {
						alert_msg('删除成功~');
					} else {
						alert_msg('删除失败.');
					}
					$('#flex1').flexReload();//表格重载 
				});
				$('#confirm_msg').hide();
			});
			$('#confirm_cancel').click(function(){
				$('#confirm_msg').hide();
				$('#shade').remove();
			});
		} else if($('.trSelected',grid).length > 1){
			alert_msg('为了避免操作错误，一次只能删除一个班级。');
		}else{
			alert_msg('请选择班级');
		} 
		break;
	case '添 加':
		showDialog();  
		break;	
	case '编 辑':
		var itemsLen = $('.trSelected',grid).length;
		if(itemsLen==0){
			alert_msg('请选择要编辑的班级');
		}else if(itemsLen>1){
			alert_msg('一次只能编辑一行信息');
		}else if(itemsLen==1){
			var datas = get_selectInfo(grid);
			showDialog(datas);
		}
		break;
	}
	$('.btns').live('mouseover',function(){
		$(this).css({
			'background':'url(../images/login_Btn_hover.gif)',
			color:'#fff'
			});
		}).live('mouseout',function(){
			$(this).css({
				'background':'url(../images/login_Btn.gif)',
				color:'#000'
				});
			})
}

});	
