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
	var init_create = function(mib){		
		// mib.innerHTML = '<div class="multipleInputBox-boxes"></div><button class="multipleInputBox-btn multipleInputBox-btn-add"></button>'
		var input = mib.querySelector("input,textarea");
		mib.input = input?input:null;;
		mib.boxes = document.createElement('div');
		mib.boxes.className="multipleInputBox-boxes";
		mib.btnAdd = document.createElement('button');
		mib.btnAdd.className="multipleInputBox-btn multipleInputBox-btn-add";
		mib.appendChild(mib.boxes)
		mib.appendChild(mib.btnAdd)
		

	}
	/**
	* init_method 메소드 설정
	* @param  {html_node} mib
	* @param  {Object} opt config
	*/
	var init_method = function(mib){
		/**
		* removeAllTexts text 들 전부 삭제
		*/
		var removeAllTexts = function(){
			mib.boxes.innerHTML = "";
			
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
			try{
				if(mib.hasAttribute('data-useJSON')){
					mib.addInputBoxes(JSON.parse(txt));
				}else{
					mib.addInputBoxes(txt.split(mib.hasAttribute('data-separator')?mib.getAttribute('data-separator'):','))
				}
			}catch(e){
				console.log(e)
			}
			
		}
		/**
		 * sync 데이터 싱크(속의 input에게 값을 다시 넣음)
		 */
		mib.sync = function(toMib){
			if(this.input){
				if(toMib){
					this.value = this.input.value;
				}else{
					this.input.value = this.value;
				}
			}
		}
		/**
		 * addInputBoxes 배열을 기준으로 여러 textbox 를 추가하기
		 * @param  {Array} arr
		 */
		mib.addInputBoxes = function(arr){
			var boxes = []
			var removeEmptyBox = mib.hasAttribute('data-removeEmptyBox');
			for(var i=0,m=arr.length;i<m;i++){
				if(removeEmptyBox && arr[i].length==0){continue;}
				boxes.push(this.addRawTextBox(arr[i]))
			}
			mib.sync(false);
			// mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
			return boxes;
		}
		/**
		 * addInputBox textbox 추가하기 (처리 이벤트가 추가됨)
		 * @param  {String} str   옵션
		 * @return {html_node}
		 */
		mib.addInputBox = function(str){
			var box = this.addRawTextBox(str);
			mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
			return box;
		}
		/**
		 * addRawTextBox textbox 추가하기
		 * @param  {String} str   옵션
		 * @return {html_node}
		 */
		mib.addRawTextBox = function(str){
			if(str==undefined||str==null) str='';
			var box = document.createElement('div');
			box.className ="multipleInputBox-box";
			var textType = mib.getAttribute('data-textType')
			if(!textType) textType = 'div';
			switch(textType){
				case "div":
				var t =  '<div class="multipleInputBox-input" contenteditable="true"></div>';	
				break;
				default:
				var t =  '<input type="'+textType+'" class="multipleInputBox-input"></div>';	
				break;
				
			}
			t+='<div class="multipleInputBox-btns">'+
			'<button class="multipleInputBox-btn multipleInputBox-btn-remove"></button>'+
			'</div>';
			box.innerHTML = t;
			box.btnRemove = box.querySelector(".multipleInputBox-btn-remove");
			box.text = box.querySelector(".multipleInputBox-input");
			
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
			
			
			box.btnRemove.addEventListener('click',function(evt){
				box.parentNode.removeChild(box);
				mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
				mib.dispatchEvent((new CustomEvent('change',{bubbles: false, cancelable: false, detail: {}})));
			})
			box.text.addEventListener('blur',function(evt){
				if(mib.hasAttribute('data-removeEmptyBox') && this.value==""){
					box.parentNode.removeChild(box);
					mib.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
					mib.dispatchEvent((new CustomEvent('change',{bubbles: false, cancelable: false, detail: {}})));
				}
			});
			mib.boxes.appendChild(box);
			mib.dispatchEvent((new CustomEvent('addinputbox',{bubbles: false, cancelable: false, detail: {}})));			
			return box;
		}
		
		Object.defineProperty(mib, 'value', {
			get:function(){ return getText(); },
			set:function(txt){ removeAllTexts();setText(txt); },
			//value:"init", //기본값 (get,set 과 같이 사용불가)
			//writable: true, //값 수정 가능여부 (get,set 과 같이 사용불가)
			enumerable: true, //목록 열거시 표시여부
			configurable: false //삭제 가능여부. writable 속성 변경 가능 여부
		});
		Object.defineProperty(mib, 'length', {
			get:function(){ return getText(); },
			set:function(txt){ },
			//value:"init", //기본값 (get,set 과 같이 사용불가)
			//writable: true, //값 수정 가능여부 (get,set 과 같이 사용불가)
			enumerable: true, //목록 열거시 표시여부
			configurable: false //삭제 가능여부. writable 속성 변경 가능 여부
		});
	}
	/**
	 * 이벤트 초기화
	 * @param  {html_node} mib
	 * @param  {Object} opt config
	 */
	var init_event = function(mib){
		mib.btnAdd.addEventListener('click',function(evt){
			var box = mib.addInputBox();
			box.text.focus();
		})
		mib.addEventListener('input',function(evt){
			this.sync(false);
			if(this.input) this.input.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
		})
	}
	
	/**
	 * 동작 함수
	 * @param  {html_node} mib
	 * @param  {Object} opt config
	 * @return {html_node} mib
	 */
	return function(mib){
		init_create(mib);
		init_method(mib);
		init_event(mib);
		mib.sync(true);
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