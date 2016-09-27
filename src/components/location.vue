<style lang='sass'>
	.location{
		width:100%;
		height:100%;
		position:relative;
		a{
			color:#ff0021;
		}
		dl{
			position:absolute;
			width:100%;
			text-align: center;
			left: 50%;
			top:40%;
			transform:translate(-50%,-50%);
			dt{
				margin-top:10px;
				font-size:18px;
			}
		}
		.hide{
			visibility:hidden;
		}
		.list{
			width:100%;
			font-size:12px;
			color:#666;
			border-top:1px solid #ccc;
			th{
				font-weight: normal;
				text-align: left;
				border-left:1px solid #ccc;
				border-bottom:1px solid #ccc;
				padding:4px 10px;
			}
			th:first-child{
				border-left:none;
			}
			td{
				padding:4px 10px;
				a{
					color:#000;
				}
			}
			tr:nth-child(even){
				background: #f5f5f7;
			}
			.weight{
				font-weight: bold;
			}
			.playing{
				overflow: hidden;
				text-indent: -999px;
				background: url(http://demo.mikoshu.me/player/icon-playing.png) no-repeat 10px 5px ;
			}
		}
		.loc-head{
			padding:20px 10px 5px 10px;
			h3{
				font-weight: normal;
				font-size:20px;
			}
		}
	}
</style>

<template>
	<div class="location">
		<div v-show="hide" >
			<dl>
				<dd><a v-on:click="chooseFolder" href="javascript:;"><img src="http://demo.mikoshu.me/player/folder.png" alt=""></a></dd>
				<dt>还木有载入本地文件哦！<a v-on:click="chooseFolder" href="javascript:;">点击此处</a> 选择文件夹载入！</dt>
			</dl>
			<input type="file" class="hide" v-on:change="choosed" v-el:file nwdirectory >
		</div>
		<div v-show="!hide">
			<div class="loc-head">
				<h3>本地音乐</h3>
			</div>
			<table class="list">
				<tr>
					<th></th>
					<th>音乐标题</th>
					<th>歌手</th>
					<th>专辑</th>
					<th>大小</th>
				</tr>
				<tr v-show="hasMusic" v-for="(index,val) in musicList" >
					<td v-bind:class='[index == currentIndex ? "playing" : ""]'>{{index+1}}</td>
					<td><a href="javascript:;" v-bind:class='[index == currentIndex ? "weight" : ""]' data-index="{{index}}" data-link="{{val.link}}" data-singer="{{val.singer}}" v-on:click="play">{{val.name}}</a></td>
					<td>{{val.singer}}</td>
					<td>{{val.ep}}</td>
					<td>{{val.size}}</td>
				</tr>
				<tr v-show="!hasMusic">
					<td colspan="5" style="text-align:center; font-size:18px;">该文件夹里木有音乐，请<a v-on:click="chooseFolder" href="javascript:;">点击此处</a>重新选择文件夹！</td>
				</tr>
			</table>
		</div>
		
	</div>
</template>

<script>
	import fs from 'fs';
	import path from 'path';
	export default {
		props:{
			currentSong:{
				type: String
			},
			playList:{
				type: Array
			},
			currentLink:{
				type:String
			},
			singer:{
				type:String
			},
			currentIndex:{
				type: Number
			},
			singerPic:{
				type: String
			},
			loop:{
				type: Boolean
			}
		},
		data: function(){
			return {
				musicList: [],
				hide: true,
				folderList: [],
				hasMusic: false,
			};
		},
		methods:{
			chooseFolder: function(){
				this.$els.file.click()
			},
			choosed: function(e){
				var dirname = e.target.value;
				if(this.folderList.length > 0){
					this.folderList.forEach(function(val){
						if(val == dirname){
							alert('该目录已存在，请勿重复添加');
						}else{
							this.folderList.push(dirname);
						}
					}.bind(this))
				}else{
					this.folderList.push(dirname);
				}
				localStorage.folderList = this.folderList;
				localStorage.folderList.split(",").forEach(function(val){
					console.log(val)
					this.readFile(val);
				}.bind(this))
			},
			readFile: function(dirname){ // 读取路径并且递归文件夹
				var self = this;
				var dir = fs.readdirSync(dirname)
				dir.forEach(function(val){
					val = path.join(dirname,val);
					fs.stat(val,function(err,stat){
						if(err){
							throw err
						}else{
							if(stat.isDirectory()){
								self.readFile(val,dir)
							}else{
								// https://github.com/leetreveil/musicmetadata
								var ext = path.extname(val); // 判断文件是否为音频
								if(ext == ".mp3" || ext == ".wav" || ext == ".wma" || ext == ".ogg" || ext == ".ape" || ext == ".acc"){
									console.log(stat)
									var basename = path.basename(val);
									var name = basename.split("-")[1].split(".")[0];
									var singer = basename.split("-")[0];
									var size = (parseInt(stat.size)/1024/1024).toFixed(1) + "MB";
									self.hasMusic = true;
									self.musicList.push({name:name,singer:singer,link:val,size:size,ep:'未知'})
								}
							}
						}
					})
				})
				this.hide = false;
			},
			play: function(e){
				var link = e.target.getAttribute('data-link');
				var name = e.target.innerHTML;
				var singer = e.target.getAttribute('data-singer');
				this.currentSong = name;
				this.currentLink = link+"?xcode=fsda5f454as4fe";
				this.singer = singer;
				this.playList = this.musicList;
				this.currentIndex = parseInt(e.target.getAttribute('data-index'));
				this.singerPic = "";
				this.loop = false;
			}
		},
		compiled: function(){
			if(localStorage.folderList){
				this.folderList = localStorage.folderList.split(",");
			}
			if(this.folderList.length == 0){
				this.hide = true;
			}else{
				this.hide = false;
				this.folderList.forEach(function(val){
					this.readFile(val)
				}.bind(this))
			}
			console.log( process.cwd() )
		}
	}
</script>