var a='http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=json&q=' + encodeURIComponent("http://blog.hackerearth.com/feed");
$(document).ready(function () {
$.ajax({
  url      : 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent("http://blog.hackerearth.com/feed"),
  dataType : 'json',
  success  : function (data) {
  	//alert("ashish");
    //$('#total_hackerearth').append('<ul id="cbp-ntaccordion" class="cbp-ntaccordion">');
    if (data.responseData.feed && data.responseData.feed.entries) {
      $.each(data.responseData.feed.entries, function (i, e) {
      	$('#hackerearth').append("<div class='cbp-qtcontent'><blockquote><p>" + e.title + "</p></blockquote><p>" + e.contentSnippet + "</p><footer>" + e.author +  "</footer><a href='" + e.link +  "' target='_blank'>Go to Post </a></div>");

        $('#total_hackerearth #cbp-ntaccordion').append('<li><h2 class="cbp-nttrigger">' + e.title + '</h2><div class="cbp-ntcontent">' + e.content + '</div></li>' );

        
      });
      $( '#hackerearth' ).cbpQTRotator();
      $( '#total_hackerearth #cbp-ntaccordion' ).cbpNTAccordion();
      //$('#total_hackerearth').append('</ul>');
      //var keys = Object.keys(data.responseData.feed.entries[0]);
      //$('#u').append(keys + "<br/>");
    }
  }
});



$.ajax({
  url      : 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent("https://news.google.com/?output=rss"),
  dataType : 'json',
  success  : function (data) {
  	//alert("ashish");
  	
    if (data.responseData.feed && data.responseData.feed.entries) {
      $.each(data.responseData.feed.entries, function (i, e) {
      	$('#google').append("<div class='cbp-qtcontent'><blockquote><p>" + e.title + "</p></blockquote><p>" + e.contentSnippet + "</p><footer>" + e.author +  "</footer><a href='" + e.link +  "' target='_blank'>Go to Post </a></div>");

        $('#total_google #cbp-ntaccordion').append('<li><h2 class="cbp-nttrigger">' + e.title + '</h2><div class="cbp-ntcontent">' + e.content + '</div></li>' );

        
      });
      $( '#google' ).cbpQTRotator();
      $( '#total_google #cbp-ntaccordion' ).cbpNTAccordion();
      //var keys = Object.keys(data.responseData.feed.entries[0]);
      //$('#u').append(keys + "<br/>");
    }
  }
});

$.ajax({
  url      : 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent("https://community.mcafee.com/blogs/feeds/blogs"),
  dataType : 'json',
  success  : function (data) {
  	//alert("ashish");
  	
    if (data.responseData.feed && data.responseData.feed.entries) {
      $.each(data.responseData.feed.entries, function (i, e) {
      	$('#mcafee').append("<div class='cbp-qtcontent'><blockquote><p>" + e.title + "</p></blockquote><p>" + e.contentSnippet + "</p><footer>" + e.author +  "</footer><a href='" + e.link +  "' target='_blank'>Go to Post </a></div>");

        $('#total_mcafee #cbp-ntaccordion').append('<li><h2 class="cbp-nttrigger">' + e.title + '</h2><div class="cbp-ntcontent">' + e.content + '</div></li>' );

        
      });
      $( '#mcafee' ).cbpQTRotator();
      $( '#total_mcafee #cbp-ntaccordion' ).cbpNTAccordion();
      //var keys = Object.keys(data.responseData.feed.entries[0]);
      //$('#u').append(keys + "<br/>");
    }
  }
});


$.ajax({
  url      : 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent("https://news.ycombinator.com/rss"),
  dataType : 'json',
  success  : function (data) {
  	//alert("ashish");
  	
    if (data.responseData.feed && data.responseData.feed.entries) {
      $.each(data.responseData.feed.entries, function (i, e) {
      	$('#ycombinator').append("<div class='cbp-qtcontent'><blockquote><p>" + e.title + "</p></blockquote><p>" + e.contentSnippet + "</p><footer>" + e.author +  "</footer><a href='" + e.link +  "' target='_blank'>Go to Post </a></div>");

        $('#total_ycombinator #cbp-ntaccordion').append('<li><h2 class="cbp-nttrigger">' + e.title + '</h2><div class="cbp-ntcontent">' + e.content + '</div></li>' );

        
      });
      $( '#ycombinator' ).cbpQTRotator();
      $( '#total_ycombinator #cbp-ntaccordion' ).cbpNTAccordion();
      //var keys = Object.keys(data.responseData.feed.entries[0]);
      //$('#u').append(keys + "<br/>");
    }
  }
});


$("#head-hackerearth").hide();
$('#hackerearth').hide();
$("#head-google").hide();
$('#google').hide();
$('#head-rem-google').hide();
$('#head-rem-hackerearth').hide();
$('#view_specific').hide();

$('#add').click(function()
{
	var a=$( "#subscription option:selected" ).val();
	var b=$( "#subscription option:selected" ).text();
	$("#subscription option[value=" + a + "]").remove();
	
	if(a=="1")
	{
		$("#hackerearth").show();
		$("#head-hackerearth").show();
    $('#head-rem-hackerearth').show();
	}
  if(a=="2")
  {
    $("#google").show();
    $("#head-google").show();
    $('#head-rem-google').show();
  }
  if(a=="3")
  {
    $("#mcafee").show();
    $("#head-mcafee").show();
    $('#head-rem-mcafee').show();
  }
  if(a=="4")
  {
    $("#ycombinator").show();
    $("#head-ycombinator").show();
    $('#head-rem-ycombinator').show();
  }

});


$('#rem-google').click(function()
{
  $('#subscription').append("<option value='2'>Google</option>");
  $('#head-rem-google').hide();
  $("#head-google").hide();
  $('#google').hide();
});

$('#rem-hackerearth').click(function()
{
  $('#subscription').append("<option value='1'>HackerEarth</option>");
  $('#head-rem-hackerearth').hide();
  $("#head-hackerearth").hide();
  $('#hackerearth').hide();
});

$('#rem-mcafee').click(function()
{
  $('#subscription').append("<option value='3'>McAfee</option>");
  $('#head-rem-mcafee').hide();
  $("#head-mcafee").hide();
  $('#mcafee').hide();
});


$('#rem-ycombinator').click(function()
{
  $('#subscription').append("<option value='4'>YCombinator</option>");
  $('#head-rem-ycombinator').hide();
  $("#head-ycombinator").hide();
  $('#ycombinator').hide();
});

$('#show_all').click(function()
{
  $('#view_all').show();
  $('#view_specific').hide();
});


$('#show_hackerearth').click(function()
{
  $('#view_all').hide();
  $('#view_specific').show();
  $('#view_specific #total_mcafee').hide();
  $('#view_specific #total_hackerearth').show();
  $('#view_specific #total_google').hide();
  $('#view_specific #total_ycombinator').hide();
});

$('#show_google').click(function()
{
  $('#view_all').hide();
  $('#view_specific').show();
  $('#view_specific #total_mcafee').hide();
  $('#view_specific #total_hackerearth').hide();
  $('#view_specific #total_google').show();
  $('#view_specific #total_ycombinator').hide();
});

$('#show_mcafee').click(function()
{
  $('#view_all').hide();
  $('#view_specific').show();
  $('#view_specific #total_mcafee').show();
  $('#view_specific #total_hackerearth').hide();
  $('#view_specific #total_google').hide();
  $('#view_specific #total_ycombinator').hide();
});


$('#show_ycombinator').click(function()
{
  $('#view_all').hide();
  $('#view_specific').show();
  $('#view_specific #total_mcafee').hide();
  $('#view_specific #total_hackerearth').hide();
  $('#view_specific #total_google').hide();
  $('#view_specific #total_ycombinator').show();
});




});
