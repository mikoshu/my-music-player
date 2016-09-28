import Vue from 'vue';
import location from './components/location.vue';
import css from './css/style.scss';
import myFavorite from './components/myFavorite.vue';
import search from './components/searchResult.vue';


var app  = new Vue({
	el: '#app',
	data:{
		views: 'testttt',
		tab: 'location',
		isPlay: false,
		isCircle: false,
		currentSong:'',
		playList:[],
		currentLink: '',
		singer:'',
		currentIndex:-1,
		isMax: false,
		query: '',
		singerPic: '',
		loop: false,
		idList: [],
		idIndex: 0,
		songId: ''
	},
	methods:{
		togglePlay: function(){
			if(this.$els.audio.getAttribute('src') == ""){
				alert("请先选择一首音乐再播放哦~")
				return false
			}
			if(this.isPlay){
				this.$els.audio.pause();
				this.isPlay = false;
			}else{
				this.$els.audio.play();
				this.isPlay = true;
			}
		},
		pre: function(){
			var self = this;
			if(!!~this.idIndex ){
				if(this.idIndex > 0){
					this.idIndex -- ;
					var id = this.idList[this.idIndex];
					fetch('http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.song.playAAC&songid='+id,{
						method: 'GET'
					}).then(function(resp){
						return resp.json();
					}).then(function(json){
						var resp = json;
						if(resp.error_code == '22000'){
							self.currentLink = 'http://localhost:8081/api/?tourl='+resp.bitrate.file_link;
							self.songId = resp.songinfo.song_id;
							self.currentSong = resp.songinfo.title;
							self.singer = resp.songinfo.author;
							self.singerPic = 'http://localhost:8081/api/?tourl='+resp.songinfo.pic_small;
						}else{
							alert("网络错误！")
						}
						
					})
				}else{
					alert("已经是第一首歌了哦~~")
				}
			}else{
				var index = parseInt(this.currentIndex);
				if(index > 0){
					index -- ;
					this.currentIndex = index;
					this.currentSong = this.playList[index].name;
					this.currentLink = this.playList[index].link;
					this.singer = this.playList[index].singer;
				}else{
					alert("已经是第一首歌了哦~~")
				}
			}
		},
		next: function(){
			var self = this;
			if(!!~this.idIndex ){
				var len = this.idList.length - 1;
				if(this.idIndex < len){
					this.idIndex ++ ;
					var id = this.idList[this.idIndex];
					fetch('http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.song.playAAC&songid='+id,{
						method: 'GET'
					}).then(function(resp){
						return resp.json();
					}).then(function(json){
						var resp = json;
						if(resp.error_code == '22000'){
							self.currentLink = 'http://localhost:8081/api/?tourl='+resp.bitrate.file_link;
							self.songId = resp.songinfo.song_id;
							self.currentSong = resp.songinfo.title;
							self.singer = resp.songinfo.author;
							self.singerPic = 'http://localhost:8081/api/?tourl='+resp.songinfo.pic_small;
						}else{
							alert("网络错误！")
						}
						
					})
				}else{
					alert("已经是最后首歌了哦~~")
				}
			}else{
				var index = parseInt(this.currentIndex);
				var len = this.playList.length - 1;
				if(index < len){
					index ++ ;
					this.currentIndex = index;
					this.currentSong = this.playList[index].name;
					this.currentLink = this.playList[index].link;
					this.singer = this.playList[index].singer;
				}else{
					alert("已经是最后首歌了哦~~")
				}
			}
		},
		minimize: function(){
			var win = nw.Window.get();
			win.minimize()
		},
		maximize: function(){
			var win = nw.Window.get();
			if(this.isMax){
				win.restore()
				this.isMax = false;
			}else{
				win.maximize()
				this.isMax = true;
			}
		},
		close: function(){
			var win = nw.Window.get();
			win.close()
		},
		reload: function(){
			window.location.reload()
		},
		toLocation: function(){
			this.tab = 'location';
		},
		toFavorite: function(){
			this.tab = 'myFavorite';
		},
		search: function(){ // 搜索歌曲
			this.query = this.$els.input.value;
			this.tab = 'search';
		}
	},
	watch: {
		currentSong: function(){
			this.isPlay = true;
		},
		loop: function(){
			this.$els.audio.loop = this.loop;
		}
	},
	components:{
		'location': location,
		'myFavorite': myFavorite,
		'search': search
	},
	compiled: function(){

	}
})
