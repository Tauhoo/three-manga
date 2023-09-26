#define PI 3.14
#define HATCHING_LAYERS 4

float random (vec2 seed) {
    return fract(sin(dot(seed.xy,vec2(12.9898,78.233)))*43758.5453123);
}

vec2 rotation(vec2 point, float angle){
    vec2 direction = normalize(point);
    float newAngle = atan(direction.y, direction.x) + angle;
    return vec2(sin(newAngle), cos(newAngle)) * distance(point, vec2(0));
}

float wave(float offset, float period){
    return sin(offset / period);
}

vec4 voronoiNoiseNearest2Cell(vec2 position, float baseCellSize){
    vec2 baseCell = floor(position / baseCellSize) * baseCellSize;

    float minDistance = baseCellSize * 2.;
    vec2 minCellPosition = vec2(0);
    for(int offsetX = -1; offsetX < 2; offsetX++){
        for(int offsetY = -1; offsetY < 2; offsetY++){
            vec2 cell = baseCell + vec2(offsetX, offsetY) * baseCellSize;
            vec2 cellOffset = vec2(random(cell), random(cell.yx)) * baseCellSize;
            vec2 cellCenter = cell + cellOffset;
            float dist = distance(position, cellCenter);
            if(minDistance > dist){
                minDistance = dist;
                minCellPosition = cellCenter;
            }
    	}
    }
    
    float minDistance2 = baseCellSize * 2.;
    vec2 minCellPosition2 = vec2(0);
    for(int offsetX = -1; offsetX < 2; offsetX++){
        for(int offsetY = -1; offsetY < 2; offsetY++){
            vec2 cell = baseCell + vec2(offsetX, offsetY) * baseCellSize;
            vec2 cellOffset = vec2(random(cell), random(cell.yx)) * baseCellSize;
            vec2 cellCenter = cell + cellOffset;
            float dist = distance(position, cellCenter);
            if(minDistance2 > dist && dist != minDistance){
                minDistance2 = dist;
                minCellPosition2 = cellCenter;
            }
    	}
    }
    
    return vec4(minCellPosition, minCellPosition2);
}

float hatching(vec2 position, float voronoiBaseCellSize, float hatchingPadding, float density){
    float overRangeDensity = density * 1.02 - .01;

    vec4 noisePositions = voronoiNoiseNearest2Cell(position, voronoiBaseCellSize);
    float degree = random(noisePositions.xy) * 2. * PI;
    vec2 rotatedPosition = rotation(position, degree);
    float w = step(1. - overRangeDensity, wave(rotatedPosition.x, 2.) * .5 + .5);
    
    if(abs(distance(noisePositions.xy, position) - distance(noisePositions.zw, position)) < hatchingPadding){
        return 0.;
    }
    
    return w;
}

float layeredHatching(vec2 position, float voronoiBaseCellSize, float hatchingPadding, float density){
    for(int index = 0; index < HATCHING_LAYERS; index++){
        if(1. == hatching(position + vec2(1, index) * 100. * float(index), voronoiBaseCellSize, hatchingPadding, density)){         
            return 1.;
        }
    }
    return 0.;
}
