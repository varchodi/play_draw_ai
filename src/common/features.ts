export const features = {
    getPathCount: (paths: [number, number][][]) => {
        return paths.length;
    },
    
    getPointsCount: (paths:[number,number][][]) => {
        return paths.flat().length;
    },

}