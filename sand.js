var watchedList = [];
var channelIds = ['UCH-_hzb2ILSCo9ftVSnrCIQ', 'UCj_dHQWv08dQ0fv6IrzTChQ', 'UCs4br3aZLU0sOEM-3n0-6xQ', 'UCD4INvKvy83OXwAkRjaQKtw', 'UCpu8dLHavjMi1a5jgT9ycMA', 'UCQd82ZrlW8b8_MujwDO9ajw', 'UCsLTG-svFzsK22zFac0pwUA', 'UCUxoapwoGN9cKN5SPKGVh7A', 'UCYzUOg9p-Z_1o_e-Ua4-VHQ', 'UCkcdIHabg9Sq0sD6ITyVQcg', 'UCVk6LHxQ4TnHySEd0e6143g', 'UCaGWSIZnljlgNTSMzYnxTEg'];
var channelId;
var isUploads = true;
var sPath = window.location.pathname;
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
switch (sPage) {
    case "index2.html":
        channelId = channelIds[1];
        break;
    case "index3.html":
        channelId = channelIds[2];
        break;
    case "index4.html":
        channelId = channelIds[3];
        break;
    case "index5.html":
        channelId = channelIds[4];
        break;
    case "index6.html":
        channelId = channelIds[5];
        break;
    case "index7.html":
        channelId = channelIds[6];
        break;
    case "index8.html":
        channelId = channelIds[7];
        break;
    case "index9.html":
        channelId = channelIds[8];
        break;
    case "index10.html":
        channelId = channelIds[9];
        break;
    case "index11.html":
        channelId = channelIds[10];
        break;
	case "index12.html":
        channelId = channelIds[11];
        break;
	case "index.html":
	default:
        channelId = channelIds[0];
        break;
}
var playlistId, nextPageToken, prevPageToken;
if($.cookie('watchedList') != null) watchedList = JSON.parse($.cookie('watchedList'));

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
        $.cookie('watchedList', JSON.stringify(watchedList), { expires: 1000, path: '/' });
    } else {
        $(this).addClass('wbtn-selected');
        watchedList.push($(this).attr("value"));
        $.cookie('watchedList', JSON.stringify(watchedList), { expires: 1000, path: '/' });
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
        case "index2.html":
            requestVideoPlaylist(playlistId, 'CPIMEAA');
            break;
        case "index3.html":
            requestVideoPlaylist(playlistId, 'CKAGEAA');
            break;
        case "index4.html":
            requestVideoPlaylist(playlistId, 'CP4IEAA');
            break;
        case "index5.html":
            requestVideoPlaylist(playlistId, 'CKAGEAA');
            break;
        case "index6.html":
            requestVideoPlaylist(playlistId, 'CKAGEAA');
            break;
        case "index7.html":
            requestVideoPlaylist(playlistId, 'CIQHEAA');
            break;
        case "index8.html":
            requestVideoPlaylist(playlistId, 'CN4CEAA');
            break;
        case "index9.html":
            requestVideoPlaylist(playlistId, 'CPoBEAA');
            break;
        case "index10.html":
            requestVideoPlaylist(playlistId, 'CPgKEAA');
            break;
        case "index11.html":
            requestVideoPlaylist(playlistId, 'CGQQAA');
            break;
		case "index12.html";
			requestVideoPlaylist(playlistId, 'CJYBEAA');
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
        obj.dd.on('click', function(event){
            $(this).toggleClass('active');
            $(this).toggleClass('up');
            return;
        });
    }
}
$(function() {
    var dd = new DropDown( $('.dd') );
});

function importBtn(file) {
    if(file.files && file.files[0]){
        var reader = new FileReader();
        reader.onload = function (e) {
            var output=e.target.result;
            if(file.files[0].name == "watchedList.json"){
                $.cookie('watchedList', output, { expires: 1000, path: '/' });
                $('.dnd').addClass('imported');
            } else {alert("Error: not a valid file.")};
        };
        reader.readAsText(file.files[0]);
    }
}
function exportBtn() {
    var blob = new Blob([$.cookie('watchedList')], {type: "text/json;charset=utf-8"});
    saveAs(blob, "watchedList.json");
}

function loadPlaylist(playlistID) {
    playlistId = playlistID;
    $('.v-wrapper').remove();
    $('#last-btn').remove();
    $('#pageNum').remove();
    requestVideoPlaylist(playlistId);
}