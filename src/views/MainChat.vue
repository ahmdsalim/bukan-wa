<template>
  <div>
    	<div class="py-2 px-2 mb-3 bg-success text-light rounded">
    		<div class="d-flex justify-content-between">
    			<div><b>{{ onlinenum }} Online</b></div>
    			<div><b>Public Conversation</b></div>
    		</div>
    	</div>

    	<div class="chatboard">
    	  <template v-for="m in messages">
			  <div v-if="m.name == this.name" class="sent position-relative rounded shadow-sm">
			  	<p>{{m.message}}</p>
			  	<small class="msg-time position-absolute">{{ formatDate(new Date(m.timestamp*1000)) }}</small>
			  </div>
			  <div v-else class="received position-relative rounded shadow-sm">
			  	<span class="msg-name position-absolute fw-bold">{{m.name}}</span>
			  	<p class="mt-2">{{m.message}}</p>
			  	<small class="msg-time position-absolute">{{ formatDate(new Date(m.timestamp*1000)) }}</small>
			  </div>
    	  </template>
		</div>

    	<div class="position-fixed start-50 bottom-0 w-50" id="formbox" style="transform: translate(-50%,0);">
    		<form class="form-wrapper" @submit.prevent="sendMessage">
    			<div class="input-wrapper">
    			 	<input v-model="msg" class="shadow-sm bg-white" type="text" placeholder="Type a message"/>
    			</div>
    			<button class="bg-success shadow-sm" type="submit">Send</button>
    		</form>
    	</div>
  </div>
</template>

<script>
	import db from '@/firebaseDb'
	import {ref, onValue, get, child, set, query, orderByChild} from "firebase/database"
	import {v4 as uuidv4} from 'uuid'

	export default{
		data() {
			return {
				messages: [],
				updatemsg: [],
				msg: "",
				name: "",
				activetab: true,
				onlinenum: 0
			}
		},
		created() {
			this.name = window.localStorage.getItem("name")
			this.setName()
			this.listen()
			this.switchTab()
		},
		mounted() {
			document.addEventListener('visibilitychange', this.switchTab);
		},
		methods: {
			listen(){
				const messageRef = query(ref(db, 'messages'), orderByChild('timestamp'))
				// console.log(messageRef)
				onValue(messageRef, (snapshot) => {
					const data = snapshot.val()
					snapshot.forEach(childSnapshot => {
						this.updatemsg.push(childSnapshot.val())
					})
					this.messages = this.updatemsg
					this.updatemsg = []
				})

				const onlineRef = query(ref(db, 'online'))

				onValue(onlineRef, (snapshot) => {
					const data = snapshot.val()
					this.onlinenum = data
				})
			},
			switchTab() {
			  const isHidden = document.hidden;

			  // Check if visibility state has changed
			  if (isHidden !== this.activetab) {
			    this.activetab = isHidden;

			    const onlineRef = ref(db, 'online');

			    // Use transaction for updating online count
			    get(onlineRef).then((snapshot) => {
			      const currentOnlineNum = snapshot.val() || 0
			      const newOnlineNum = isHidden ? currentOnlineNum - 1 : currentOnlineNum + 1

			      // Ensure online count doesn't go below zero
			      const updatedOnlineNum = Math.max(newOnlineNum, 0)

			      set(onlineRef, updatedOnlineNum)
			        .then(() => {
			          //
			        })
			        .catch((error) => {
			          console.error(error)
			        });
			    }).catch((error) => {
			    	console.error(error)
			    });
			  }
			},
			formatDate(date) {

			    var d = new Date(date),
			        // month = '' + d.getMonth(),
			        // day = '' + d.getDate(),
			        // year = d.getFullYear(),
			        h = '' + d.getHours(),
			        m = '' + d.getMinutes(); 

			    // if (month.length < 2) 
			    //     month = '0' + month;
			    if (h.length < 2)
			    	h = '0' + h;
			    if (m.length < 2)
			    	m = '0' + m;
			    // if (day.length < 2) 
			    //     day = '0' + day;
			    const time = h + '.' + m;
			    // return [day, month, year, time].join(' ');
			    return time;
			},
			sendMessage(event){
				event.preventDefault()
				let t = Date.now().toString()
				const res_t = Number(t.slice(0,10))
				if(this.msg != ""){
					set(ref(db, 'messages/'+uuidv4()),{
						name: this.name,
						message: this.msg,
						timestamp: res_t
					})
					.then(() => {
						this.msg = null
						window.scrollTo(0, document.body.scrollHeight);
					})
					.catch((error) => {
						console.error(error)
					})
				}else{
					alert("Isi dulu pesannya cuy..")
				}
			},
			setName(){
				if(this.name == null){
					var cName = prompt("Masukkan nama")
					if(cName === "" || cName === null){
						alert("Masukin nama dulu cuy")
						this.setName()
					}else{
						this.name = cName
						window.localStorage.setItem("name",this.name)
					}
				}
			}
		}
	}
</script>
<style scoped>

/*	ul{
		padding-left: 1rem;
		padding-right: 1rem;
		list-style: none;
	}
	ul li {
		width: 100%;
		max-width: 400px;
		padding: 1rem;
		margin-top: 1rem;
	}*/

	.chatboard {
		display: grid;
		width: 100%;
		grid-gap: 1rem;
	}

	.sent,
	.received {
	  padding: 1rem;
	  word-wrap: break-word;
	  min-width: 20rem;
	  max-width: 20rem;
	}

	.received {
	  justify-self: left;
	  background-color: #ffffff;
	}

	.sent {
	  text-align: left;
	  justify-self: right;
	  align-content: right;
	  background-color: #d7fad1;
	}

	.msg-name {
		top: 5px;
		left: 16px;
	}

	.msg-time {
		bottom: 5px;
		right: 12px;
		font-size: 12px;
		color: #a5a5a5;
	}

	.form-wrapper {
	    position: relative;
	    left: 0px;
	    top: 0px;
	    width: 100%;
	    height: 40px;
	    display: inline-block;
	}

	.input-wrapper {
	    position: absolute;
	    right: 110px;
	    left: 0px;
	    top : 0px;
	    bottom: 0px;
	}

	.form-wrapper input {
		height: 100%;
	    width: 100%;
	    padding: 8px 10px;
	    float: left;   
	    color: #1f1f9d;
	    border: 0;
	}
	
	.form-wrapper input:focus {
	    outline: none;
	}  

	.form-wrapper button {
	    position: absolute;
	    right: 0px;
	    top: 0px;
	    overflow: visible;

	    border: 0;
	    padding: 0;
	    cursor: pointer;
	    height: 40px;
	    width: 104px;
	    color: #ffffff;
	}

	@media only screen and (max-width: 768px){
		#formbox {
			width: 100% !important;
		}
	}

</style>
