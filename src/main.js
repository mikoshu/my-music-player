import Vue from 'vue';
import location from './components/location.vue';
import css from './css/style.scss';
import myFavorite from './components/myFavorite.vue';


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
		isMax: false
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
		},
		next: function(){
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
		}
	},
	watch: {
		currentSong: function(){
			this.$els.audio.play();
			this.isPlay = true;
			this.$els.audio.onened = function(){
				console.log("结束")
			}
		}
	},
	components:{
		'location': location,
		'myFavorite': myFavorite
	},
	compiled: function(){
		
	}
})
