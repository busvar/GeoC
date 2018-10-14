
class SegmentsController
{
    constructor()
    {
        this.Position = Object.freeze({"left" : 0, "inline" : 1, "right": 2, "interior":3, "exterior":4});
        this.Intersection = Object.freeze({"none":0,"semiIntersect":1,"intersect":2, 
            "completeIntersect":3, "endIntersection":4});
    }

    relativePointPositionRespectSegment(point,segment) 
    {
        var result;
        var determinant = ((segment.to.x - segment.from.x) * (point.y - segment.from.y )) 
        - ((segment.to.y - segment.from.y) * (point.x - segment.from.x));
        if(determinant > 0) result = this.Position.left;
        else if(determinant == 0) result = this.Position.inline;
        else if(determinant<0) result = this.Position.right;
        return result;
    }

    // Circle must be an array of 3 points not align
    relativePointPositionRespectCircle(point,circle)
    {
        circle = this.counterClockWiseSortOf3Points(circle); 
        var d1 = (circle[1].x - circle[0].x) * (circle[2].y - circle[0].y) *
         ((point.x - circle[0].x)*(point.x + circle[0].x) + 
         (point.y - circle[0].y)*(point.y + circle[0].y)); 
        var d2 = (circle[2].x - circle[0].x) * (point.y - circle[0].y) *
         ((circle[1].x - circle[0].x)*(circle[1].x + circle[0].x) +
         (circle[1].y - circle[0].y)*(circle[1].y + circle[0].y));
        var d3 = (point.x - circle[0].x) * (circle[1].y - circle[0].y) *
        ((circle[2].x - circle[0].x)*(circle[2].x + circle[0].x) +
        (circle[2].y - circle[0].y)*(circle[2].y + circle[0].y));
        var d4 = (point.x - circle[0].x) * (circle[2].y - circle[0].y) *
        ((circle[1].x - circle[0].x)*(circle[1].x + circle[0].x) +
        (circle[1].y - circle[0].y)*(circle[1].y + circle[0].y));
        var d5 = (circle[2].x - circle[0].x) * (circle[1].y-circle[0].y) * 
        ((point.x - circle[0].x)*(point.x + circle[0].x) + 
         (point.y - circle[0].y)*(point.y + circle[0].y)); 
        var d6 = (circle[1].x - circle[0].x) * (point.y - circle[0].y) * 
        ((circle[2].x - circle[0].x)*(circle[2].x + circle[0].x) +
        (circle[2].y - circle[0].y)*(circle[2].y + circle[0].y));
        var det = d1+d2+d3-d4-d5-d6;

        if(det < 0) return this.Position.interior;
        if(det == 0) return this.Position.inline;
        return this.Position.exterior; 
    }

    slope(leftPoint,rightPoint)
    {
        if(rightPoint.x == leftPoint.x) return 9007199254740992; //max value computable
        return (rightPoint.y - leftPoint.y) / (rightPoint.x - leftPoint.x);
    }

    counterClockWiseSortOf3Points(points)
    {
        points.sort(function(a,b){
            if(a.x == b.x ) return a.y - b.y;
            return a.x - b.x;
        });   
        if(this.slope(points[0],points[2]) < this.slope(points[0],points[1])) 
        {
            points[2] = [points[1], points[1] = points[2]][0];
        }  

        return points;
    }

    verifyIfPointIsInteriorToTriangle(point,triangle)
    {
        if(point.x == triangle[0].x && point.y == triangle[0].y
            || point.x == triangle[1].x && point.y == triangle[1].y 
            || point.x == triangle[2].x && point.y == triangle[2].y) 
       {
           return {"color":4, "description": "The point is over a triangle's vertex"};
       }

        triangle = this.counterClockWiseSortOf3Points(triangle);
        //Segment are ordered counter-clockwise
        var segment1 = new Segment(new Point(triangle[0]),new Point(triangle[1]));
        var segment2 = new Segment(new Point(triangle[1]),new Point(triangle[2]));
        var segment3 = new Segment(new Point(triangle[2]),new Point(triangle[0])); 

        var pointPositionRelativeToSegment1 = this.relativePointPositionRespectSegment(point,segment1);
        var pointPositionRelativeToSegment2 = this.relativePointPositionRespectSegment(point,segment2);
        var pointPositionRelativeToSegment3 = this.relativePointPositionRespectSegment(point,segment3);

        if(pointPositionRelativeToSegment1 == this.Position.left &&
             pointPositionRelativeToSegment2 == this.Position.left &&
             pointPositionRelativeToSegment3 == this.Position.left) 
             {
                 return {"color":2, "description":"The point("+point.x+","+point.y+") is Interior"};
             }
        if((pointPositionRelativeToSegment1 == this.Position.inline &&
             pointPositionRelativeToSegment2 == this.Position.left &&
             pointPositionRelativeToSegment3 == this.Position.left) ||
             (pointPositionRelativeToSegment1 == this.Position.left &&
             pointPositionRelativeToSegment2 == this.Position.inline &&
             pointPositionRelativeToSegment3 == this.Position.left) ||
             (pointPositionRelativeToSegment1 == this.Position.left &&
             pointPositionRelativeToSegment2 == this.Position.left &&
             pointPositionRelativeToSegment3 == this.Position.inline)) 
        {
            return {"color":0, "description": "The point is over a triangle's segment"};
        }
        return {"color": 1, "description": "The point is outside the triangle"};
    }

    verifyIntersectionBetween(segmentA,segmentB)
    {
        var type;
        var positionBeginPointOfSegmentA = 
            this.relativePointPositionRespectSegment(segmentA.from,segmentB);
        var positionEndPointOfSegmentA = 
            this.relativePointPositionRespectSegment(segmentA.to,segmentB);
        var positionBeginPointOfSegmentB = 
            this.relativePointPositionRespectSegment(segmentB.from,segmentA);
        var positionEndPointOfSegmentB = 
            this.relativePointPositionRespectSegment(segmentB.to,segmentA);

        var maxSegmentAX = Math.max(segmentA.from.x,segmentA.to.x);
        var minSegmentAX = Math.min(segmentA.from.x,segmentA.to.x);
        var maxSegmentBX = Math.max(segmentB.from.x,segmentB.to.x);
        var minSegmentBX = Math.min(segmentB.from.x,segmentB.to.x);
        var maxSegmentAY = Math.max(segmentA.from.y,segmentA.to.y);
        var minSegmentAY = Math.min(segmentA.from.y,segmentA.to.y);
        var maxSegmentBY = Math.max(segmentB.from.y,segmentB.to.y);
        var minSegmentBY = Math.min(segmentB.from.y,segmentB.to.y);

        if( (positionBeginPointOfSegmentA == this.Position.left 
            && positionEndPointOfSegmentA == this.Position.left)
            || (positionBeginPointOfSegmentB == this.Position.right 
            && positionEndPointOfSegmentB == this.Position.right)
            || (positionBeginPointOfSegmentA == this.Position.right 
            && positionEndPointOfSegmentA == this.Position.right)
            || (positionBeginPointOfSegmentB == this.Position.left 
            && positionEndPointOfSegmentB == this.Position.left))
            {
                type = this.Intersection.none;
            }
        else if(positionBeginPointOfSegmentB == this.Position.inline &&
            positionEndPointOfSegmentB == this.Position.inline)
            {
                if(maxSegmentAX < minSegmentBX || minSegmentBX < minSegmentAX) 
                {
                    type = this.Intersection.none;
                }
                else if(minSegmentAX == maxSegmentAX &&
                    (maxSegmentAY < minSegmentBY || maxSegmentBY < minSegmentAY))
                {
                    type = this.Intersection.none;
                }
                else if(minSegmentAX < minSegmentBX && maxSegmentAX > maxSegmentBX ||
                    (minSegmentAX == maxSegmentAX && minSegmentAX < minSegmentBX && 
                        maxSegmentAX > maxSegmentBX))
                {
                    type = this.Intersection.completeIntersect;
                }
                else if(((maxSegmentAX == minSegmentBX || maxSegmentBX == minSegmentAX)
                     && minSegmentAX != maxSegmentAX) || (minSegmentAX == maxSegmentAX 
                        && (maxSegmentAY == minSegmentBY || maxSegmentBY == minSegmentAY))) {
                    type = this.Intersection.endIntersection;
                }
                else {
                    type = this.Intersection.semiIntersect;
                }
            }
        else if((positionBeginPointOfSegmentA == this.Position.right &&
            positionEndPointOfSegmentA == this.Position.left) ||
            (positionBeginPointOfSegmentB == this.Position.left &&
            positionEndPointOfSegmentB == this.Position.right ))
            {
                if(positionBeginPointOfSegmentA == this.Position.inline ||
                    positionEndPointOfSegmentA == this.Position.inline ||
                    positionBeginPointOfSegmentB == this.Position.inline ||
                    positionEndPointOfSegmentB == this.Position.inline) {
                        type = this.Intersection.endIntersection;
                    }
                    else {
                        type = this.Intersection.intersect;
                    }
            }
            else 
            {
                type = this.Intersection.endIntersection;
            }
            return {"type" : type, 
            "description": "s1 starts to the  " + Object.keys(this.Position)[positionBeginPointOfSegmentA] + " of segmentB."};
    }
    
    verifyPointToCircle(point,circle)
    {
        var relativePosition = this.relativePointPositionRespectCircle(point,circle);
        if(relativePosition == this.Position.exterior) 
        {
            return {"color":1,"description":"The point is exterior to the Circle"};
        }
        if(relativePosition == this.Position.inline) 
        {
            return {"color":0,"description":"The point is in the boundary of the circle"};
        }
        return {"color":2,"description":"The point is interion to the circle"};
    }
}