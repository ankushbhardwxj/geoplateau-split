import { sleep } from "k6";
import http from "k6/http";

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10000,
  // A string specifying the total duration of the test run.
  duration: "10s",

  // The following section contains configuration options for execution of this
  // test script in Grafana Cloud.
  //
  // See https://grafana.com/docs/grafana-cloud/k6/get-started/run-cloud-tests-from-the-cli/
  // to learn about authoring and running k6 test scripts in Grafana k6 Cloud.
  //
  // cloud: {
  //   // The ID of the project to which the test is assigned in the k6 Cloud UI.
  //   // By default tests are executed in default project.
  //   projectID: "",
  //   // The name of the test in the k6 Cloud UI.
  //   // Test runs with the same name will be grouped.
  //   name: "script.js"
  // },

  // Uncomment this section to enable the use of Browser API in your tests.
  //
  // See https://grafana.com/docs/k6/latest/using-k6-browser/running-browser-tests/ to learn more
  // about using Browser API in your test scripts.
  //
  // scenarios: {
  //   // The scenario name appears in the result summary, tags, and so on.
  //   // You can give the scenario any name, as long as each name in the script is unique.
  //   ui: {
  //     // Executor is a mandatory parameter for browser-based tests.
  //     // Shared iterations in this case tells k6 to reuse VUs to execute iterations.
  //     //
  //     // See https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ for other executor types.
  //     executor: 'shared-iterations',
  //     options: {
  //       browser: {
  //         // This is a mandatory parameter that instructs k6 to launch and
  //         // connect to a chromium-based browser, and use it to run UI-based
  //         // tests.
  //         type: 'chromium',
  //       },
  //     },
  //   },
  // }
};

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//

const postData = JSON.stringify({
  refid: 232323,
  building_limits: {
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
  },
  height_plateaus: {
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
  },
});

export default async function () {
  await http.post("http://localhost:8081/api/v1/geo/split-building-limit", postData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  sleep(1);
}
