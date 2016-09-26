<style lang="sass">
	.max-long-250{
		max-width:250px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow:ellipsis;
	}
	.max-long-200{
		max-width:200px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow:ellipsis;
	}
	.w60{
		width:60px;
	}
	.location{
		.list{
			em{
				color:red;
				font-style: normal;
			}
		}
		
	}
</style>

<template>
	<div class="location">
		<div class="loc-head">
			<h3>搜索结果</h3>
		</div>
		<table class="list">
			<tr>
				<th></th>
				<th>操作</th>
				<th>音乐标题</th>
				<th>歌手</th>
				<th>专辑</th>
			</tr>
			<tr v-if="!notFounded" v-for="(index,val) in list" >
				<td v-bind:class='[index == currentIndex ? "playing" : ""]'>{{index+1}}</td>
				<td class="w60" ></td>
				<td class="max-long-200">
					<a v-bind:class='[index == currentIndex ? "weight" : ""]' data-index="{{index}}" data-id="{{val.songId}}" href="javascript:;" v-on:click.stop="player" >{{{val.name}}}</a>
				</td>
				<td class="max-long-250" title="{{val.singer}}">{{{val.singer}}}</td>
				<td class="max-long-200" title="{{val.ep}}">{{{val.ep}}}</td>
			</tr>
			<tr v-if="notFounded">
				<td colspan="5">查询无结果或网络不给力，请重试~</td>
			</tr>
		</table>
	</div>
</template>

<script>
	export default {
		props:{
			query:{
				type: String
			},
			currentSong:{
				type: String
			},
			currentLink:{
				type: String
			},
			singer:{
				type: String
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
				list:[],
				size: 30,
				notFounded: false,
				page:0,
				currentIndex: -1
			}
		},
		methods:{
			search: function(){
				var self = this;
				this.list = [];
				fetch('http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.search.common&format=json&query='+this.query+'&page_size='+this.size+'&page_no='+this.page,{
					method: 'GET'
				}).then(function(resp){
					return resp.json();
				}).then(function(json){
					var resp = json;
					if(json.song_list){
						self.notFounded = false;
						json.song_list.map(function(val,index){
							self.list.push({
								singer: val.author,
								name: val.title,
								ep: val.album_title,
								songId : val.song_id
							})
						})
					}else{
						self.notFounded = true;
					}
				})
			},
			player: function(e){
				var self = this;
				var id = e.target.getAttribute("data-id");
				this.currentIndex = e.target.getAttribute("data-index");
				if(id == undefined){
					id = e.target.parentNode.getAttribute("data-id")
					this.currentIndex = e.target.parentNode.getAttribute("data-index");
				}
				fetch('http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.song.playAAC&songid='+id,{
					method: 'GET'
				}).then(function(resp){
					return resp.json();
				}).then(function(json){
					var resp = json;
					self.currentLink = 'http://localhost:8081/api/?tourl='+resp.bitrate.file_link;
					self.currentSong = resp.songinfo.title;
					self.singer = resp.songinfo.author;
					self.singerPic = 'http://localhost:8081/api/?tourl='+resp.songinfo.pic_small;
					self.loop = true;
				})
			}
		},
		watch:{
			query: function(){
				this.search();
				this.currentIndex = -1;
			}
		},
		compiled: function(){
			this.search()
		}
	}
</script>