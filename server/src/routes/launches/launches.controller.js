// const { planets } = require("../../models/planets.model");

// function getAllPlanets(req, res) {
//   return res.status(200).json(planets);
// }

// module.exports = {
//   getAllPlanets,
// };

const {
  getAllLaunches,
  scheduleNewLaunch,
  doesLaunchExist,
  abortLaunchById,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.target ||
    !launch.launchDate
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const launchExists = await doesLaunchExist(launchId);

  if (!launchExists) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  console.log("launchId", launchId);
  const aborted = await abortLaunchById(launchId);
  console.log("aborted in httpAbort", aborted);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  } else {
    return res.status(200).json({
      ok: true,
    });
  }
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
