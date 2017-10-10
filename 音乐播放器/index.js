$(window).load(function(){
	//初始化
	$("audio").get(0).volume=0.5;
	var music=["music/薛之谦 - 演员.ogg","music/薛之谦 - 丑八怪.mp3","music/薛之谦 - 绅士.mp3","music/薛之谦 - 你还要我怎样.mp3","music/金志文 - 远走高飞 (独唱版).mp3","music/校长 - 带你去旅行.mp3","music/宋孟君 - 王者荣耀.mp3"];
	var sec=[];
	function list(){
		$(".list>i:eq(2) span").text(music.length);
		for(var i=0;i<music.length;i++){
			var aud=$("<audio></audio>");
			aud.attr("src",music[i]);
			$("body").append(aud);			
		}
		setTimeout(function(){
			for(var i=0;i<music.length;i++){
				var n=i+1;
				var seconds=$("audio").get(n).duration;
				var minuts=parseInt(seconds/60);
				var second=Math.ceil(seconds%60);
				var tru=0;
				if(minuts<10){
					if(second<10){
						tru="0"+minuts+":0"+second;
					}else{
						tru="0"+minuts+":"+second;
					}
				}else{
					if(second<10){
						tru=minuts+":0"+second;
					}else{
						tru=minuts+":"+second;
					}
				}
				sec.push(tru);
			}
			$("audio:not(:first)").remove();
		},200)
	}
	list();
	$(".progress p span i:eq(1)").text(sec[0]);
	$.ajax({
		type:"get",
		url:"/lrc/miniportal/static/lyric/99/102636799.xml",
		async:true,
		success:function(data){
			var data=data.getElementsByTagName("lyric")[0].innerHTML.slice(4,-3);
			var html=data.replace(/\[.+\]/g,"").slice(9);
			$(".lrc").html(html);
		}
	});
	//点击音乐列表
	$(".list i:eq(2)").on("click",function(){
		var name=$("audio").attr("src");
		var index=0;
		var html="<ul class='music'>";
		for(var val in music){
			if(music[val]==name){
				index=val
			}
		} 
		for(var i=0;i<music.length;i++){
			if(i==index){
				html+="<li class='active'><p>"+music[i].slice(6,-4)+"</p><span>"+sec[i]+"</span></li>";
			}else{
				html+="<li><p>"+music[i].slice(6,-4)+"</p><span>"+sec[i]+"</span></li>";
			}
		}
		html+="</ul>";
		$(".list>i:eq(2)").attr("data-content",html);
	})
	$(".list").on("click",".music li",function(){
		if($(this).attr("class")!="active"){
			var click_index=$(this).index();
			$(this).addClass("active").siblings().removeClass("active");
			$("audio").attr("src",music[click_index]);
			$(".now").width(0);
			$(".lrc").scrollTop(0);
			play=false;
			n=0;
			setTimeout(function(){
				start(click_index);
				$(".list i:eq(2)").trigger("click")
			},1000)
		}
	})
	//整体居中
	var window_width=$(window).width();
	if(window_width>=1000){
		$(".main").css("left",(window_width-1000)/2);
	}else{
		$(".main").css("left",0);
	}
	$(window).resize(function(){
		var window_width=$(window).width();
		if(window_width>=1000){
			$(".main").css("left",(window_width-1000)/2);
		}else{
			$(".main").css("left",0);
		}
	})
	//随机播放
	function suiji(i){
		var rad=parseInt(Math.random()*music.length);
		while(i==rad){
			rad=parseInt(Math.random()*music.length);
		}
		console.log(rad);
		$("audio").attr("src",music[rad]);
		$(".now").width(0);
		$(".lrc").scrollTop(0);
		play=false;
		n=0;
		setTimeout(function(){
			start(rad);
		},1000)
	}
	//开始/结束播放
	var n=0;
	var play=true;
	function start(i){
		var i=i||0;
		play=true;
		//获取歌曲信息
		var ind=$("audio").attr("src").indexOf("-");
		var ind2=$("audio").attr("src").indexOf(".")
		var name=$("audio").attr("src").slice(ind+2,ind2);
		console.log(name)
		var song_id;
		var img_id;
		var songer;
		var song_name;
		$.ajax({
			type:"get",
			url:"/music/fcgi-bin/music_search_new_platform?t=0&n=1&aggr=1&cr=1&loginUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=1&catZhida=0&remoteplace=sizer.newclient.next_song&w="+name,
			async:false,
			dataType:"json",
			success:function(data){
				var f=data.data.song.list[0].f;
				var song=f.split("|");
				console.log(song);
				song_id=song[0];
				img_id=song[song.length-3];
				songer=song[3];
				song_name=song[1].length>10?song[1].slice(0,10):song[1];
				$(".progress p").html(song_name+" - "+songer+"<span><i>00:00</i> / <i>00:00</i></span>")
			}
		});
		//获取歌词
		$.ajax({
			type:"get",
			url:"/lrc/miniportal/static/lyric/"+song_id%100+"/"+song_id+".xml",
			async:true,
			success:function(data){
				var data=data.getElementsByTagName("lyric")[0].innerHTML.slice(4,-3);
				var html=data.replace(/\[.+\]/g,"").slice(9);
				$(".lrc").html(html);
			},
			error:function(){
				$(".lrc").html("<p>未搜索到相关歌词</p>");
			}
		});
		//获取专辑图片
		/*$.ajax({
			type:"get",
			url:"/img/music/photo/mid_album_90/"+img_id.slice(-2,-1)+"/"+img_id.slice(-1,img_id.length)+"/"+img_id+".jpg",
			async:true,
			dataType:"html",
			success:function(data){
				console.log(data)
			}
		});*/
		var xhr = new XMLHttpRequest();    
	    xhr.open("get", "/img/music/photo/mid_album_90/"+img_id.slice(-2,-1)+"/"+img_id.slice(-1,img_id.length)+"/"+img_id+".jpg", true);
	    xhr.responseType = "blob";
	    xhr.onload = function() {
	        if (this.status == 200) {
	            var blob = this.response;
	           /* var img = document.createElement("img");
	            img.onload = function(e) {
	              window.URL.revokeObjectURL(img.src); 
	            };
	            img.src = window.URL.createObjectURL(blob);*/
	　　　　　　	$(".picture img:eq(1)").attr("src",window.URL.createObjectURL(blob))
	 			$(".bg").css("background-image","url("+window.URL.createObjectURL(blob)+")")
	        	$(".time .img img").attr("src",window.URL.createObjectURL(blob))
	        }
	    } 
	    xhr.send();
		$(".cd_tou").css("transform","rotate(0deg)");
		$(".begin .big").html("&#xe6d0;");
		var time=sec[i];
		$(".progress p span i:eq(1)").text(time);
		time=sec[i].slice(0,2)*60+parseInt(sec[i].slice(-2));
		setTimeout(function(){
			$("audio").get(0).play();
			$(".cd").css("animation","begin 4s linear infinite");
			$(".photo").css("animation","begin 4s linear infinite");
			var lrc=$(".lrc").get(0).scrollHeight;
			if(play){
				n++;
				$(".now").stop().animate({width:300/time*n},1000,"linear");
				$(".lrc").stop().animate({scrollTop:lrc/time*n},1000,"linear");
				var m=parseInt(n/60);
				var s=Math.ceil(n%60);
				if(m<10){
					if(s<10){
						$(".progress p i:eq(0)").text("0"+m+":0"+s);
					}else{
						$(".progress p i:eq(0)").text("0"+m+":"+s);
					}
				}else{
					if(s<10){
						$(".progress p i:eq(0)").text(m+":0"+s);
					}else{
						$(".progress p i:eq(0)").text(m+":"+s);
					}
				}
			}else{
				clearInterval(timer);
			}
			var timer=setInterval(function(){
				if(play){
					n++;
					$(".now").stop().animate({width:300/time*n},1000,"linear");
					$(".lrc").stop().animate({scrollTop:lrc/time*n},1000,"linear");
					var m=parseInt(n/60);
					var s=Math.ceil(n%60);
					if(m<10){
						if(s<10){
							$(".progress p i:eq(0)").text("0"+m+":0"+s);
						}else{
							$(".progress p i:eq(0)").text("0"+m+":"+s);
						}
					}else{
						if(s<10){
							$(".progress p i:eq(0)").text(m+":0"+s);
						}else{
							$(".progress p i:eq(0)").text(m+":"+s);
						}
					}
					if(n>=time){
						clearInterval(timer);
						$(".begin .big").html("&#xe623;");
						$(".cd").css("animation-play-state","paused");
						$(".photo").css("animation-play-state","paused");
						$(".cd_tou").css("transform","rotate(-22deg)");
						n=0;
						$(".begin i:eq(2)").trigger("click")
					}
				}else{
					clearInterval(timer);
				}
			},1000);
		},600)
	}
	function end(){
		$("audio").get(0).pause();
		$(".begin .big").html("&#xe623;");
		$(".cd").css("animation-play-state","paused");
		$(".photo").css("animation-play-state","paused");
		$(".cd_tou").css("transform","rotate(-22deg)");
		$(".now").css("animation-play-state","paused");
		play=false;
	}
	$("audio").on("canplay",can);
	function can(){
		$("audio").off("canplay",can);
		$(".cd,.cd_tou,.photo,.begin .big").on("click",function(){
			if($(".cd").css("animation-play-state")!="paused"){
				end();
			}else{
				start();
				
			}
		})
		//点击跳转位置
		$(".totle").on("click",function(e){
			var mousex=e.offsetX;
			var time=$("audio").get(0).duration;
			n=parseInt(mousex/300*time);
			var m=parseInt(n/60);
			var s=Math.ceil(n%60);
			if(m<10){
				if(s<10){
					$(".progress p i:eq(0)").text("0"+m+":0"+s);
				}else{
					$(".progress p i:eq(0)").text("0"+m+":"+s);
				}
			}else{
				if(s<10){
					$(".progress p i:eq(0)").text(m+":0"+s);
				}else{
					$(".progress p i:eq(0)").text(m+":"+s);
				}
			}
			$("audio").get(0).currentTime=n;
		})
		//弹出框
		$('[data-toggle="popover"]').popover({
			html:true
		})	
		$(".list>i").on("mousedown",function(e){
			if($(".popover").prev().get(0)!=e.target){
				$(".popover").prev().trigger("click")
			}
		})
		//设置音量
		function mousemove(e){
			var val=e.target.value;
			e.target.nextElementSibling.innerText=val+"%";
			$("audio").get(0).volume=val/100;
		}
		$(".list").on("mousedown","input[type=range]",function(){
			$(".list").on("mousemove","input[type=range]",mousemove)
		})
		//播放方式
		$(".list").on("click",".sort li",function(e){
			var icon=e.target.children[0].innerHTML;
			$(".list i:eq(0)").attr("index",$(this).index());
			$(".list i:eq(0)").html(icon);
			$(".list i:eq(0)").trigger("click");
		})
	}
	//点击下一曲
	$(".begin i:eq(2)").on("click",function(){
		var name=$("audio").attr("src");
		var i=0;
		for(var val in music){
			if(music[val]==name){
				i=val
			}
		}
		var fangshi=$(".list i:eq(0)").attr("index");
		if(fangshi==0){
			i=(+i+1)>=music.length?0:(+i+1);
			$("audio").attr("src",music[i]);
			$(".now").width(0);
			$(".lrc").scrollTop(0);
			play=false;
			n=0;
			setTimeout(function(){
				start(i);
			},1000)
		}
		if(fangshi==1){
			suiji(i);
		}
		if(fangshi==2){
			$("audio").attr("src",music[i]);
			$(".now").width(0);
			$(".lrc").scrollTop(0);
			play=false;
			n=0;
			setTimeout(function(){
				start(i);
			},1000)
		}
	})
	//点击上一曲
	$(".begin i:eq(0)").on("click",function(){
		var name=$("audio").attr("src");
		var i=0;
		for(var val in music){
			if(music[val]==name){
				i=val
			}
		}
		var fangshi=$(".list i:eq(0)").attr("index");
		if(fangshi==0){
			i=(+i-1)<0?music.length-1:(+i-1);
			$("audio").attr("src",music[i]);
			$(".now").width(0);
			$(".lrc").scrollTop(0);
			play=false;
			n=0;
			setTimeout(function(){
				start(i);
			},1000)
		}
		if(fangshi==1){
			suiji(i);
		}
		if(fangshi==2){
			$("audio").attr("src",music[i]);
			$(".now").width(0);
			$(".lrc").scrollTop(0);
			play=false;
			n=0;
			setTimeout(function(){
				start(i);
			},1000)
		}
	})
})
