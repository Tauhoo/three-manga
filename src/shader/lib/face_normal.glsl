#define faceNormal(positionVarying) vec3( \
    normalize( \
        cross( \
            normalize(dFdx(positionVarying)), \
            normalize(dFdy(positionVarying)) \
        ) \
    ) * 0.5 + 0.5)