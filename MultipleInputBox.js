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
			set:function(txt){ mib.setText(txt); },
			//value:"init", //기본값 (get,set 과 같이 사용불가)
			//writable: true, //값 수정 가능여부 (get,set 과 같이 사용불가)
			enumerable: true, //목록 열거시 표시여부
			configurable: false //삭제 가능여부. writable 속성 변경 가능 여부
		});
	}
	var init_method = function(mib,opt){
		mib.getTexts = function(){
			var arr = [];
			mib.querySelectorAll(".multipleInputBox-text").forEach(function(v,k){
				arr.push(v.innerText);
			});;
			return arr;
		}
		mib.getText = function(){
			return this.getTexts().toString();
		}
		mib.setText = function(txt){
			mib.addTextBoxes(txt.split(","))
		}
		mib.getJsonString = function(){
			return JSON.stringify(this.getTexts());
		}
		mib.sync = function(){
			if(this.input){
				this.input.value = this.getText();
			}
		}
		mib.addTextBoxes = function(arr){
			var boxes = []
			for(var i=0,m=arr.length;i<m;i++){
				boxes.push(this.addTextBox(arr[i]))
			}
			return boxes;
		}
		mib.addTextBox = function(str){
			if(str==undefined||str==null) str='';
			var box = document.createElement('div');
			box.className ="multipleInputBox-box";
			box.innerHTML = '<div class="multipleInputBox-text" contenteditable="true">'+str+'</div>'+
			'<div class="multipleInputBox-btns">'+
			'<button class="multipleInputBox-btn multipleInputBox-btn-remove"></button>'+
			'</div>'
			box.btnRemove = box.querySelector(".multipleInputBox-btn-remove");
			box.text = box.querySelector(".multipleInputBox-text");
			
			
			box.btnRemove.addEventListener('click',function(evt){
				box.parentNode.removeChild(box);
				mib.dispatchEvent((new CustomEvent('input',{bubbles: true, cancelable: true, detail: {}})));
			})
			box.text.addEventListener('blur',function(evt){
				if(opt.removeEmptyBox && this.innerText==""){
					box.parentNode.removeChild(box);
				}
			})
			mib.boxes.appendChild(box);
			mib.sync();
			mib.dispatchEvent((new CustomEvent('input',{bubbles: true, cancelable: true, detail: {}})));
			return box;
		}
	}
	var init_event = function(mib,opt){
		mib.btnAdd.addEventListener('click',function(evt){
			var box = mib.addTextBox();
			box.text.focus();
		})
		mib.addEventListener('input',function(evt){
			this.sync();
			if(this.input) this.input.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
		})
	}
	
	return function(mib,opt){
		opt = Object.assign({
			"removeEmptyBox":false
		},opt)
		if(!opt) opt = {}
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