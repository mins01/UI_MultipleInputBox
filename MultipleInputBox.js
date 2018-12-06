var MultipleInputBox = (function(){
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
	var init_method = function(mib){
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

			mib.boxes.appendChild(box);
			mib.sync();
			mib.dispatchEvent((new CustomEvent('input',{bubbles: true, cancelable: true, detail: {}})));
			return box;
		}
	}
	var init_event = function(mib){
		mib.btnAdd.addEventListener('click',function(evt){
			var box = mib.addTextBox();
			box.text.focus();
		})
		mib.addEventListener('input',function(evt){
			this.sync();
			if(this.input) this.input.dispatchEvent((new CustomEvent('input',{bubbles: false, cancelable: false, detail: {}})));
		})
	}
	
	return function(mib){
		init_create(mib);
		init_method(mib);
		init_event(mib);
		if(mib.input && mib.input.value.length>0){
			var arr = mib.input.value.trim().split(",");
			mib.addTextBoxes(arr)
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