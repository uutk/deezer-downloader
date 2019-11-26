
function deezer_download(music_id, type, add_to_playlist, create_zip) {
    $.post('/api/v1/deezer/download', 
        JSON.stringify({ type: type, music_id: parseInt(music_id), add_to_playlist: add_to_playlist, create_zip: create_zip}),
        function(data) {
            if(create_zip == true) {
                text = "You will get a zip file";
            }
            else if(type == "album") {
                if(add_to_playlist == true) {
                    text = "Good choice! The album will be downloaded and queued to the playlist";
                } else {
                    text = "Good choice! The album will be downloaded.";
                }
            } else {
                if(add_to_playlist == true) {
                    text = "Good choice! The song will be downloaded and queued to the playlist";
                } else {
                    text = "Good choice! The song will be downloaded.";
                }
            }
            $.jGrowl(text, { life: 4000 });
    });
}




$(document).ready(function() {
        

    function youtubedl_download(add_to_playlist) {
        $.post('/api/v1/youtubedl', 
            JSON.stringify({ url: $('#youtubedl-query').val(), add_to_playlist: add_to_playlist }),
            function(data) {
                console.log(data);
            });
    }
    
    
    function spotify_playlist_download(add_to_playlist, create_zip) {
        $.post('/api/v1/spotify', 
            JSON.stringify({ playlist_name: $('#spotify-playlistname').val(), 
                             playlist_url: $('#spotify-playlist-url').val(),
                             add_to_playlist: add_to_playlist,
                             create_zip: create_zip}),
            function(data) {
                console.log(data);
            });
    }



    function deezer_playlist_download(add_to_playlist, create_zip) {
        $.post('/api/v1/deezer/playlist', 
            JSON.stringify({ playlist_url: $('#deezer-playlist-url').val(),
                             add_to_playlist: add_to_playlist,
                             create_zip: create_zip}),
            function(data) {
                console.log(data);
            });
    }
    

    function search(type) {
        $.post('/api/v1/deezer/search', 
            JSON.stringify({ type: type, query: $('#songs-albums-query').val() }),
            function(data) {
                $("#results > tbody").html("");
                for (var i = 0; i < data.length; i++) {
                    drawTableEntry(data[i], type);
                }
        });
    }


        function drawTableEntry(rowData, mtype) {
            var row = $("<tr>")
            console.log(rowData);
            $("#results").append(row); 
            row.append($("<td>" + rowData.artist + "</td>"));
            row.append($("<td>" + rowData.title + "</td>"));
            row.append($("<td>" + rowData.album + "</td>"));
            row.append($('<td> <button class="btn btn-default" onclick="deezer_download(\'' +
                         rowData.id  + '\', \''+ mtype +
                         '\', true, false);" > <i class="fa fa-play-circle" title="download and queue to mpd" ></i> </button> </td>'));

            row.append($('<td> <button class="btn btn-default" onclick="deezer_download(\'' +
                       rowData.id  + '\', \''+ mtype + 
                       '\', false, false);" > <i class="fa fa-download" title="download" ></i> </button> </td>'));

            if(mtype == "album") {
                row.append($('<td> <button class="btn btn-default" onclick="deezer_download(\'' +
                           rowData.id  + '\', \''+ mtype + 
                           '\', false, true);" > <i class="fa fa-file-archive-o" title="give me a zip file" ></i> </button> </td>'));
            }
        }

    function show_debug_log() {
        $.get('/debug', function(data) {
            var debug_log_textarea = $("#ta-debug-log");
            debug_log_textarea.val(data.debug_msg);
            if(debug_log_textarea.length) {
                debug_log_textarea.scrollTop(debug_log_textarea[0].scrollHeight - debug_log_textarea.height());
            }
        });
    }

    $("#search_track").click(function() {
        search("track");
    });

    $("#search_album").click(function() {
        search("album");
    });
    
    $("#yt_download").click(function() {
        youtubedl_download(false);
    });
    
    $("#yt_download_play").click(function() {
        youtubedl_download(true);
    });
    
    $("#nav-debug-log").click(function() {
        show_debug_log();
    });

    // BEGIN SPOTIFY
    $("#spotify_download_play").click(function() {
        spotify_playlist_download(true, false);
    });

    $("#spotify_download").click(function() {
        spotify_playlist_download(false, false);
    });

    $("#spotify_zip").click(function() {
        spotify_playlist_download(false, true);
    });
    // END SPOTIFY

    
    // BEGIN DEEZER
    $("#deezer_download_play").click(function() {
        deezer_playlist_download(true, false);
    });

    $("#deezer_download").click(function() {
        deezer_playlist_download(false, false);
    });

    $("#deezer_zip").click(function() {
        deezer_playlist_download(false, true);
    });
    // END DEEZER


    function show_tab(id_nav, id_content) {
    // nav 
    $(".nav-link").removeClass("active")
    //$("#btn-show-debug").addClass("active")
    $("#" + id_nav).addClass("active")

    // content
    $(".container .tab-pane").removeClass("active show")
    //$("#youtubedl").addClass("active show")
    $("#" + id_content).addClass("active show")
    }



    var bbody = document.getElementById('body');
    bbody.onkeydown = function (event) {
        if (event.key !== undefined) {
           if (event.key === 'Enter' && event.altKey) {
               console.log("pressed Enter + ALT");
               search("album");
           }  else if (event.key === 'Enter' ) {
               console.log("pressed Enter");
               search("track");
           } else if (event.key === 'm' && event.ctrlKey) {
              console.log("pressed ctrl m");
              $("#songs-albums-query")[0].value = "";
              $("#songs-albums-query")[0].focus();
           }
           if (event.ctrlKey && event.shiftKey) {
               console.log("pressed ctrl + shift + ..");
               if(event.key === '!') {
                   id_nav = "nav-songs-albums";
                   id_content = "songs_albums";
               }
               if(event.key === '"') {
                   id_nav = "nav-youtubedl";
                   id_content = "youtubedl";
               }
               if(event.key === '§') {
                   id_nav = "nav-spotify-playlists";
                   id_content = "spotify-playlists";
               }
               if(event.key === '$') {
                   id_nav = "nav-deezer-playlists";
                   id_content = "deezer-playlists";
               }
               if(event.key === '%') {
                   id_nav = "nav-songs-albums";
                   id_content = "songs_albums";
                   window.open('/downloads', '_blank');
               }
               if(event.key === "&") {
                   id_nav = "nav-debug-log";
                   id_content = "debug";
               }
               if(typeof id_nav !== 'undefined') {
                   show_tab(id_nav, id_content);
               }
           }
        }
            
    };
});
