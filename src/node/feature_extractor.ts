import { constants } from "../common/constants";
import * as fs from "node:fs";
import { SampleType } from "../common/js_object/samples";
import { features } from "../common/features";
export const extract_features = () => {
  console.log("extracting");
  const samples: SampleType[] = JSON.parse(
    fs.readFileSync(constants.SAMPLES!) as unknown as string
  );

  for (const sample of samples) {
    const paths = JSON.parse(
      fs.readFileSync(
        `${constants.JSON_DIR}/${sample.id}.json`
      ) as unknown as string
    );
    //push in paths
    sample.point = [
      features.getPathCount(paths),
      features.getPointsCount(paths),
    ];
  }

  //features name ;
  const featureNames = ["Path Count", "Point Count"];
  fs.writeFileSync(
    constants.FEATURE!,
    JSON.stringify({
      featureNames,
      samples: samples.map((s) => ({ point: s.point, label: s.label })),
    })
  );

  //save in ts file
  fs.writeFileSync(
    constants.FEATURES_JS!,
    `export const featuresTS=${JSON.stringify({ featureNames, samples })}`
  );

  // ??
  console.log("done");
};
