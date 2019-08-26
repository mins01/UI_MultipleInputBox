/**
* MultipleInputBox
* @description : 하나에 여러 입력이 가능하도록 하는 박스를 만든다
* @제한 : MIT 라이센스 + "공대여자는 예쁘다"를 나태낼 수 있어야만 사용할 수 있습니다.
* @author : 공대여자
* @site : www.mins01.com
* @date :2018-12-06~
* @github : https://github.com/mins01/ui_MultipleInputBox
* https://mins01.github.io/ui_MultipleInputBox/
*/

var MultipleInputBox = (function(){
	/**
	* init_create 초기화
	* @param  {html_node} mib
	* @param  {Object} opt config
	* @return {html_node} mib
	*/
	var init = function(mib,cfg){
		/**
		* 기본 모양 만드는 부분
		*/

		mib.boxes = document.createElement('div');
		mib.boxes.className="multipleInputBox-boxes";
		mib.btnAdd = document.createElement('button');
		mib.btnAdd.type="button";
		mib.btnAdd.className="multipleInputBox-btn multipleInputBox-btn-add";
		mib.appendChild(mib.boxes)
		mib.appendChild(mib.btnAdd)
		/**
		* init_method 메소드 설정
		* @param  {html_node} mib
		* @param  {Object} opt config
		*/

		/**
		* removeAllTexts text 들 전부 삭제
		*/
		var removeAllTexts = function(){
			mib.boxes.innerHTML = "";

		}
		/**
		* setCfg 설정값 변경
		* @return {Array}
		*/
		mib.setCfg = function(icfg){
			cfg = Object.assign(cfg,icfg);
		}
		/**
		* toArray 배열로 내용 가져오기
		* @return {Array}
		*/
		mib.toArray = function(){
			var arr = [];
			mib.getInputBoxes().forEach(function(v,k){
				arr.push(v.value);
			});;
			return arr;
		}
		/**
		* getInputBoxes inputbox 의 입력 부분에 대한 Nodelists
		* @return {Array}
		*/
		mib.getInputBoxes = function(){
			return mib.querySelectorAll(".multipleInputBox-input");
		}
		mib.setCustomInputBox = function(customInputBox){
			cfg.customInputBox = customInputBox;
		}

		/**
		* getText 문자열로 내용 가져오기 (.value 와 같음)
		* @return {String}
		*/
		var getText = function(){
			if(mib.hasAttribute('data-useJSON')){
				return JSON.stringify(mib.toArray());
			}else{
				return mib.toArray().join(mib.hasAttribute('data-separator')?mib.getAttribute('data-separator'):',');
			}

		}
		/**
		* setText Text값 설정하기(구분자로 자동 처리함)(.value=~~~ 와 같음)
		* @param  {String} txt
		*/
		var setText = function(txt){
			removeAllTexts();
			// if(txt==""){return;}

			var max = mib.hasAttribute('data-max')?parseInt(mib.getAttribute('data-max')):-1
			var min = mib.hasAttribute('data-min')?parseInt(mib.getAttribute('data-min')):-1

			try{
				if(mib.hasAttribute('data-useJSON')){
					var arr = JSON.parse(txt)
				}else{
					if(txt.length==0){
						var arr = [];
					}else{
						var arr = txt.split(mib.hasAttribute('data-separator')?mib.getAttribute('data-separator'):',');
					}
					
				}
				if(max>0 && arr.length>max){
					arr = arr.splice(0,max);
					mib.addInputBoxes(arr);
					throw "Maximum number exceeded: "+max;
				}else if(min>0 && arr.length<min){
					arr = arr.concat(Array(min-arr.length));
					mib.addInputBoxes(arr);
					throw "Minimum number exceeded: "+min;
				}else{
					mib.addInputBoxes(arr);
				}
			}catch(e){
				console.log(e)
			}
			var box_cnt = mib.querySelectorAll(".multipleInputBox-box").length;
			for(var i=box_cnt,m=min;i<m;i++){
				mib.addInputBox("")
			}

		}
		/**
		* sync 데이터 싱크(속의 input에게 값을 다시 넣음)
		*/
		var sync = function(toMib){
			sync_required();
			var input = mib.querySelector(".multipleInputBox-sync");
			if(input){
				if(toMib){
					// console.log(input.value);
					mib.value = input.value;
				}else{
					input.value = mib.value;
				}
			}
		}
		/**
		 * sync_required data-once-required 설정에 대해서 맨 처음 box의 input에 required 설정한다.
		 * @return {[type]} [description]
		 */
		
		var sync_required = function(){
			if(mib.hasAttribute('data-once-required')){
				var inputs = mib.boxes.querySelectorAll('.multipleInputBox-input');
				inputs.forEach(function(input,idx,arr){
					input.required = (idx===0);
					// if(idx===0){
					// 	console.log(input)
					// }
				});
			}
		}


		var measureText = function(text,el){
			measureText.div.style.font = getComputedStyle(el).font
			measureText.div.innerText = text;
			return measureText.div.getBoundingClientRect()['width'];
		}
		measureText.div = document.createElement("div");
		measureText.div.className ='multipleInputBox-measureText';
		mib.appendChild(measureText.div);

		/**
		* addInputBoxes 배열을 기준으로 여러 textbox 를 추가하기
		* @param  {Array} arr
		*/
		mib.addInputBoxes = function(arr){
			var boxes = []
			var removeEmptyBox = mib.hasAttribute('data-removeEmptyBox');
			for(var i=0,m=arr.length;i<m;i++){
				if(removeEmptyBox && (!arr[i] || arr[i].length==0)){continue;}
				boxes.push(this.addRawInputBox(arr[i]))
			}
			sync(false);
			// mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
			return boxes;
		}
		/**
		* addInputBox textbox 추가하기 (처리 이벤트가 추가됨)
		* @param  {String} str   옵션
		* @return {html_node}
		*/
		mib.addInputBox = function(str){
			var box_cnt = mib.querySelectorAll('.multipleInputBox-box').length;
			var max = mib.hasAttribute('data-max')?parseInt(mib.getAttribute('data-max')):-1
			try{
				if(max>0 && max<=box_cnt){
					throw "Maximum number exceeded: "+ max+">="+box_cnt;;
				}	
			}catch(e){
				console.log(e)
				return null;
			}
			
			
			var box = this.addRawInputBox(str);
			mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
			return box;
		}
		/**
		* addRawInputBox textbox 추가하기
		* @param  {String} str   옵션
		* @return {html_node}
		*/
		mib.addRawInputBox = function(str){
			if(str==undefined||str==null) str='';
			var box = document.createElement('div');
			box.className ="multipleInputBox-box";
			var textType = mib.getAttribute('data-inputBoxType')
			if(!textType) textType = 'text';
			if(textType=='div') textType = 'text';
			switch(textType){
				case "custom":
				var inputBoxType =  cfg.customInputBox;
				break;
				case "div":
				var inputBoxType =  '<div contenteditable="true"></div>';
				break;
				default:
				var inputBoxType =  '<input type="'+textType+'">';
				break;
			}
			var input = null;
			switch(typeof(inputBoxType)){
				case "string":
				var t1 = document.createElement('div')
				t1.innerHTML=inputBoxType;
				input = t1.firstChild;
				break;
				case "function":
				input = cfg.customInputBox(mib);
				break;
				case "object":
				if(cfg.customInputBox instanceof HTMLElement){
					input = cfg.customInputBox.cloneNode(true);
				}
				break;
			}
			if(input == null){
				throw "Failed to create for inputBox";
			}
			input.className+=" multipleInputBox-input";
			var inputs = document.createElement('div');
			inputs.className = "multipleInputBox-inputs"
			var btns = document.createElement('div');
			btns.className="multipleInputBox-btns";
			btns.innerHTML = '<button type="button" class="multipleInputBox-btn multipleInputBox-btn-remove"></button>';
			inputs.appendChild(input);
			box.appendChild(inputs);
			box.appendChild(btns);
			box.btnRemove = box.querySelector(".multipleInputBox-btn-remove");
			box.text = box.querySelector(".multipleInputBox-input");
			box.text.box = box;
			box.text.inputs = inputs;

			if(textType=='div'){
				Object.defineProperty(box.text, 'value', {
					get:function(){ return box.text.innerText.replace(/\n/g,'');; },
					set:function(txt){ box.text.innerText=txt; },
					//value:"init", //기본값 (get,set 과 같이 사용불가)
					//writable: true, //값 수정 가능여부 (get,set 과 같이 사용불가)
					enumerable: true, //목록 열거시 표시여부
					configurable: false //삭제 가능여부. writable 속성 변경 가능 여부
				});
			}
			box.text.value=str
			if(this.hasAttribute('data-list')){
				box.text.setAttribute('list',this.getAttribute('data-list'))
			}
			if(this.hasAttribute('data-prefix')){
				inputs.setAttribute('data-prefix',this.getAttribute('data-prefix'))
			}
			if(this.hasAttribute('data-suffix')){
				inputs.setAttribute('data-suffix',this.getAttribute('data-suffix'))
			}

			var removeBox = function(box){
				var box_cnt = mib.querySelectorAll('.multipleInputBox-box').length;
				var min = mib.hasAttribute('data-min')?parseInt(mib.getAttribute('data-min')):-1
				if(min>0 && min>=box_cnt){
					console.log("Minimum number exceeded:"+ min+"<="+box_cnt);
					return false;
				}		
				box.parentNode.removeChild(box);
				return true;
			}

			box.btnRemove.addEventListener('click',function(evt){
				if(!removeBox(box)){
					return
				}
				mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
				mib.dispatchEvent((new CustomEvent('change',{bubbles: false, cancelable: false, detail: {}})));
			})
			box.text.addEventListener('blur',function(evt){
				if(mib.hasAttribute('data-removeEmptyBox') && this.value==""){
					if(!removeBox(box)){
						return
					}
					mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
					mib.dispatchEvent((new CustomEvent('change',{bubbles: false, cancelable: false, detail: {}})));
				}
			});
			box.text.resizeByText = function(){
				var w = measureText(this.value,this);
				this.style.width='calc('+w+'px + 1.5em)';
			}
			box.text.addEventListener('input',function(evt){
				this.resizeByText();
			});
			box.text.addEventListener('keydown',function(evt){
				if(mib.hasAttribute('data-autoAddInputBox') && (evt.which==9 || evt.which==13 )){ //TAB , ENTER
					if(evt.shiftKey && !this.box.previousElementSibling){
						return;
					}else{
						if(!evt.shiftKey && this.box.nextElementSibling){
							this.box.nextElementSibling.text.focus()
						}else if(evt.shiftKey && this.box.previousElementSibling){
							this.box.previousElementSibling.text.focus()
						}else if(this.value !=''){
							var inputBox = mib.addInputBox()
							if(inputBox){
								inputBox.text.focus();
							}else{
								if(evt.which==13 ){
									evt.stopPropagation();
									evt.preventDefault();
								}
								return false
							}
						}else{
							if(evt.which==13 ){
								evt.stopPropagation();
								evt.preventDefault();
							}
							return false
						}
					}
					evt.stopPropagation();
					evt.preventDefault();
					mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
					return false;
				}else if(mib.hasAttribute('data-autoRemoveInputBox') && (evt.which==8 || evt.which==46 )){
					if(this.value.length==0){
						if(evt.which==8){ //BACKSPACE
							if(this.box.previousElementSibling){
								this.box.previousElementSibling.text.focus();
							}else if(this.box.nextElementSibling){
								this.box.nextElementSibling.text.focus();
							}
						}
						if(evt.which==46){ //DELETE
							if(this.box.nextElementSibling){
								this.box.nextElementSibling.text.focus();
							}else if(this.box.previousElementSibling){
								this.box.previousElementSibling.text.focus();
							}
						}
						if(!removeBox(this.box)){
							return
						}
						evt.stopPropagation();
						evt.preventDefault();
						mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
						return false;
					}

				}else if(evt.which==13 ){
					evt.stopPropagation();
					evt.preventDefault();
					mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
					return false;
				}else if(evt.which==37 && evt.ctrlKey ){ //왼쪽
					if(this.box.previousElementSibling){
						this.box.previousElementSibling.text.focus();
						evt.stopPropagation();
						evt.preventDefault();
						return false;
					}
				}else if(evt.which==39 && evt.ctrlKey){ //오르쪽
					if(this.box.nextElementSibling){
						this.box.nextElementSibling.text.focus();
						evt.stopPropagation();
						evt.preventDefault();
						return false;
					}
				}

			});

			mib.boxes.appendChild(box);
			box.text.resizeByText();
			mib.dispatchEvent((new CustomEvent('addinputbox',{bubbles: false, cancelable: false, detail: {}})));
			return box;
		}

		Object.defineProperty(mib, 'value', {
			get:function(){ return getText(); },
			set:function(txt){ return setText(txt); },
			//value:"init", //기본값 (get,set 과 같이 사용불가)
			//writable: true, //값 수정 가능여부 (get,set 과 같이 사용불가)
			enumerable: true, //목록 열거시 표시여부
			configurable: false //삭제 가능여부. writable 속성 변경 가능 여부
		});
		Object.defineProperty(mib, 'length', {
			get:function(){ return this.getInputBoxes().length; },
			set:function(txt){ },
			//value:"init", //기본값 (get,set 과 같이 사용불가)
			//writable: true, //값 수정 가능여부 (get,set 과 같이 사용불가)
			enumerable: true, //목록 열거시 표시여부
			configurable: false //삭제 가능여부. writable 속성 변경 가능 여부
		});


		/**
		* 이벤트 초기화
		* @param  {html_node} mib
		* @param  {Object} opt config
		*/


		mib.boxes.addEventListener('click',function(evt){
			var box_cnt = mib.querySelectorAll(".multipleInputBox-box").length
			if(box_cnt>0) return;
			var box = mib.addInputBox();
			if(box) box.text.focus();
		})
		mib.btnAdd.addEventListener('click',function(evt){
			var box = mib.addInputBox();
			if(box) box.text.focus();
		})
		mib.addEventListener('input',function(evt){
			sync(false);
			var input = mib.querySelector(".multipleInputBox-sync");
			if(input) input.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
		})

		sync(true); //초기화
	}

	/**
	* 동작 함수
	* @param  {html_node} mib
	* @param  {Object} opt config
	* @return {html_node} mib
	*/
	return function(mib,i_cfg){
		var cfg = Object.assign({"customInputBox":null},i_cfg);
		init(mib,cfg);

		return mib;
	}
})();




(function () {
	if ( typeof window.CustomEvent === "function" ) return false; //If not IE

	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;

	window.CustomEvent = CustomEvent;
})();
