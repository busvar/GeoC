class Point 
{
    constructor(x,y)
    {
        if(isNaN(x) || isNaN(y)) 
        {
            throw "Wrong paramenters: they should be numbers!";
        }
        this.x = x;
        this.y = y;
    }
}


class Segment
{
    constructor(from, to)
    {
        if(typeof(Point) != typeof(from) || typeof(Point) != typeof(to))
        {
            throw "Error: Segment should be composed by Points!";
        }
        this.from = from;
        this.to = to;
    }
}

class Polygon
{
    
}