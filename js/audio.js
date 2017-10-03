// JavaScript Document
$(document).ready(function() { 
	"use strict";
	$.ajax({
         type: "POST",//请求方式
         url: "music/music.json",//地址，就是json文件的请求路径
         dataType: "json",//数据类型可以为 text xml json  script  jsonp
　　　　　 success: function(result){//返回的参数就是 action里面所有的有get和set方法的参数	
            add(result);
         }
     });

	//=========================================添加歌单元素
	function add(playlist){
		
	for (var i=0; i<playlist.length; i++){
		var item = playlist[i];
		$('#playlist').append('<li>'+item.artist+' - '+item.title+'</li>');
	}
	
	//=========================================保存初始化数据
	var myaudio = document.getElementById("audio");
	var play = document.getElementById("play");
	var pause = document.getElementById("pause");
	var prev = document.getElementById("prev");
	var next = document.getElementById("next");
	
	var musicIndex = 0;
	var musicMode = 'list';
	
	//=============================================鼠标点击更新进度
		$(function(){
            $('#outline').click(function(e){
                var x=e.pageX;
                var y=$(this).offset().left;
                var z=$(this).width();
                var m=((x-y)/z).toFixed(3);
				var n=100*m+'%';
				$('#inline').width(n);
				myaudio.currentTime = m*myaudio.duration;
            });
        });
	
	//=============================================显示播放进度
	myaudio.addEventListener('timeupdate',sur);
		function sur(){
		if (!isNaN(myaudio.duration)) {
			var surplus =myaudio.currentTime;
			var surplusMin = parseInt(surplus/60);
			var surplusSecond = parseInt(surplus%60);
			if (surplusSecond < 10 ) {
				surplusSecond = '0'+surplusSecond;
			}
			var proportion =parseInt(100*surplus/myaudio.duration);
			$('#inline').css("width",proportion+'%');
			$('#current').text(surplusMin + ":" +surplusSecond);
		}
	}
	//=============================================显示播放时长
	myaudio.addEventListener("canplay",function(){
		var time =myaudio.duration;
		var timeMin = parseInt(time/60);
		var timeSecond = parseInt(time%60);
		if (timeSecond < 10 ) {
			timeSecond = '0'+timeSecond;
		}
		$('#duration').text(timeMin+":"+timeSecond);
  		});

	//=============================================控制音量
			myaudio.volume=0.5;
			$("#inside").width('50%'); 
	//鼠标点击音量条改动音量
		$(function(){
            $('#outside').click(function(e){
                var a=e.pageX;
                var b=$(this).offset().left;
                var c=$(this).width();
                var d=((a-b)/c).toFixed(3);
				var f=100*d+'%';
                $('#inside').width(f);
				myaudio.volume=d;
				if(d<=0.0){
					$("#volume").css('display','none'); 
					$("#mute").css('display','inline-block'); 
				}else{
					$("#mute").css('display','none'); 
					$("#volume").css('display','inline-block');
				}
            });
			
			//鼠标点击图标改动音量
			$('#volume').click(function(){
				$("#volume").css('display','none'); 
				$("#mute").css('display','inline-block'); 
				myaudio.volume=0.0;
				$("#inside").css('width',0); 
			});
			
			$('#mute').click(function(){
				$("#mute").css('display','none'); 
				$("#volume").css('display','inline-block');
				myaudio.volume=0.5;
				$("#inside").css('width','50%'); 
			});
        });
	//============================================绑定事件
	play.onclick=function(){
		toPlay('play');
		$("#play").css('display','none'); 
		$("#pause").css('display','inline-block'); 
	};

	pause.onclick=function(){
		toPlay('pause');
		$("#pause").css('display','none'); 
		$("#play").css('display','inline-block'); 
	};

	prev.onclick=function(){
		toPlay('prev');
		$("#play").css('display','none'); 
		$("#pause").css('display','inline-block'); 
	};

	next.onclick=function(){
		toPlay('next');
		$("#play").css('display','none'); 
		$("#pause").css('display','inline-block'); 
	};
	//===============================================初始化播放器
	initPlayer(musicIndex);
	$("#playlist>li").eq(musicIndex).addClass("playing");
	$("#playlist>li").eq(musicIndex).css('color','#E8CCFF');
	function initPlayer(index){
		//音乐路径
		myaudio.setAttribute('src',playlist[index].mp3);
		//歌名
		$('#title').text(playlist[index].title);
		//歌手
		$('#artist').text(playlist[index].artist);
		//专辑
		$('#album').text(playlist[index].album);
		//头像
		$('#cover').attr('src',playlist[index].cover);
		//歌词
		$('#url').text(playlist[index].url);
		
		sendAjax();
	}
	//=================================================播放
	function toPlay(action){
		if (action === 'play') {
			myaudio.play();
		}
		else if (action === 'pause') {
			myaudio.pause();
		}
		else if (action === 'prev') {
			playMusicMode(action);
		}
		else if (action === 'next') {
			playMusicMode(action);
		}
	}
	
	//==============================================播放结束后播放下一曲
	myaudio.addEventListener('ended',function(){
		playMusicMode('ended');
	},false);
	
	//==============================================点击歌单点播歌曲
	$("#playlist").on("click", "li", function(){
		var i = $(this).index();
		playIndex(i);
	});
	//==============================================根据播放模式计算歌曲索引
	function playMusicMode(action){
		var musicNum = playlist.length;
		var index = musicIndex;

		//列表循环
		if (musicMode === 'list' ) {
			if (action === 'prev') {
				if (index === 0) { //如果是第一首歌，跳到最后一首
					index = musicNum-1;
				}
				else{
					index = index-1;
				}
			}
			else if (action === 'next' || action === 'ended') {
				if (index === musicNum-1) {//如果是最后一首歌，跳到第一首
					index = 0;
				}
				else{
					index = index+1;
				}
			}
		}

		//随机播放
		if (musicMode === 'shuffle') {
			var randomIndex = parseInt(musicNum * Math.random());
			index = randomIndex;
			if (index === musicIndex) {//下一首和当前相同，跳到下一首
				index = index+1;
			}
		}

		//单曲循环
		if (musicMode === 'repeat') {
			if (action === 'prev') {
				if (index === 0) { //如果是第一首歌，跳到最后一首
					index = musicNum-1;
				}
				else{
					index = index-1;
				}
			}
			else if (action === 'next') {
				if (index === musicNum-1) {//如果是最后一首歌，跳到第一首
					index = 0;
				}
				else{
					index = index+1;
				}
			}else{
				//if ended 如果是播放结束自动跳转，不做操作
			}
		}
		musicIndex = index;
		playIndex(index);
	}
	
	//================================================更新歌曲播放索引，重新加载歌曲，并播放
	function playIndex(index){
		initPlayer(index);
		myaudio.load();
		
		$("#playlist>li").removeClass("playing");
    	$("#playlist>li").eq(index).addClass("playing");
		$("#playlist>li").css('color','#aaa');
		$("#playlist>li").eq(index).css('color','#E8CCFF');
		$("#play").css('display','none'); 
		$("#pause").css('display','inline-block'); 
		
		myaudio.addEventListener("canplay",function(){
			toPlay('play');
		});	
	}

	//===============================================播放模式
	$('#repeat').click(function(){
		changeMusicMode(this,'repeat');
		$("#shuffle").css('opacity',0.5); 
		$("#list").css('opacity',0.5); 
		$("#repeat").css('opacity',1.0); 
	});

	$('#shuffle').click(function(){
		changeMusicMode(this,'shuffle');
		$("#list").css('opacity',0.5); 
		$("#repeat").css('opacity',0.5); 
		$("#shuffle").css('opacity',1.0); 
	});
	
	$('#list').click(function(){
		changeMusicMode(this,'list');
		$("#repeat").css('opacity',0.5); 
		$("#shuffle").css('opacity',0.5); 
		$("#list").css('opacity',1.0); 

	});
	//===============================================更改播放模式
	function changeMusicMode(dom,mode){
		musicMode = mode;
	}
		
	//===============================================Ajax获取歌词
	function sendAjax(){
		var url = $("#url").text();
		var songName1 = $('#title').text();
		var songName2 = $('#title').text();
		$.ajax({
			url:url,
			type:'GET',
			dataType:'text',
			data:null,
			error:function(){
				alert('error');
			},
			
			timeout:function(){
				alert('time out');
			},
			success:function (data){
				var lyrics = data.split("\n");//去掉换行
				var lrcObj = {};
				for(var i=0;i<lyrics.length;i++){
        		var lyric = decodeURIComponent(lyrics[i]);
				var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        		var timeRegExpArr = lyric.match(timeReg);
        		var clause = lyric.replace(timeReg,'');
				
				var min = Number(String(timeRegExpArr).slice(1,3));
				var sec = Number(String(timeRegExpArr).slice(4,6));
				var time = min * 60 + sec;
				lrcObj[time] = clause;
				}
				//输出歌词
				myaudio.addEventListener('timeupdate',mylrc);
				function mylrc(){
				var surtimer =parseInt(myaudio.currentTime);
				$('#lrc').text(lrcObj[surtimer]);
				songName1 = $('#tltle').text();	
					if(songName1 !== songName2){
						myaudio.removeEventListener('timeupdate',mylrc);
						sendAjax();
					}
				}
			}
		});	
	}
	
  }
}); 