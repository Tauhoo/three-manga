#define getFaceNormal(positionVarying) vec3( \
    normalize( \
        cross( \
            normalize(dFdx(positionVarying)), \
            normalize(dFdy(positionVarying)) \
        ) \
    ))