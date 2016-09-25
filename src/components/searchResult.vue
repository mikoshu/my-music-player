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
	<!-- <audio src="http://yinyueshiting.baidu.com/data2/music/13184116/13184116.mp3?xcode=3002ab949bc13a9b4394f800f7f2550e" controls></audio> -->
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
				<td>{{index+1}}</td>
				<td class="w60"></td>
				<td class="max-long-200">
					<a data-id="{{val.songId}}" href="javascript:;" v-on:click.stop="player" >{{{val.name}}}</a>
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
		},
		data: function(){
			return {
				list:[],
				size: 30,
				notFounded: false,
				page:0
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
				if(id == undefined){
					id = e.target.parentNode.getAttribute("data-id")
				}
				console.log(id);
				fetch('http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.song.playAAC&songid='+id,{
					method: 'GET'
				}).then(function(resp){
					return resp.json();
				}).then(function(json){
					var resp = json;
					self.currentLink = resp.bitrate.file_link;
					console.log(resp);
				})
			}
		},
		watch:{
			query: function(){
				this.search()
			}
		},
		compiled: function(){
			this.search()
		}
	}
</script>