import { area, booleanIntersects, booleanWithin, featureCollection, intersect, polygon, union } from "@turf/turf";

const turf = require("@turf/turf");

// Sample building limits GeoJSON
const buildingLimits = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [10.757867266534337, 59.91339283457274],
            [10.756516000002959, 59.913633000004204],
            [10.756398999995643, 59.91346700000333],
            [10.75628300000438, 59.91330300000502],
            [10.756052815307351, 59.91297582153187],
            [10.756245682709302, 59.912959479672516],
            [10.757486364709461, 59.91285434826322],
            [10.757867266534337, 59.91339283457274],
          ],
        ],
      },
    },
  ],
};

// Sample height plateaus GeoJSON
const heightPlateaus = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [10.75678086443506, 59.91291413160555],
            [10.757486364709461, 59.91285434826322],
            [10.757867266534337, 59.91339283457274],
            [10.757212164399775, 59.91350927037677],
            [10.75678086443506, 59.91291413160555],
          ],
        ],
      },
      properties: {
        elevation: 3.63,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [10.756996990155885, 59.91321236033006],
            [10.757212164399775, 59.91350927037677],
            [10.756516000002959, 59.913633000004204],
            [10.756398999995643, 59.91346700000333],
            [10.756312148500106, 59.91334421011477],
            [10.756996990155885, 59.91321236033006],
          ],
        ],
      },
      properties: {
        elevation: 4.63,
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [10.756312148500106, 59.91334421011477],
            [10.75628300000438, 59.91330300000502],
            [10.756052815307351, 59.91297582153187],
            [10.756245682709302, 59.912959479672516],
            [10.75678086443506, 59.91291413160555],
            [10.756996990155885, 59.91321236033006],
            [10.756312148500106, 59.91334421011477],
          ],
        ],
      },
      properties: {
        elevation: 2.63,
      },
    },
  ],
};

// Function to split building limits by height plateaus
function splitBuildingLimits(buildingLimits: any, heightPlateaus: any) {
  const splitLimits: any = [];

  buildingLimits.features.forEach((buildingLimit: any) => {
    heightPlateaus.features.forEach((heightPlateau: any) => {
      const intersects = booleanIntersects(buildingLimit, heightPlateau);
      if (intersects) {
        const feature1 = polygon(buildingLimit.geometry.coordinates);
        const feature2 = polygon(heightPlateau.geometry.coordinates);

        const intersection = intersect(featureCollection([feature1, feature2]));
        // console.log(intersection)
        if (intersection) {
          intersection.properties = {
            elevation: heightPlateau.properties.elevation,
          };
        }
        splitLimits.push(intersection);
      }
    });
  });

  return {
    type: "FeatureCollection",
    features: splitLimits,
  };
}

function checkForGaps(buildingLimits: any, heightPlateaus: any) {
  let totalArea = 0;
  const heightPlateausPolygon = heightPlateaus.features.map((feature: any) => {
    const {coordinates} = feature.geometry ;
    const p = polygon(coordinates)
    if (p) {
      totalArea += (area(p))
    }
    return p
  });
  const heightPlateausUnion = union(featureCollection(heightPlateausPolygon));
  if (!heightPlateausUnion) return null;
  const totalAreaMerged = (area(heightPlateausUnion));
  console.log(totalArea, totalAreaMerged)
  if (totalArea < totalAreaMerged) {
    console.log("Validation Error: Gaps exists between height plateaus");
  } return true;
}

function checkCompleteCoverage(buildingLimits: any, heightPlateaus: any) {
  const heightPlateausPolygons = heightPlateaus.features.map((feature: any) => {
    const {coordinates} = feature.geometry;
    return polygon(coordinates);
  });
  const combinedHeightPlateau = union(featureCollection(heightPlateausPolygons));
  if (!combinedHeightPlateau ) return;
  const isCompletelyCovered = booleanWithin(buildingLimits.features[0], combinedHeightPlateau);
  return isCompletelyCovered;
}

// Perform the split
// const splitBuildingLimitsResult = splitBuildingLimits(buildingLimits, heightPlateaus);

// console.log(JSON.stringify(splitBuildingLimitsResult, null, 2));

// write the splitbuildngLimitsResult to a json file
// checkForGaps(buildingLimits, heightPlateaus)
checkCompleteCoverage(buildingLimits, heightPlateaus)