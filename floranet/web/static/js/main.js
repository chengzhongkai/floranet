const htmlEscape = function(str){
  if (!str) return;
  return str.replace(/[<>&"'`]/g, (match) => {
    const escape = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#x60;'
    };
    return escape[match];
  });
}

getProp= function(name){ 
    $.ajax( {
      type: 'get',
      url: '/api/v1.0/'+name,
      dataType: 'text',
      beforeSend: function( xhr, settings ) { xhr.setRequestHeader( 'Authorization', 'IMxHj@wfNkym@*+V85Rs^G<QXMD~p[eaX3S=_D8f7{z0q{GN' ); }
    } )
    .done( ( data ) => {
      jstr=data.replace(/ (\d+)/g, (m,i)=>{return i.length<8?i:'"'+i+'"'})
      data = JSON.parse(jstr)
      $('#mainDiv').text("");
      var str='';
      if (data[0] === undefined) {
    	   Object.entries(data).forEach(i=> { 
           console.log(i[0], i[1]);
           if(typeof(i[1])==='string' && i[1].replace(/\d/g,'').length==0)i[1]=BigInt(i[1]).toString(16).toUpperCase()
            str+=i[0]+': '+htmlEscape(String(i[1]))+'<br/>'
         });
      }else{
        Object.keys(data).forEach(id=>{
          var app=data[id];
          Object.entries(app).forEach(i=> { 
            console.log(i[0], i[1]);
            if(typeof(i[1])==='string' && i[1].replace(/\d/g,'').length==0)i[1]=BigInt(i[1]).toString(16).toUpperCase()
            str+=i[0]+': '+htmlEscape(String(i[1]))+'<br/>'
          });
	        str+='------------------------<br/>'	
        });
      }	      
      $('#mainDiv').html(str);
    } )
    .fail( ( data ) => {
    } );
}	


$(function(){
    getProp('apps');
    $('.left li').click(function(){
        var id = $(this).attr('id');
        getProp(id);
    });
});
