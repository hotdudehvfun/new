var data;

// 1section 2main text 3sub text


function isEmpty()
{
	data=Lockr.get('data');
	if (data===undefined)
	{
		//alert('no data!');
		return true;
	}else
	{
		//alert('data!');	
	}
	return false;
}

function addData()
{
	var section=document.getElementById('section').value;
	var main=document.getElementById('main-text').value;
	var sub=document.getElementById('sub-text').value;
	var msg=document.getElementById('msg');


	if (section.length>0 && main.length>0 && sub.length>0 )
	{
		console.log('data accepted');
		if (isEmpty())
		{
			var o=new Array();
			o.push({'section':section,'main':main,'sub':sub});
			Lockr.set('data',o);			
		}else
		{
			var o=Lockr.get('data');
			o.push({'section':section,'main':main,'sub':sub});
			Lockr.set('data',o);
			console.log('data added');
		}
		msg.style.opacity=1;
		msg.innerHTML="Data Added!";
		setTimeout(function(){closeInputPopup();},500);

	}else
	{
		console.log('no try again!');
		msg.style.opacity=1;
		msg.innerHTML="Data cannot be Empty!";
	}
	getData();


}

function getData(filter) 
{

	var container=document.getElementById('data-container');
	var data=Lockr.get('data');
	var htm='';	
	if (isEmpty()==false) 
	{

			for (var i = 0; i < data.length; i++) 
			{
				if (filter==null)
				{
						htm+="<div onclick=showRemovePopup('"+data[i].main+"','"+data[i].section+"'); class=inner-container>";
						htm+="<div class=centered-content>";
						htm+="<span>"+data[i].section+"</span> <br>";
						htm+="<span>"+data[i].main+"</span> <br>";
						htm+="<span>"+data[i].sub+"</span>";
						htm+="</div></div>";
				}else if (data[i].section==filter)
				{
						htm+="<div onclick=showRemovePopup() class=inner-container>";						
						htm+="<div class=centered-content>";
						htm+="<span>"+data[i].section+"</span> <br>";
						htm+="<span>"+data[i].main+"</span> <br>";
						htm+="<span>"+data[i].sub+"</span>";
						htm+="</div></div>";									
				}

			}
			container.innerHTML=htm;
	}
}
window.onload=start;
function start(argument) 
{
	getData();
}













function closeInputPopup() 
{
	var popup=document.getElementById('input-popup-outter');
	document.getElementById('data-container').setAttribute('style','-webkit-filter: blur(0px);');

	popup.style.display='none';
}
function showInputPopup() 
{
	var popup=document.getElementById('input-popup-outter');
	document.getElementById('data-container').setAttribute('style','-webkit-filter: blur(4px);');	
	popup.style.display='block';
}


function closeRemovePopup() 
{
	var popup=document.getElementById('remove-popup-outter');
	document.getElementById('data-container').setAttribute('style','-webkit-filter: blur(0px);');
	popup.style.display='none';
}
function showRemovePopup(main,section) 
{
	var popup=document.getElementById('remove-popup-outter');
	document.getElementById('data-container').setAttribute('style','-webkit-filter: blur(4px);');	
	popup.style.display='block';

	Lockr.set('removeMain',main);
	Lockr.set('removeSection',section);

}

function removeData()
{
	var m=Lockr.get('removeMain');
	var s=Lockr.get('removeSection');

	var o=Lockr.get('data');

	for (var i = 0; i < o.length; i++)
	 {
		if(o[i].section==s&&o[i].main==m)
		{
			o.splice(i,1);
			break;
		}
	}
	
	Lockr.set('data',o);
	closeRemovePopup();
	getData();

}






