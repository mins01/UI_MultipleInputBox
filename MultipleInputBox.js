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
	var init_create = function(mib,opt){		
		// mib.innerHTML = '<div class="multipleInputBox-boxes"></div><button class="multipleInputBox-btn multipleInputBox-btn-add"></button>'
		var input = mib.querySelector("input,textarea");
		mib.input = input?input:null;;
		mib.boxes = document.createElement('div');
		mib.boxes.className="multipleInputBox-boxes";
		mib.btnAdd = document.createElement('button');
		mib.btnAdd.className="multipleInputBox-btn multipleInputBox-btn-add";
		mib.appendChild(mib.boxes)
		mib.appendChild(mib.btnAdd)
		
		Object.defineProperty(mib, 'value', {
			get:function(){ return mib.getText(); },
			set:function(txt){ mib.removeAllTexts();mib.setText(txt); },
			//value:"init", //기본값 (get,set 과 같이 사용불가)
			//writable: true, //값 수정 가능여부 (get,set 과 같이 사용불가)
			enumerable: true, //목록 열거시 표시여부
			configurable: false //삭제 가능여부. writable 속성 변경 가능 여부
		});
	}
	/**
	* init_method 메소드 설정
	* @param  {html_node} mib
	* @param  {Object} opt config
	*/
	var init_method = function(mib,opt){
		/**
		* setOpt 설정
		* @param  {Object} i_opt config
		*/
		mib.setOpt = function(i_opt){
			opt = Object.assign(opt,i_opt)
		}
		/**
		* removeAllTexts text 들 전부 삭제
		*/
		mib.removeAllTexts = function(){
			mib.boxes.innerHTML = "";
		}
		/**
		* getTexts 배열로 내용 가져오기
		* @return {Array}
		*/
		mib.getTexts = function(){
			var arr = [];
			mib.querySelectorAll(".multipleInputBox-text").forEach(function(v,k){
				arr.push(v.value);
			});;
			return arr;
		}
		/**
		 * getText 문자열로 내용 가져오기 (.value 와 같음)
		 * @return {String} 
		 */
		mib.getText = function(){
			return this.getTexts().join(opt.separator);
		}
		/**
		 * setText Text값 설정하기(구분자로 자동 처리함)
		 * @param  {String} txt 
		 */
		mib.setText = function(txt){
			mib.addTextBoxes(txt.split(opt.separator))
		}
		/**
		 * sync 데이터 싱크
		 */
		mib.sync = function(){
			if(this.input){
				this.input.value = this.getText();
			}
		}
		/**
		 * addTextBoxes 배열을 기준으로 여러 textbox 를 추가하기
		 * @param  {Array} arr
		 */
		mib.addTextBoxes = function(arr){
			var boxes = []
			for(var i=0,m=arr.length;i<m;i++){
				boxes.push(this.addTextBox(arr[i]))
			}
			return boxes;
		}
		/**
		 * addTextBox textbox 추가하기
		 * @param  {String} str   옵션
		 * @param  {Boolean} force removeEmptyBox 무시 여부 설정
		 * @return {[type]}       [description]
		 */
		mib.addTextBox = function(str,force){
			if(str==undefined||str==null) str='';
			if(!force && opt.removeEmptyBox && str.length==0){return;}
			var box = document.createElement('div');
			box.className ="multipleInputBox-box";
			switch(opt.textType){
				case "div":
				var t =  '<div class="multipleInputBox-text" contenteditable="true"></div>';	
				break;
				default:
				var t =  '<input type="'+opt.textType+'" class="multipleInputBox-text"></div>';	
				break;
				
			}
			t+='<div class="multipleInputBox-btns">'+
			'<button class="multipleInputBox-btn multipleInputBox-btn-remove"></button>'+
			'</div>';
			box.innerHTML = t;
			box.btnRemove = box.querySelector(".multipleInputBox-btn-remove");
			box.text = box.querySelector(".multipleInputBox-text");
			
			if(opt.textType=='div'){
				Object.defineProperty(box.text, 'value', {
					get:function(){ return box.text.innerText; },
					set:function(txt){ box.text.innerText=txt; },
					//value:"init", //기본값 (get,set 과 같이 사용불가)
					//writable: true, //값 수정 가능여부 (get,set 과 같이 사용불가)
					enumerable: true, //목록 열거시 표시여부
					configurable: false //삭제 가능여부. writable 속성 변경 가능 여부
				});	
			}
			box.text.value=str
			
			
			box.btnRemove.addEventListener('click',function(evt){
				box.parentNode.removeChild(box);
				mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
				mib.dispatchEvent((new CustomEvent('change',{bubbles: false, cancelable: false, detail: {}})));
			})
			box.text.addEventListener('blur',function(evt){
				if(opt.removeEmptyBox && this.value==""){
					box.parentNode.removeChild(box);
					mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
					mib.dispatchEvent((new CustomEvent('change',{bubbles: false, cancelable: false, detail: {}})));
				}
			});
			// box.text.addEventListener('change',function(evt){
			// 	mib.dispatchEvent((new CustomEvent('change',{bubbles: false, cancelable: false, detail: {}})));
			// });
			mib.boxes.appendChild(box);
			mib.sync();
			mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
			return box;
		}
	}
	/**
	 * 이벤트 초기화
	 * @param  {html_node} mib
	 * @param  {Object} opt config
	 */
	var init_event = function(mib,opt){
		mib.btnAdd.addEventListener('click',function(evt){
			var box = mib.addTextBox("",true);
			box.text.focus();
		})
		mib.addEventListener('input',function(evt){
			this.sync();
			if(this.input) this.input.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
		})
	}
	
	/**
	 * 동작 함수
	 * @param  {html_node} mib
	 * @param  {Object} opt config
	 * @return {html_node} mib
	 */
	return function(mib,opt){
		opt = Object.assign({
			"removeEmptyBox":false,
			"separator":",",
			"textType":"div" //input,div
		},opt)
		init_create(mib,opt);
		init_method(mib,opt);
		init_event(mib,opt);
		if(mib.input && mib.input.value.length>0){
			mib.value = mib.input.value;
		}
		
		mib.sync();
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