
class SegmentsController
{
    constructor()
    {
        this.Position = Object.freeze({"left" : 0, "inline" : 1, "right": 2});
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
}