class Point 
{
    constructor(x,y)
    {
        if(!isNaN(x.x) && !isNaN(x.y)) 
        {
            this.x = x.x;
            this.y = x.y;
        }
        else if(isNaN(x) || isNaN(y)) 
        {
            throw "Wrong paramenters: they should be numbers!";

        }
        else
        {
            this.x = x;
            this.y = y;
        }
    }
}


class Segment
{
    constructor(from, to)
    {
        this.from = from;
        this.to = to;
    }
}

class Polygon
{
    
}