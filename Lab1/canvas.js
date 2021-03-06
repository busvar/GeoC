document.addEventListener('DOMContentLoaded',domloaded,false);
function domloaded(){
        //========= Auxiliary objects and data =========//

    // Important: this is the input
    var segments = inputJSON.segments; // Requires inputJSON variable set in file
    //var segments = inputJSON.segments.slice(0,6); // You can use slice() to select a subset of the segments. Make sure it is an even number!
    var points = [];
    // See names colors at https://www.w3schools.com/colors/colors_names.asp
    // Add as many colors as needed to classify all intersection types
    var colors = ['Blue', 'Red', 'Green', 'Cyan', 'DarkOrange', 'Magenta', 'RosyBrown'];
    // added by busvar: Access to controller logic
    var sCtrll = new SegmentsController();
    // default styles
    style = {
    curve: {
        width: 6,
        color: "#333"
    },
    line: {
        width: 1,
        color: "#C00"
    },
    point: {
        radius: 4,
        width: 2,
        color: "Black",
        fill: "Black",
        arc1: 0,
        arc2: 2 * Math.PI
    }
    }

    context1 = canvas.getContext("2d");
    drawCanvas();

    //========= Auxiliary functions =========//
    function drawCanvas() {
    // Clear everything
    context1.clearRect(-canvas.width / 2, -canvas.height / 2, 2 * canvas.width, 2 * canvas.height);
    // Draw whatever needs to be drawn
    drawSegments(context1, style, segments); 

    }

    // Draws one point as circle
    function drawPoint(ctx, style, p) {
        ctx.lineWidth = style.point.width;
        ctx.strokeStyle = style.point.color;
        ctx.fillStyle = style.point.fill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, style.point.radius, style.point.arc1, style.point.arc2, true);
        ctx.fill();
        ctx.stroke();
    }

    // Draws one segment
    function drawSegment(ctx, style, segment, lineColor) {
        p1 = segment.from;
        p2 = segment.to;

        // Line segment
        ctx.lineWidth = style.line.width;
        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        ctx.moveTo(p1.x,p1.y);
        ctx.lineTo(p2.x,p2.y);
        ctx.stroke();
                
        // Draw vertices
        drawPoint(ctx, style, segment.from);
        drawPoint(ctx, style, segment.to);
    }

    // Draws all segments
    function drawSegments(ctx, style, segments) {
        //For each pair draw pair after classifying intersection

        for (var i = 0; i < segments.length; i=i+2) {
            // Classify intersection and obtain color to draw pair of segments
            var intersectionClass = classifyIntersection(segments[i], segments[i+1]);
            reportResult(intersectionClass); // print description
            var lineColor = colors[intersectionClass.type];
            // Draw segment 
            drawSegment(ctx, style, segments[i], lineColor);
            drawSegment(ctx, style, segments[i+1], lineColor);
        }
    }

    // Outputs the value of the intersection classification to the "results" HTML element
    function reportResult(intersectionClass) {
        var text = "<font color='" + colors[intersectionClass.type] + "'>";
        text = text + Object.keys(sCtrll.Intersection)[intersectionClass.type] + ": " + intersectionClass.description;
        text = text + "</font><br>";
        document.getElementById('result').innerHTML = document.getElementById('result').innerHTML + text;
    }

    //========= Your code probably should be somewhere here =========//


    // TODO: Add your code here to classify all possible segment intersection types
    function classifyIntersection(s1, s2) {
        var intersectionType, intersectionTypeDescription;
/*
        // Dummy code: an absurd classification criterion
        if (s1.from.x < s2.from.x)  {
            intersectionType = 1;
            intersectionTypeDescription = "s1 starts to the left of s2";
            }
        else {
            intersectionType = 2;
            intersectionTypeDescription = "s1 does not start to the left of s2";
            }
            */
        // Return object with two fields: a numbered type, and a description
        // return {"type": intersectionType, "description": intersectionTypeDescription}
       
        return sCtrll.verifyIntersectionBetween(s1,s2);
    }

}


