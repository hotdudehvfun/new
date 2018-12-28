var x=0,y=0;
var selectedText="";
//*********************************************
function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

function replaceSelectedText(el, text) {
    var sel = getInputSelection(el), val = el.value;
    el.value = val.slice(0, sel.start) + text + val.slice(sel.end);
}
//********************************************
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function getInternalLinks(keyword)
{
	if (keyword!=undefined||keyword!=null)
	{
		if (keyword.length>1)
		{
		  var xhttp = new XMLHttpRequest();
		  xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200)
		    {
		     	console.log(this.responseText);
		     	var response=JSON.parse(this.responseText);
		     	try{
				if (response.query.searchinfo.totalhits === 0)
				{
					console.log("internal links not found!");
				}else
				{
					addLinkInternal(response,keyword);
				}
			}catch(e)
			{

			}
		    }
		  };
		  xhttp.open("GET", "http://14.139.87.226:4545/cisf/api.php?action=query&list=search&srsearch="+keyword+"&prop=info&inprop=url&utf8=&format=json", true);
		  xhttp.send();
		}
	}
}

function getExternalLinks (keyword) { //AJAX request

	if (keyword!=undefined||keyword!=null)
	{
		if (keyword.length>1)
		{

				$.ajax({
		url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + keyword + "&prop=info&inprop=url&utf8=&format=json",
		dataType: "jsonp",
		success: function(response)
		{
			try{
				if (response.query.searchinfo.totalhits === 0)
				{
					console.log("External not found . searching in internal");
					getInternalLinks(keyword);
				}else
				{
					addLinkExternal(response,keyword);
				}
			}catch(e)
			{

			}


		},
		error: function () {
			alert("Error retrieving search results, please refresh the page");
		}
	});
		}
	}

}
function addLinkExternal (callback,keyword)
{
	injectPop();
	var parent=document.getElementById('choose_links');
	parent.innerHTML="";

	var li=document.createElement('li');
	li.innerHTML="External Links";
	parent.appendChild(li);
	document.getElementById('pop_holder').style.display="block";

	document.getElementById('link_popup').style.left=x+"px";
	document.getElementById('link_popup').style.top=y+"px";

	for (var m = 0; m < 5; m++)
	{
		var title = callback.query.search[m].title;
		var url = title.replace(/ /g, "_");
		var li=document.createElement('li');
		li.setAttribute('data-url',"https://en.wikipedia.org/wiki/"+url);
		li.innerHTML=" <a title=https://en.wikipedia.org/wiki/"+url+">"+url+"<a/>";
		li.addEventListener('click',function(event)
		{
			console.log(event.target.getAttribute('title'));
			var el=document.getElementsByTagName('textarea')[0];
			replaceSelectedText(el,"["+event.target.getAttribute('title')+" "+keyword+"]");
			hidePop();
		})
		parent.appendChild(li);
	}
	getInternalLinks(keyword);
}

function addLinkInternal (callback,keyword)
{
	var parent=document.getElementById('choose_links');
	var li=document.createElement('li');
	li.innerHTML="Internal Links";
	parent.appendChild(li);

	for (var m = 0; m < 5; m++)
	{
		var title = callback.query.search[m].title;
		var url = title.replace(/ /g, "_");
		var li=document.createElement('li');
		li.setAttribute('data-url',"http://14.139.87.226:4545/cisf/index.php/"+url);
		li.innerHTML=" <a title=http://14.139.87.226:4545/cisf/index.php/"+url+">"+url+"<a/>";
		li.addEventListener('click',function(event)
		{
			console.log(event.target.getAttribute('title'));
			var el=document.getElementsByTagName('textarea')[0];
			replaceSelectedText(el,"["+event.target.getAttribute('title')+" "+keyword+"]");
			hidePop();
		})
		parent.appendChild(li);
	}
}

function injectPop()
{
	var html='<div id="link_popup" style="z-index:999;    width: 200px;    height: 300px;    background: #fafafa;    box-shadow: 1px 1px 5px #dadada;    overflow: auto;    position: absolute;    left: 0px;    top: 0px;    display: flex;    flex-direction: column;">    <div style="    text-align: center;    background: #f3f3f3;    width: 100%;    padding-top: 5px;    padding-bottom: 5px;"><div id="close_button" style="cursor:pointer;">Choose Links[X]</div></div>    <ul id="choose_links">        <li></li>    </ul>    </div>';
	var div=document.createElement('div');
	div.setAttribute('id','pop_holder');
	div.innerHTML=html;
	document.getElementsByTagName('body')[0].appendChild(div);

	document.getElementById('close_button').addEventListener('click',function(){
		hidePop();
	});
	document.getElementById('pop_holder').style.display="none";
}


function hidePop()
{
	document.getElementsByTagName('body')[0].removeChild(document.getElementById('pop_holder'));
}
document.onmouseup = function(e)
{
	selectedText=getSelectionText();
	getExternalLinks(getSelectionText());

	x=e.pageX;
	y=e.pageY;
};
