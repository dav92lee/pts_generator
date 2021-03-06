var pt_list = []

var save_pts = () => {
    var filename = $("filename-input").val()
    if(typeof filename == "undefined") {
    	var input_fn = $("#file-input").val().split('/');
    	input_fn = input_fn[input_fn.length-1].split('.');
    	filename = input_fn[0] + '.pts';
    }
	var data = `verson: 1
n_points: ${pt_list.length}
{
${pt_list.map((pt) => {return pt[0] + ' ' + pt[1]}).join('\r\n')}
}
`

    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}



$(function() {
	var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
	var imageObj = new Image();

	var render_pts_viewer_list = () => {
		$('#pts-viewer-list').html('')
		for(var pt_i in pt_list){
			let pt = pt_list[pt_i]
			let pt_div = $(`<li>${pt[0]},${pt[1]}<span ref="${pt_i}" class="close-button">x</span></li>`).click(remove_pt(pt_i))
			$('#pts-viewer-list').append(pt_div)
		}
	}

	var remove_pt = (index) => {
		return () => {
			pt_list.splice(index, 1);
			draw();
			render_pts_viewer_list();
		}
	}

	var draw = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(imageObj, 0, 0);
		ctx.fillStyle="#42f465";
		ctx.font = "10px Arial";
		let showNumbers = $('#pt-viewer-show-number').is(":checked")
		for(var pt_i in pt_list){
			var pt = pt_list[pt_i]
			if(showNumbers) {
				ctx.fillText(parseInt(pt_i)+1,pt[0]+2,pt[1]);
			}
			ctx.fillRect(pt[0],pt[1],2,2);
		}
	}

    var parse_pt_file = (file) => {
        var rawFile = new XMLHttpRequest();
        var pts = []
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    var rxp = /\{([^}]+)\}/;
                    var data = allText.match(rxp)[0].split('\n')
                    for (var pt of data) {
                        if(pt != "{" && pt != "}") {
                            var [x, y] = pt.split(' ')
                            pts.push([parseInt(x), parseInt(y)])
                        }
                    }
                }
            }
        }
        rawFile.send(null);
        return pts;
    }

	imageObj.onload = () => {
        ctx.canvas.height = imageObj.height;
        ctx.canvas.width = imageObj.width;
        render_pts_viewer_list()
        draw()

        // wait 2 seconds, repeate same process
        setTimeout(() => {
            ctx.canvas.height = imageObj.height;
            ctx.canvas.width = imageObj.width;
            draw()
        }, 2000)
	};


    $("#file-input-submit").click(() => {
        var file = $('#file-input').val();
        imageObj.src = file;
        pt_list = []
    });

    $("#pts-input-submit").click(() => {
        var file = $('#pts-input').val().toLowerCase();
        imageObj.src = file.replace('.pts', '.png')
        pt_list = parse_pt_file(file)
        draw();
        render_pts_viewer_list();
    });

    $('#myCanvas').click(function(evt){
        var rect = this.getBoundingClientRect();
        var mouseX = Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*this.width);
        var mouseY = Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*this.height);
        pt_list.push([mouseX, mouseY])
        draw()
        render_pts_viewer_list()
    })
});
