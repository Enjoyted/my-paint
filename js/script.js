
$(document).ready(function() {
	
	// Variables :
	var color = "#000";
	var defaut= 3;
	var forme = "crayon";
	var painting = false;
	var started = false;
	var clicked = 0;
	var width_brush = defaut;
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext('2d');
	var cursorX, cursorX2, cursorY, cursorY2, oldx, oldy;
    var canvasOffset = $("#myCanvas").offset();
	var tableau= new Array();
	var c=0;

    var tmp_canvas = document.createElement('canvas');
    var tmp_ctx = tmp_canvas.getContext('2d');
    tmp_canvas.id = 'tmp_canvas';
    tmp_canvas.width = canvas.width;
    tmp_canvas.height = canvas.height;

    sketch.appendChild(tmp_canvas);

	context.lineJoin = 'round';
	context.lineCap = 'round';
	
	tmp_canvas.addEventListener('mousedown', function(e) {
		painting = true;
		cursorX = (e.pageX - canvasOffset.left);
		cursorY = (e.pageY - canvasOffset.top);

		cursorX2=(e.pageX - canvasOffset.left);
		cursorY2=(e.pageY - canvasOffset.top);
		if(forme!="crayon")
		{
			if(clicked==0)
			{
				c++;
				oldx=cursorX;
				oldy=cursorY;
				clicked=1;
				if(forme=="ligne")
					drawLine();
			}
			else
			{
				clicked=2;
				if(forme=="ligne")
					drawLine();
				if(forme=="rect")
					drawRect();
				if(forme=="cercle")
					drawCircle();
				if(forme=="fillRect")
					drawFillRect();
			}
		}
		else
		{
			drawLine();
			c++;
		}
	},false);
	
	// au relachement je dis que le dessin est fini, et je reset ma var clicked et ma var started a 0/false, pour pouvoir reprendre if needed
	tmp_canvas.addEventListener('mouseup',function() {
		painting = false;
		if(forme=="crayon" || clicked==2)
		{
			if(clicked==2)
				copierImage(forme, cursorX, cursorY, oldx, oldy, width_brush, color, c);
			tmp_ctx.clearRect(0,0, tmp_canvas.width, tmp_canvas.height); // je clean le tmp pour plus tard
			started = false;
			clicked=0;
		}
	}, false);
	
	// pour le crayon
	tmp_canvas.addEventListener('mousemove', function(e) {
		
		cursorX = (e.pageX - canvasOffset.left);
		cursorY = (e.pageY - canvasOffset.top);
		if (painting && forme=="crayon") {
			copierImage(forme, cursorX, cursorY, cursorX2, cursorY2, width_brush, color, c);
			tmp_ctx.clearRect(0,0, tmp_canvas.width, tmp_canvas.height);
			drawLine();
		}
		else if(clicked==1)
		{
			tmp_ctx.clearRect(0,0, tmp_canvas.width, tmp_canvas.height);
			if(forme=="ligne")
			{
				started=false;
				drawLine();
				drawLine();
			}
			if(forme=="rect")
				drawRect();
			if(forme=="cercle")
				drawCircle();
			if(forme=="fillRect")
				drawFillRect();
		}
		if(forme=="crayon")
		{
			cursorX2=cursorX;
			cursorY2=cursorY;
		}
	},false);
	
	function copierImage(f, x,y, x2,y2, t, co,id)
	{
		var monImage={forme:f , x:x , y:y , x2:x2 , y2:y2 , taille:t , couleur:co, ident:id};
		tableau.push(monImage);
		context.drawImage(tmp_canvas, 0, 0);// je transfert le content du tmp canvas au real canvas
	}
	function annuler()
	{
		var sid=tableau[tableau.length-1].ident;
		var id_tmp=-1;
		while(tableau[tableau.length-1].ident==sid)
		{
			tableau.pop();
		}
		context.clearRect(0,0, tmp_canvas.width, tmp_canvas.height);
		var i=0;
		for(i=0;i<tableau.length;i++)
		{
			cursorX2=tableau[i].x2;
			cursorY2=tableau[i].y2;
			cursorX=tableau[i].x;
			cursorY=tableau[i].y;
			forme=tableau[i].forme;
			width_brush=tableau[i].taille;
			color=tableau[i].couleur;
			if(forme=="crayon")
			{
				if(id_tmp==-1 || id_tmp != tableau[i].ident)
				{
					started=false;
					id_tmp=tableau[i].ident;
				}
				drawLine();
			}
			if(forme=="ligne")
			{
				started=false;
				drawLine();
				drawLine();
			}
			if(forme=="rect")
				drawRect();
			if(forme=="cercle")
				drawCircle();
			if(forme=="fillRect")
				drawFillRect();
			context.drawImage(tmp_canvas, 0, 0);
			tmp_ctx.clearRect(0,0, tmp_canvas.width, tmp_canvas.height);
		}
	}
	// Fonction pour la ligne :
	function drawLine() {
			if (!started) {
				tmp_ctx.beginPath();
				tmp_ctx.moveTo(cursorX2, cursorY2);
				started = true;
			} 
			else {
				tmp_ctx.lineTo(cursorX, cursorY);
				tmp_ctx.strokeStyle = color;
				tmp_ctx.lineWidth = width_brush;
				tmp_ctx.stroke();
			}
	}

	// Fonction pour le rectangle
	function drawFillRect() {
		tmp_ctx.fillStyle=color;
		tmp_ctx.fillRect(cursorX2,cursorY2,cursorX-cursorX2,cursorY-cursorY2);
	}
	function drawRect() {
		tmp_ctx.beginPath();
		tmp_ctx.strokeStyle = color;
		tmp_ctx.rect(cursorX2,cursorY2,cursorX-cursorX2,cursorY-cursorY2);
		tmp_ctx.lineWidth = width_brush;
		tmp_ctx.stroke();
	}

	// fonction pour le cercle
	function drawCircle() {
		tmp_ctx.beginPath();
		tmp_ctx.arc(cursorX2,cursorY2,Math.sqrt(Math.pow(cursorX-cursorX2,2)+Math.pow(cursorY-cursorY2,2)),0,2*Math.PI);
		tmp_ctx.lineWidth = width_brush;
		tmp_ctx.strokeStyle = color;
		tmp_ctx.stroke();
	}
	// Clear du Canvas :
	function clear_canvas() {
		tableau = [];
		tmp_ctx.clearRect(0,0, canvas.width, canvas.height);
		context.clearRect(0,0, canvas.width, canvas.height);
	}
	
	// Pour chaque carré de couleur :
	$("#couleurs a").each(function() {
		// Je lui attribut une couleur de fond :
		$(this).css("background", $(this).attr("data-couleur"));
		
		// Et au click :
		$(this).click(function() {
			// Je change la couleur du pinceau :
			color = $(this).attr("data-couleur");
			
			// Et les classes CSS :
			$("#couleurs a").removeAttr("class", "");
			$(this).attr("class", "actif");
			
			return false;
		});
	});

	// changement de forme
	$("#forme a").each(function(){
		$(this).click(function(){
			forme=$(this).attr("data-forme");
			clicked=0;
			tmp_ctx.clearRect(0,0, canvas.width, canvas.height);
			painting=false;
			started=false;
		});
	});
	
	// Largeur du pinceau :
	$("#largeurs_pinceau input").change(function() {
		if (!isNaN($(this).val())) {
			width_brush = $(this).val();
			$("#output").html($(this).val() + " pixels");
		}
	});
	
	// Bouton Reset :
	$("#reset").click(function() {
		// Jfais appel a ma fonction clear_canvas qui clean le canvas :
		clear_canvas();
		
		// Je met les valeurs de la taille du pinceau a defaut :
		$("#largeur_pinceau").attr("value", defaut);
		width_brush = defaut;
		$("#output").html(defaut+" pixels");
		// et finalement je remet la couleur en noir
		$("#couleurs a").css("background", $("#couleurs a").attr("#000"));
		color = "#000";
		$("#couleurs a").removeAttr("class", "");
		
	});
	
	// Bouton Save :
	$("#save").click(function() {
		var canvas_tmp = document.getElementById("myCanvas");	// Ca merde en pernant le selecteur jQuery
		window.location = canvas_tmp.toDataURL("image/png");
	});
	
	$("#annuler").click(function(){
		annuler();
	});

	document.onkeydown = applyKey;
			function applyKey (_event_){
	
				// --- Retrieve event object from current web explorer
				var winObj = checkEventObj(_event_);
				
				var intKeyCode = winObj.keyCode;
				var intAltKey = winObj.altKey;
				var intCtrlKey = winObj.ctrlKey;
					if ( intKeyCode == 90 ){
						annuler();
					}
					function checkEventObj ( _event_ ){
	// --- IE explorer
	if ( window.event )
		return window.event;
	// --- Netscape and other explorers
	else
		return _event_;
}
			}
	
});