var watchedList = [];
var channelIds = ['UCH-_hzb2ILSCo9ftVSnrCIQ', 'UCj_dHQWv08dQ0fv6IrzTChQ', 'UCs4br3aZLU0sOEM-3n0-6xQ', 'UCD4INvKvy83OXwAkRjaQKtw', 'UCpu8dLHavjMi1a5jgT9ycMA', 'UCQd82ZrlW8b8_MujwDO9ajw', 'UCsLTG-svFzsK22zFac0pwUA', 'UCUxoapwoGN9cKN5SPKGVh7A', 'UCYzUOg9p-Z_1o_e-Ua4-VHQ', 'UCkcdIHabg9Sq0sD6ITyVQcg', 'UCVk6LHxQ4TnHySEd0e6143g', 'UCaGWSIZnljlgNTSMzYnxTEg', 'UCZ3edpZNi_qmuBG2FIHW5tQ'];
var channelId;
var isUploads = true;
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
switch (sPage) {
	case "importExport.html":
        $('#vidNum').append("You currently have " + JSON.parse(localStorage['watchedList']).length + " videos in your watched list.");
        break;
    case "yogscast2.html":
        channelId = channelIds[1];
        break;
    case "yogscastlalna.html":
        channelId = channelIds[2];
        break;
    case "yogscastsips.html":
        channelId = channelIds[3];
        break;
    case "yogscastsjin.html":
        channelId = channelIds[4];
        break;
    case "yogscastrythian.html":
        channelId = channelIds[5];
        break;
    case "nilesyrocks.html":
        channelId = channelIds[6];
        break;
    case "yogscastkim.html":
        channelId = channelIds[7];
        break;
    case "zoeyproasheck.html":
        channelId = channelIds[8];
        break;
    case "hybridpanda.html":
        channelId = channelIds[9];
        break;
    case "yogscastturpster.html":
        channelId = channelIds[10];
        break;
	case "tedhimself.html":
        channelId = channelIds[11];
        break;
    case "doubledragon.html":
        channelId = channelIds[12];
        break;
	case "index.html":
	default:
        channelId = channelIds[0];
        break;
}
var playlistId, nextPageToken, prevPageToken;
if(localStorage['watchedList'] != null) watchedList = JSON.parse(localStorage['watchedList']);

$(document).on('mouseenter', '.wbtn', function() {
    if ($(this).hasClass('wbtn-selected')) {
        $(this).addClass('wbtn-remove');
    } else {
        $(this).addClass('wbtn-add');
    }
})
$(document).on('mouseleave', '.wbtn', function() {
    $(this).removeClass('wbtn-add');
    $(this).removeClass('wbtn-remove');
})
$(document).on('click', '.wbtn', function() {
    if ($(this).hasClass('wbtn-selected')) {
        $(this).removeClass('wbtn-selected');
        var i = watchedList.indexOf($(this).attr("value"));
        if (i != -1) {
            watchedList.splice(i, 1);
        }
        localStorage['watchedList'] = JSON.stringify(watchedList);
    } else {
        $(this).addClass('wbtn-selected');
        watchedList.push($(this).attr("value"));
        localStorage['watchedList'] = JSON.stringify(watchedList);
    }
})

function load() {
    if(sPage != "importExport.html") {
        gapi.client.setApiKey('AIzaSyAUlITcOAIzYKB9b4fE73sCVsgVgpNPz2A');
        gapi.client.load('youtube', 'v3', makeRequest);
    }
}

function makeRequest() {
    if(isUploads) {
        var request = gapi.client.youtube.channels.list({part: 'contentDetails', id: channelId});
        request.execute(function (response) {
            playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
            requestVideoPlaylist(playlistId);
        })
    }
    else {
        loadPlaylist();
    }
}

function requestVideoPlaylist(playlistId, pageToken) {
    var requestOptions = { part: 'snippet', playlistId: playlistId, maxResults: 50 }
    if (pageToken) requestOptions.pageToken = pageToken;
    var request = gapi.client.youtube.playlistItems.list(requestOptions);
    request.execute(function(response) {
        nextPageToken = response.result.nextPageToken;
        var nextVis = nextPageToken ? 'visible' : 'hidden';
        $('#next-btn').css('visibility', nextVis);
        prevPageToken = response.result.prevPageToken;
        var prevVis = prevPageToken ? 'visible' : 'hidden';
        $('#prev-btn').css('visibility', prevVis);
        var playlistItems = response.result.items;
        if (playlistItems) {
            for (i in playlistItems) {
              postVideoDetails(playlistItems[i].snippet, playlistItems[i].snippet.resourceId.videoId);
            };
        } else {
            console.log("Couldn't find any videos to display.");
        }
    })
}

function postVideoDetails(videoSnippet, videoId) {
    var videoObject = { title: videoSnippet.title, id: videoId, date: videoSnippet.publishedAt, description: videoSnippet.description, thumbnail: videoSnippet.thumbnails.medium.url };
    var btnClass;
    if (watchedList.indexOf(videoId) != -1) btnClass = "wbtn-selected wbtn"; else { btnClass = "wbtn" }
    $('#wrapper').append('<div class="v-wrapper"><a href="http://www.youtube.com/watch?v=' + videoId + '"><img src="' + videoObject.thumbnail + '" width="150" height="85" class="thumb" /></a><button type="button" class="' + btnClass + '" alt="Mark video as watched" value="' + videoId + '"></button><a href="http://www.youtube.com/watch?v=' + videoId + '" class="v-url"><p class="v-title">' + videoObject.title +'</p></a><p class="v-date">' + videoObject.date + '</p><p class="v-desc">' + videoObject.description + '</p></div>');
}

function first() {
    $('.v-wrapper').remove();
    requestVideoPlaylist(playlistId);
}
function last() {
    $('.v-wrapper').remove();
    switch (sPage) {
        case "index.html":
		default:
            requestVideoPlaylist(playlistId, 'CL4VEAA');
            break;
        case "yogscast2.html":
            requestVideoPlaylist(playlistId, 'CPIMEAA');
            break;
        case "yogscastlalna.html":
            requestVideoPlaylist(playlistId, 'CKAGEAA');
            break;
        case "yogscastsips.html":
            requestVideoPlaylist(playlistId, 'CP4IEAA');
            break;
        case "yogscastsjin.html":
            requestVideoPlaylist(playlistId, 'CKAGEAA');
            break;
        case "yogscastrythian.html":
            requestVideoPlaylist(playlistId, 'CKAGEAA');
            break;
        case "nilesyrocks.html":
            requestVideoPlaylist(playlistId, 'CIQHEAA');
            break;
        case "yogscastkim.html":
            requestVideoPlaylist(playlistId, 'CN4CEAA');
            break;
        case "zoeyproasheck.html":
            requestVideoPlaylist(playlistId, 'CPoBEAA');
            break;
        case "hybridpanda.html":
            requestVideoPlaylist(playlistId, 'CPgKEAA');
            break;
        case "yogscastturpster.html":
            requestVideoPlaylist(playlistId, 'CGQQAA');
            break;
		case "tedhimself.html":
			requestVideoPlaylist(playlistId, 'CJYBEAA');
			break;
        case "doubledragon.html":
            requestVideoPlaylist(playlistId);
            break;
    }
}
function nextPage() {
    $('.v-wrapper').remove();
    requestVideoPlaylist(playlistId, nextPageToken);
}
function previousPage() {
    $('.v-wrapper').remove();
    requestVideoPlaylist(playlistId, prevPageToken);
}
function SelectChanged() {
    $('#pageNum').each(function() {
        switch(this.value) {
            case "hash":
                break;
            case "CPQDEAA":
                $('.v-wrapper').remove();
                requestVideoPlaylist(playlistId, "CPQDEAA");
                break;
            case "COgHEAA":
                $('.v-wrapper').remove();
                requestVideoPlaylist(playlistId, "COgHEAA");
                break;
            case "CNwLEAA":
                $('.v-wrapper').remove();
                requestVideoPlaylist(playlistId, "CNwLEAA");
                break;
            case "CNAPEAA":
                $('.v-wrapper').remove();
                requestVideoPlaylist(playlistId, "CNAPEAA");
                break;
            case "CMQTEAA":
                $('.v-wrapper').remove();
                requestVideoPlaylist(playlistId, "CMQTEAA");
                break;
        }
    })
}

function DropDown(el) {
    this.dd = el;
    this.index = -1;
    this.initEvents();
}
DropDown.prototype = {
    initEvents : function() {
        var obj = this;
        obj.dd.on('mouseenter', function(event) {
            clearTimeout(this.timer);
            $(this).addClass('active');
            $('.dropdown').perfectScrollbar('update');
            return;
        });
        obj.dd.on('mouseleave', function(event) {
            if($('.dd').hasClass('active')){this.timer = setTimeout(function(){$('.dd').removeClass('active');}, 500)};
            return;
        });
    }
}
$(function() {
    var dd = new DropDown( $('.dd') );
});
$(".dropdown").perfectScrollbar({
    wheelSpeed: 0.5
})

function importBtn(file) {
    if(file.files && file.files[0]){
        var reader = new FileReader();
        reader.onload = function (e) {
            var output=e.target.result;
            if(file.files[0].name == "watchedList.json"){
                localStorage['watchedList'] = output;
                $('.dnd').addClass('imported');
            } else {alert("Error: not a valid file.")};
        };
        reader.readAsText(file.files[0]);
    }
}
function exportBtn() {
    var blob = new Blob([localStorage['watchedList']], {type: "text/json;charset=utf-8"});
    saveAs(blob, "watchedList.json");
}

function loadPlaylist(playlistID) {
    playlistId = playlistID;
    $('.v-wrapper').remove();
    $('#last-btn').remove();
    $('#pageNum').remove();
    requestVideoPlaylist(playlistId);
}