const {
  combineStats,
  skillSet,
  makeAuto,
  makeDeco,
  makeMulti,
} = require("../facilitators.js");
const {
  base,
  statnames,
  gunCalcNames,
  dfltskl,
  smshskl,
} = require("../constants.js");
const { genericTank } = require("./generics.js");
const { trapper, healer } = require("./tanks.js");
const g = require("../gunvals.js");

// OBSTACLES
exports.rock = {
  TYPE: "wall",
  DAMAGE_CLASS: 1,
  LABEL: "Rock",
  FACING_TYPE: "turnWithSpeed",
  SHAPE: -9,
  CAN_GO_OUTSIDE_ROOM: true,
  BODY: {
    PUSHABILITY: 0,
    HEALTH: 10000,
    SHIELD: 10000,
    REGEN: 1000,
    DAMAGE: 1,
    RESIST: 100,
    STEALTH: 1,
  },
  VALUE: 0,
  SIZE: 60,
  COLOR: "grey",
  VARIES_IN_SIZE: true,
  ACCEPTS_SCORE: false,
};
exports.stone = {
  PARENT: ["rock"],
  LABEL: "Stone",
  SIZE: 32,
  SHAPE: -7,
};
exports.moon = {
  PARENT: ["rock"],
  LABEL: "Moon",
  SIZE: 60,
  SHAPE: 0,
};
exports.gravel = {
  PARENT: ["rock"],
  LABEL: "Gravel",
  SIZE: 16,
  SHAPE: -7,
};
exports.wall = {
  PARENT: ["rock"],
  LABEL: "Wall",
  SIZE: 25,
  SHAPE: 4,
};

// DOMINATORS
exports.dominationBody = {
  LABEL: "",
  CONTROLLERS: [
    ["spin", { startAngle: Math.PI / 2, speed: 0, independent: true }],
  ],
  COLOR: "black",
  SHAPE: 6,
  INDEPENDENT: true,
};
exports.dominator = {
  PARENT: ["genericTank"],
  LABEL: "Dominator",
  UPGRADE_LABEL: "Unknown",
  ON_MINIMAP: false,
  DANGER: 7,
  SKILL: skillSet({
    rld: 1,
    dam: 1,
    pen: 1,
    str: 1,
    spd: 1,
  }),
  LEVEL: -1,
  BODY: {
    RESIST: 100,
    SPEED: 1.32,
    ACCELERATION: 0.8,
    HEALTH: 590,
    DAMAGE: 6,
    PENETRATION: 0.25,
    FOV: 0.5,
    PUSHABILITY: 0,
    HETERO: 0,
    SHIELD: base.SHIELD * 1.4,
  },
  CONTROLLERS: ["nearestDifferentMaster"],
  DISPLAY_NAME: true,
  TURRETS: [
    {
      POSITION: [22, 0, 0, 0, 360, 0],
      TYPE: "dominationBody",
    },
  ],
  CAN_BE_ON_LEADERBOARD: false,
  GIVE_KILL_MESSAGE: false,
  ACCEPTS_SCORE: false,
  HITS_OWN_TYPE: "pushOnlyTeam",
};
exports.destroyerDominator = {
  PARENT: ["dominator"],
  UPGRADE_LABEL: "Destroyer",
  GUNS: [
    {
      POSITION: [15.25, 6.75, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyerDominator]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [5, 6.75, -1.6, 6.75, 0, 0, 0],
    },
  ],
};
exports.gunnerDominator = {
  PARENT: ["dominator"],
  UPGRADE_LABEL: "Gunner",
  GUNS: [
    {
      POSITION: [14.25, 3, 1, 0, -2, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunnerDominator]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14.25, 3, 1, 0, 2, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunnerDominator]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [15.85, 3, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunnerDominator]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [5, 8.5, -1.6, 6.25, 0, 0, 0],
    },
  ],
};
exports.trapperDominator = {
  PARENT: ["dominator"],
  UPGRADE_LABEL: "Trapper",
  FACING_TYPE: ["spin", { speed: 0.02 }],
  CONTROLLERS: ["alwaysFire"],
  GUNS: [
    {
      POSITION: [4, 3.75, 1, 8, 0, 0, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 3.75, 1, 8, 0, 45, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 3.75, 1, 8, 0, 90, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 3.75, 1, 8, 0, 135, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 3.75, 1, 8, 0, 180, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 3.75, 1, 8, 0, 225, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 225, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 3.75, 1, 8, 0, 270, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 270, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 3.75, 1, 8, 0, 315, 0],
    },
    {
      POSITION: [1.25, 3.75, 1.7, 12, 0, 315, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.trapperDominator]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

// SANCTUARIES
exports.sanctuaryHealer = {
  PARENT: "genericTank",
  LABEL: "",
  BODY: {
    FOV: base.FOV * 1.2,
  },
  CONTROLLERS: [["spin", { independent: true, speed: -0.05 }]],
  TURRETS: [
    {
      POSITION: { SIZE: 13, LAYER: 1 },
      TYPE: [
        "healerSymbol",
        {
          CONTROLLERS: [
            ["spin", { startAngle: Math.PI / 2, speed: 0, independent: true }],
          ],
        },
      ],
    },
  ],
};

let sancTiers = [3, 6, 8, 9, 10, 12];
let sancHealerTiers = [2, 3, 4];
for (let tier of sancHealerTiers) {
  exports["sanctuaryHealerTier" + (sancHealerTiers.indexOf(tier) + 1)] = {
    PARENT: "sanctuaryHealer",
    GUNS: (() => {
      let output = [];
      for (let i = 0; i < tier; i++) {
        output.push(
          {
            POSITION: {
              LENGTH: 8,
              WIDTH: 9,
              ASPECT: -0.5,
              X: 12.5,
              ANGLE: (360 / tier) * i,
            },
          },
          {
            POSITION: { LENGTH: 8, WIDTH: 10, X: 10, ANGLE: (360 / tier) * i },
            PROPERTIES: {
              SHOOT_SETTINGS: combineStats([
                g.basic,
                g.healer,
                { shudder: 0.1, spray: 0.1, speed: 0.8, reload: 1.2 },
              ]),
              TYPE: "healerBullet",
              AUTOFIRE: true,
            },
          },
        );
      }
      return output;
    })(),
  };
}

exports.sanctuary = {
  PARENT: "dominator",
  LABEL: "Sanctuary",
  LEVEL: 45,
  SIZE: 20,
  FACING_TYPE: ["spin", { speed: 0.02 }],
  CONTROLLERS: ["alwaysFire"],
  SKILL: skillSet({
    rld: 1.25,
    dam: 1.25,
    str: 1.25,
  }),
  BODY: {
    HEALTH: 750,
    DAMAGE: 7.5,
    SHIELD: base.SHIELD * 1.5,
  },
  TURRETS: [
    {
      POSITION: { SIZE: 22 },
      TYPE: "dominationBody",
    },
  ],
};

for (let tier of sancTiers) {
  let sancIndex = sancTiers.indexOf(tier);
  exports["sanctuaryTier" + (sancIndex + 1)] = {
    PARENT: "sanctuary",
    TURRETS: [],
    UPGRADE_LABEL: "Tier " + (sancIndex + 1),
    GUNS: (() => {
      let output = [];
      for (let i = 0; i < tier; i++) {
        output.push(
          {
            POSITION: { LENGTH: 12, WIDTH: 4, ANGLE: (360 / tier) * i },
          },
          {
            POSITION: {
              LENGTH: 1.5,
              WIDTH: 4,
              ASPECT: 1.7,
              X: 12,
              ANGLE: (360 / tier) * i,
            },
            PROPERTIES: {
              SHOOT_SETTINGS: combineStats([
                g.trap,
                { shudder: 2, spray: 1.2, speed: 0.8, reload: 1.5 },
              ]),
              TYPE: "trap",
              STAT_CALCULATOR: gunCalcNames.trap,
              AUTOFIRE: true,
            },
          },
        );
      }
      return output;
    })(),
  };
  exports["sanctuaryTier" + (sancIndex + 1)].TURRETS.push(
    {
      POSITION: { SIZE: 22 },
      TYPE: "dominationBody",
    },
    {
      POSITION: { SIZE: 8.5, LAYER: 1 },
      TYPE:
        "sanctuaryHealerTier" +
        (sancIndex < 2 ? 1 : sancIndex < 4 ? 2 : sancIndex < 6 ? 3 : 3),
    },
  );
}

// CRASHERS
exports.crasher = {
  TYPE: "crasher",
  LABEL: "Crasher",
  COLOR: "pink",
  SHAPE: 3,
  SIZE: 5,
  VARIES_IN_SIZE: true,
  CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
  AI: {
    NO_LEAD: true,
  },
  BODY: {
    SPEED: 5,
    ACCELERATION: 1.4,
    HEALTH: 0.5,
    DAMAGE: 5,
    PENETRATION: 2,
    PUSHABILITY: 0.5,
    DENSITY: 10,
    RESIST: 2,
  },
  MOTION_TYPE: "motor",
  FACING_TYPE: "smoothWithMotion",
  HITS_OWN_TYPE: "hard",
  HAS_NO_MASTER: true,
  DRAW_HEALTH: true,
};
exports.crasherSpawner = {
  PARENT: ["genericTank"],
  LABEL: "Spawned",
  STAT_NAMES: statnames.drone,
  CONTROLLERS: ["nearestDifferentMaster"],
  COLOR: "pink",
  INDEPENDENT: true,
  AI: {
    chase: true,
  },
  MAX_CHILDREN: 4,
  GUNS: [
    {
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.weak, g.weak]),
        TYPE: [
          "drone",
          {
            LABEL: "Crasher",
            VARIES_IN_SIZE: true,
            DRAW_HEALTH: true,
          },
        ],
        SYNCS_SKILLS: true,
        AUTOFIRE: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};

// SENTRIES
exports.sentry = {
  PARENT: ["genericTank"],
  TYPE: "crasher",
  LABEL: "Sentry",
  DANGER: 3,
  COLOR: "pink",
  UPGRADE_COLOR: "pink",
  SHAPE: 3,
  SIZE: 10,
  SKILL: skillSet({
    rld: 0.5,
    dam: 0.8,
    pen: 0.8,
    str: 0.1,
    spd: 1,
    atk: 0.5,
    hlt: 0,
    shi: 0,
    rgn: 0.7,
    mob: 0,
  }),
  VALUE: 1500,
  VARIES_IN_SIZE: true,
  CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
  AI: {
    NO_LEAD: true,
  },
  BODY: {
    FOV: 0.5,
    ACCELERATION: 0.75,
    DAMAGE: base.DAMAGE,
    SPEED: 0.5 * base.SPEED,
    HEALTH: 0.3 * base.HEALTH,
  },
  MOTION_TYPE: "motor",
  FACING_TYPE: "smoothToTarget",
  HITS_OWN_TYPE: "hard",
  HAS_NO_MASTER: true,
  DRAW_HEALTH: true,
  GIVE_KILL_MESSAGE: true,
};
exports.trapTurret = {
  PARENT: ["genericTank"],
  LABEL: "Turret",
  BODY: {
    FOV: 0.5,
  },
  INDEPENDENT: true,
  CONTROLLERS: ["nearestDifferentMaster", "onlyAcceptInArc"],
  COLOR: "grey",
  AI: {
    SKYNET: true,
    FULL_VIEW: true,
  },
  GUNS: [
    {
      POSITION: [16, 14, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [4, 14, 1.8, 16, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.lowpower,
          g.fast,
          g.halfreload,
        ]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

exports.shotTrapBox = {
  PARENT: "unsetTrap",
  MOTION_TYPE: "glide",
};
let makeshottrapTurretProps = () => ({
  SHOOT_SETTINGS: combineStats([
    g.trap,
    g.block,
    g.shotgun,
    g.mach,
    { speed: 0.7, maxSpeed: 0.2, damage: 1.5 },
  ]),
  AUTOFIRE: true,
  TYPE: "shotTrapBox",
  STAT_CALCULATOR: gunCalcNames.block,
});
exports.shottrapTurret = {
  PARENT: ["genericTank"],
  LABEL: "Turret",
  BODY: {
    FOV: 0,
  },
  INDEPENDENT: true,
  CONTROLLERS: ["nearestDifferentMaster", "onlyAcceptInArc"],
  COLOR: "grey",
  AI: {
    SKYNET: true,
    FULL_VIEW: true,
  },
  GUNS: [
    {
      POSITION: [4, 1.5, 1, 11, -3, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [4, 2, 1, 11, 3, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [4, 1.5, 1, 13, 0, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [1, 2, 1, 11, 1, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [1, 2, 1, 12, -1, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [1, 1.5, 1, 11, 1, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [1, 2, 1, 13, -1, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [1, 2, 5, 1, 13, 1, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [1, 2, 1, 13, 2, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [1, 2, 1, 13, -2, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [1, 2.5, 1, 13, -2, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [1, 2.5, 1, 13, 2, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [1, 2, 1, 13, -2, 0, 0],
      PROPERTIES: makeshottrapTurretProps(),
    },
    {
      POSITION: [16, 14, -1.4, 0, 0, 0, 0],
    },
    {
      POSITION: [6, 14, 1.6, 16, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.block,
          g.shotgun,
          g.mach,
          g.fake,
        ]),
        AUTOFIRE: true,
        TYPE: "bullet",
      },
    },
  ],
};
exports.barricadeTurret = {
  PARENT: ["genericTank"],
  LABEL: "Turret",
  BODY: {
    FOV: 0.5,
  },
  INDEPENDENT: true,
  CONTROLLERS: ["nearestDifferentMaster"],
  COLOR: "grey",
  AI: {
    SKYNET: true,
    FULL_VIEW: true,
  },
  GUNS: [
    {
      POSITION: [24, 8, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [4, 8, 1.3, 22, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 8, 1.3, 18, 0, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 8, 1.3, 14, 0, 0, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.mini, g.halfrange]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

exports.sentrySwarm = {
  PARENT: ["sentry"],
  UPGRADE_LABEL: "Swarm Sentry",
  UPGRADE_COLOR: "pink",
  GUNS: [
    {
      POSITION: [7, 14, 0.6, 7, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.morerecoil]),
        TYPE: "swarm",
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};
exports.megaAutoTurret = {
  PARENT: ["autoTurret"],
  BODY: {
    FOV: 2,
    SPEED: 0.9,
  },
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  GUNS: [
    {
      POSITION: [22, 14, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.auto]),
        TYPE: "bullet",
      },
    },
  ],
};
exports.sentryGun = makeAuto(exports.sentry, "Sentry", {
  type: exports.megaAutoTurret,
  size: 12,
});
exports.sentryGun.UPGRADE_LABEL = "Gun Sentry";
exports.sentryTrap = makeAuto(exports.sentry, "Sentry", {
  type: exports.trapTurret,
  size: 12,
});
exports.sentryTrap.UPGRADE_LABEL = "Trap Sentry";
exports.shinySentry = {
  PARENT: ["sentry"],
  COLOR: "lightGreen",
  UPGRADE_COLOR: "lightGreen",
  DANGER: 4,
  SIZE: 12,
  VALUE: 50000,
  SHAPE: 3,
  BODY: {
    HEALTH: 0.6 * base.HEALTH,
  },
};
exports.shinySentrySwarm = {
  PARENT: ["shinySentry"],
  UPGRADE_LABEL: "Shiny Swarm Sentry",
  UPGRADE_COLOR: "lightGreen",
  GUNS: [
    {
      POSITION: [6, 11, 1.3, 7, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.swarm,
          g.morerecoil,
          g.mach,
          { reload: 0.25 },
        ]),
        TYPE: "swarm",
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};
exports.artilleryAutoTankgun = {
  PARENT: ["genericTank"],
  LABEL: "Artillery",
  BODY: {
    FOV: 2,
  },
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  COLOR: "grey",
  GUNS: [
    {
      POSITION: [17, 3, 1, 0, -6, -7, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          { reload: 0.25 },
        ]),
        TYPE: "bullet",
        LABEL: "Secondary",
      },
    },
    {
      POSITION: [17, 3, 1, 0, 6, 7, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.gunner,
          g.arty,
          { reload: 0.25 },
        ]),
        TYPE: "bullet",
        LABEL: "Secondary",
      },
    },
    {
      POSITION: [19, 12, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pound,
          g.arty,
          { reload: 0.25 },
        ]),
        TYPE: "bullet",
        LABEL: "Heavy",
      },
    },
  ],
};
exports.shinySentryGun = makeAuto(exports.shinySentry, "Sentry", {
  type: exports.artilleryAutoTankgun,
  size: 12,
});
exports.shinySentryGun.UPGRADE_LABEL = "Shiny Gun Sentry";
exports.barricadeAutoTankGun = {
  PARENT: ["genericTank"],
  LABEL: "Turret",
  BODY: {
    FOV: 0.5,
  },
  INDEPENDENT: true,
  CONTROLLERS: ["nearestDifferentMaster"],
  COLOR: "grey",
  AI: {
    SKYNET: true,
    FULL_VIEW: true,
  },
  GUNS: [
    {
      POSITION: [24, 8, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [4, 8, 1.3, 22, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.mini,
          g.halfrange,
          { reload: 0.25 },
        ]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 8, 1.3, 18, 0, 0, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.mini,
          g.halfrange,
          { reload: 0.25 },
        ]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
    {
      POSITION: [4, 8, 1.3, 14, 0, 0, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.trap,
          g.mini,
          g.halfrange,
          { reload: 0.25 },
        ]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.shinySentryTrap = makeAuto(exports.shinySentry, "Sentry", {
  type: exports.barricadeAutoTankGun,
  size: 12,
});
exports.shinySentryTrap.UPGRADE_LABEL = "Shiny Trap Sentry";

// SENTINELS (by ranar)
exports.sentinel = {
  PARENT: ["genericTank"],
  TYPE: "crasher",
  LABEL: "Sentinel",
  DANGER: 7,
  COLOR: "purple",
  SHAPE: 5,
  SIZE: 13,
  SKILL: skillSet({
    rld: 0.7, //reload
    dam: 0.45, //bullet damage
    pen: 0.6, //bullet penetration
    str: 0.6, //bullet health
    atk: 0.5, //bullet speed
    spd: 0.6, //body damage
    hlt: 0.85, //max health
    shi: 0.45, //shield capacity
    rgn: 0.35, //shield regeneration
    mob: 0, //movement speed
  }),
  VALUE: 26668,
  VARIES_IN_SIZE: true,
  CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal", "minion"],
  AI: { NO_LEAD: true },
  BODY: {
    FOV: 0.8,
    ACCEL: 0.003,
    DAMAGE: base.DAMAGE * 2.1,
    SPEED: base.SPEED * 0.4,
    HEALTH: base.HEALTH * 2.1,
    SHIELD: base.SHIELD * 2.1,
    REGEN: base.REGEN * 0.15,
  },
  MOTION_TYPE: "motor",
  FACING_TYPE: "smoothToTarget",
  HITS_OWN_TYPE: "hard",
};
exports.sentinelMissile = {
  PARENT: ["bullet"],
  LABEL: "Missile",
  INDEPENDENT: true,
  BODY: {
    RANGE: 120,
    DENSITY: 3,
  },
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */

      POSITION: [12, 10, 0, 0, 0, 180, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, g.pound, g.destroy]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
        STAT_CALCULATOR: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [14, 6, 1, 0, -2, 130, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, g.skim]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
        STAT_CALCULATOR: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [14, 6, 1, 0, 2, 230, 0],
      PROPERTIES: {
        AUTOFIRE: true,
        SHOOT_SETTINGS: combineStats([g.basic, g.skim]),
        TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
        STAT_CALCULATOR: gunCalcNames.thruster,
      },
    },
  ],
};
exports.sentinelLauncher = {
  PARENT: ["sentinel"],
  UPGRADE_LABEL: "Missile Sentinel",
  UPGRADE_COLOR: "purple",
  GUNS: [
    {
      POSITION: [3, 12.45, -1.35, 17.2, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner, g.pound, g.launcher]),
        TYPE: "sentinelMissile",
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [17.5, 13, 1.25, 0, 0, 0, 0],
    },
    {
      POSITION: [18.55, 20.25, 0.25, 1, 0, 0, 0],
    },
  ],
};
exports.sentinelCrossbow = {
  PARENT: ["sentinel"],
  UPGRADE_LABEL: "Crossbow Sentinel",
  UPGRADE_COLOR: "purple",
  GUNS: [
    {
      POSITION: [15, 2.5, 1, 0, 3.5, 35 / 2, 2 / 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.rifle,
          g.slow,
          g.crossbow,
          g.halfrecoil,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [15, 2.5, 1, 0, -3.5, -35 / 2, 2 / 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.rifle,
          g.slow,
          g.crossbow,
          g.halfrecoil,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 3.5, 1, 0, 4, 0, 1 / 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.rifle,
          g.slow,
          g.crossbow,
          g.halfrecoil,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 3.5, 1, 0, -4, 0, 1 / 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.rifle,
          g.slow,
          g.crossbow,
          g.halfrecoil,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [24, 7, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.rifle,
          g.slow,
          g.halfreload,
          g.halfrecoil,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};
exports.sentinelMinigun = {
  PARENT: ["sentinel"],
  UPGRADE_LABEL: "Minigun Sentinel",
  UPGRADE_COLOR: "purple",
  GUNS: [
    {
      POSITION: [16, 7.5, 1, 0, 4.5, 0, 0.2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.spam]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12.5, 7.5, -1.35, 0, 4.5, 0, 0.4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.spam]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 7.5, 1, 0, -4.5, 0, 0.2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.spam]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12.5, 7.5, -1.35, 0, -4.5, 0, 0.4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.spam]),
        TYPE: "bullet",
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [22.5, 9, 1, 0, 0, 0, 0.2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.spam]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20.4, 9, 1, 0, 0, 0, 0.4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.spam]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18.3, 9, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mini, g.spam]),
        TYPE: "bullet",
      },
    },
  ],
};

// MISCELLANEOUS TANKS
exports.baseSwarmTurret = {
  PARENT: ["genericTank"],
  LABEL: "Protector",
  COLOR: "grey",
  BODY: {
    FOV: 2,
  },
  CONTROLLERS: ["nearestDifferentMaster"],
  AI: {
    NO_LEAD: true,
    LIKES_SHAPES: true,
  },
  INDEPENDENT: true,
  GUNS: [
    {
      POSITION: [5, 4.5, 0.6, 7, 2, 0, 0.15],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.protectorswarm]),
        TYPE: "swarm",
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [5, 4.5, 0.6, 7, -2, 0, 0.15],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.protectorswarm]),
        TYPE: "swarm",
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
    {
      POSITION: [5, 4.5, 0.6, 7.5, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, g.protectorswarm]),
        TYPE: ["swarm", { INDEPENDENT: true, AI: { LIKES_SHAPES: true } }],
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};
exports.baseProtector = {
  PARENT: ["genericTank"],
  LABEL: "Base",
  UPGRADE_LABEL: "Base Protector",
  ON_MINIMAP: false,
  SIZE: 64,
  DAMAGE_CLASS: 0,
  ACCEPTS_SCORE: false,
  CAN_BE_ON_LEADERBOARD: false,
  IGNORED_BY_AI: true,
  HITS_OWN_TYPE: "pushOnlyTeam",
  SKILL: skillSet({
    rld: 1,
    dam: 1,
    pen: 1,
    spd: 1,
    str: 1,
  }),
  BODY: {
    SPEED: 0,
    HEALTH: 1e4,
    DAMAGE: 10,
    PENETRATION: 0.25,
    SHIELD: 1e3,
    REGEN: 100,
    FOV: 1,
    PUSHABILITY: 0,
    RESIST: 10000,
    HETERO: 0,
  },
  FACING_TYPE: ["spin", { speed: 0.02 }],
  TURRETS: [
    {
      POSITION: [25, 0, 0, 0, 360, 0],
      TYPE: "dominationBody",
    },
    {
      POSITION: [12, 7, 0, 45, 100, 0],
      TYPE: "baseSwarmTurret",
    },
    {
      POSITION: [12, 7, 0, 135, 100, 0],
      TYPE: "baseSwarmTurret",
    },
    {
      POSITION: [12, 7, 0, 225, 100, 0],
      TYPE: "baseSwarmTurret",
    },
    {
      POSITION: [12, 7, 0, 315, 100, 0],
      TYPE: "baseSwarmTurret",
    },
  ],
  GUNS: [
    {
      POSITION: [4.5, 11.5, -1.3, 6, 0, 45, 0],
    },
    {
      POSITION: [4.5, 11.5, -1.3, 6, 0, 135, 0],
    },
    {
      POSITION: [4.5, 11.5, -1.3, 6, 0, 225, 0],
    },
    {
      POSITION: [4.5, 11.5, -1.3, 6, 0, 315, 0],
    },
    {
      POSITION: [4.5, 8.5, -1.5, 7, 0, 45, 0],
    },
    {
      POSITION: [4.5, 8.5, -1.5, 7, 0, 135, 0],
    },
    {
      POSITION: [4.5, 8.5, -1.5, 7, 0, 225, 0],
    },
    {
      POSITION: [4.5, 8.5, -1.5, 7, 0, 315, 0],
    },
  ],
};

exports.mothership = {
  PARENT: ["genericTank"],
  LABEL: "Mothership",
  DANGER: 10,
  SIZE: genericTank.SIZE * (7 / 3),
  SHAPE: 16,
  STAT_NAMES: statnames.drone,
  VALUE: 5e5,
  SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
  BODY: {
    REGEN: 0,
    FOV: 1,
    SHIELD: 0,
    ACCEL: 0.2,
    SPEED: 0.3,
    HEALTH: 2000,
    PUSHABILITY: 0.15,
    DENSITY: 0.2,
    DAMAGE: 1.5,
  },
  HITS_OWN_TYPE: "pushOnlyTeam",
  GUNS: (() => {
    let e = [],
      T = [1];
    for (let e = 1; e < 8.5; e += 0.5) {
      let t = e / 16;
      T.push(t);
    }
    for (let t = 0; t < 16; t++) {
      let S = 22.5 * (t + 1),
        E = {
          MAX_CHILDREN: 2,
          SHOOT_SETTINGS: combineStats([g.drone, g.over, g.mothership]),
          TYPE: "drone",
          AUTOFIRE: true,
          SYNCS_SKILLS: true,
          STAT_CALCULATOR: gunCalcNames.drone,
          WAIT_TO_CYCLE: true,
        };
      t % 2 == 0 &&
        (E.TYPE = [
          "drone",
          {
            AI: {
              skynet: true,
            },
            INDEPENDENT: true,
            LAYER: 10,
            BODY: {
              FOV: 2,
            },
          },
        ]);
      let O = {
        POSITION: [4.3, 3.1, 1.2, 8, 0, S, T[t]],
        PROPERTIES: E,
      };
      e.push(O);
    }
    return e;
  })(),
};
exports.arenaCloser = {
  PARENT: ["genericTank"],
  LABEL: "Arena Closer",
  NAME: "Arena Closer",
  DANGER: 10,
  SIZE: 34,
  COLOR: "yellow",
  UPGRADE_COLOR: "yellow",
  LAYER: 13,
  BODY: {
    REGEN: 1e5,
    HEALTH: 1e6,
    DENSITY: 30,
    DAMAGE: 1e5,
    FOV: 10,
    SPEED: 8,
  },
  SKILL: skillSet({
    rld: 1,
    dam: 1,
    pen: 1,
    str: 1,
    spd: 1,
    atk: 1,
    hlt: 1,
    shi: 1,
    rgn: 1,
    mob: 1,
  }),
  DRAW_HEALTH: false,
  HITS_OWN_TYPE: "never",
  ARENA_CLOSER: true,
  GUNS: [
    {
      POSITION: [14, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.closer]),
        TYPE: ["bullet", { LAYER: 12 }],
      },
    },
  ],
};

exports.antiTankMachineGunArm = {
  PARENT: ["genericTank"],
  CONTROLLERS: ["mapTargetToGoal"],
  SKILL_CAP: Array(10).fill(255),
  SKILL: Array(10).fill(255),
  GUNS: [
    {
      POSITION: [14.25, 3, 1, 0, -2, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.op,
          { recoil: 0, spray: 0.1 },
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14.25, 3, 1, 0, 2, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.op,
          { recoil: 0, spray: 0.1 },
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [15.85, 3, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.op,
          { recoil: 0, spray: 0.1 },
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [5, 8.5, -1.6, 6.25, 0, 0, 0],
    },
  ],
};
exports.antiTankMachineGun = {
  PARENT: ["dominator"],
  LABEL: "Anti-Tank Machine Gun",
  UPGRADE_LABEL: "A.T.M.G.",
  CONTROLLERS: [["spin", { onlyWhenIdle: true }], "nearestDifferentMaster"],
  LEVEL: 45,
  BODY: {
    RESIST: 100,
    SPEED: 1.32,
    ACCELERATION: 0.8,
    HEALTH: 1e99,
    DAMAGE: 6,
    PENETRATION: 0.25,
    FOV: 0.35,
    PUSHABILITY: 0,
    HETERO: 0,
    SHIELD: base.SHIELD * 1.4,
  },
  SKILL_CAP: Array(10).fill(255),
  SKILL: Array(10).fill(255),
  GUNS: [
    {
      POSITION: [18, 12, 0.8, 0, 0, 90, 0],
    },
    {
      POSITION: [18, 12, 0.8, 0, 0, 270, 0],
    },
    {
      POSITION: [14.25, 3, 1, 0, -2, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.op,
          { recoil: 0, spray: 0.1 },
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14.25, 3, 1, 0, 2, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.op,
          { recoil: 0, spray: 0.1 },
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [15.85, 3, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.op,
          { recoil: 0, spray: 0.1 },
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [5, 8.5, -1.6, 6.25, 0, 0, 0],
    },
  ],
  TURRETS: [
    {
      POSITION: [20, 0, 25, 0, 180, 1],
      TYPE: ["antiTankMachineGunArm"],
    },
    {
      POSITION: [20, 0, -25, 0, 180, 1],
      TYPE: ["antiTankMachineGunArm"],
    },
    {
      POSITION: [22, 0, 0, 0, 360, 0],
      TYPE: ["dominationBody"],
    },
  ],
};

// TRACKER-3
exports.tracker3gun = {
  PARENT: ["genericTank"],
  LABEL: "",
  COLOR: "timeGem",
  BODY: {
    FOV: 3,
  },
  CONTROLLERS: [
    "canRepel",
    "onlyAcceptInArc",
    "mapAltToFire",
    "nearestDifferentMaster",
  ],
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [22, 10, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [10, 10, -2, 20, 0, 0, 0],
    },
  ],
};
exports.tracker3 = {
  PARENT: ["genericTank"],
  LABEL: "Tracker-3",
  FACING_TYPE: ["spin", { speed: 0.02 }],
  SKILL_CAP: [0, 0, 0, 0, 0, smshskl, smshskl, smshskl, smshskl, smshskl],
  TURRETS: [
    {
      /*  SIZE     X       Y     ANGLE    ARC */
      POSITION: [11, 8, 0, 0, 190, 0],
      TYPE: ["tracker3gun", { INDEPENDENT: true }],
    },
    {
      POSITION: [11, 8, 0, 120, 190, 0],
      TYPE: ["tracker3gun", { INDEPENDENT: true }],
    },
    {
      POSITION: [11, 8, 0, 240, 190, 0],
      TYPE: ["tracker3gun", { INDEPENDENT: true }],
    },
  ],
};

// BOTS
exports.bot = {
  FACING_TYPE: "looseToTarget",
  NAME: "[AI] ",
  CONTROLLERS: [
    "nearestDifferentMaster",
    "mapAltToFire",
    "minion",
    "fleeAtLowHealth",
    ["mapFireToAlt", { onlyIfHasAltFireGun: true }],
    ["wanderAroundMap", { immitatePlayerMovement: true, lookAtGoal: true }],
  ],
};

// SCORE KEEPING
exports.tagMode = {
  PARENT: ["bullet"],
  LABEL: "Players",
};
exports.lighterDeco = makeDeco(4);
exports.plateDeco = makeDeco(0);
exports.lighter = {
  PARENT: "genericTank",
  LABEL: "Lighter",
  DANGER: 7,
  COLOR: "purple",
  TOOLTIP: "suggested my you.",
  UPGRADE_COLOR: "purple",
  TURRETS: [
    {
      POSITION: [13, 0, 0, 0, 0, 1],
      TYPE: "plateDeco",
    },
    {
      POSITION: [7, 0, 0, 40, 40, 40],
      TYPE: "lighterDeco",
      COLOR: "red",
    },
  ],
  GUNS: [
    {
      POSITION: [19, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.single, g.lighter]),
        TYPE: "trianglebullet",
      },
    },
    {
      POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
    },
  ],
};
exports.bruster = {
  PARENT: ["genericTank"],
  LABEL: "Bruster",
  GUNS: [
    {
      POSITION: [30, 15, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
        TYPE: "missile",
        LABEL: "",
      },
    },
    {
      POSITION: [13, 6, 1, 0, 0, -48, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
        TYPE: "missile",
        LABEL: "",
      },
    },
    {
      POSITION: [13, 6, 1, 0, 0, 48, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
        TYPE: "missile",
        LABEL: "",
      },
    },
  ],
};
exports.apex = {
  PARENT: ["genericTank"],
  LABEL: "Apex",
  GUNS: [
    {
      POSITION: [43, 19, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "missile",
        LABEL: "",
      },
    },
    {
      POSITION: [14, 7, 1, 0, 0, -56.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "missile",
        LABEL: "",
      },
    },
    {
      POSITION: [14, 7, 1, 0, 0, 56.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "missile",
        LABEL: "",
      },
    },
    {
      POSITION: [14, 7, 1, 0, 0, 92.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "missile",
        LABEL: "",
      },
    },
    {
      POSITION: [14, 7, 1, 0, 0, -92.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "missile",
        LABEL: "",
      },
    },
  ],
};
exports.apex = {
  PARENT: [exports.bruster],
  LABEL: "Apex",
  SHAPE: 8,
  DAMAGE_EFFECTS: false,
  GUNS: [
    {
      POSITION: [50, 18, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.anni, g.destroy]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [16, 7, 1, 0, 0, -45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.anni, g.destroy]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [16, 7, 1, 0, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.anni, g.destroy]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [16, 7, 1, 0, 0, -75, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.anni, g.destroy]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [16, 7, 1, 0, 0, 75, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.anni, g.destroy]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
  ],
};

exports.fullofglourious = {
  PARENT: ["genericTank"],
  LABEL: "Full Of Glourious",
  GUNS: [
    {
      POSITION: [14, 8, 2, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.necro, g.drone]),
        TYPE: "gunchip",
      },
    },
    {
      POSITION: [14, 8, 2, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.necro, g.drone]),
        TYPE: "gunchip",
      },
    },
    {
      POSITION: [4, 6, 1, 14, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 6, 1, 14, -6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 6, 1, 14, 7, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 6, 1, 8, 7, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 6, 1, 8, -7, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 6, 1, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [21, 20, 1, 0, 0, 0, 0],
    },
  ],
};
exports.hybannihilator = {
  PARENT: ["genericTank"],
  LABEL: "HybAnnihilator",
  GUNS: [
    {
      POSITION: [22, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy, g.anni]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 12, 1.3, 0, 0, -180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "drone",
        AUTO_FIRE: true,
        MAX_CHILDREN: 6,
      },
    },
  ],
};
exports.youtuberDeco = makeDeco(3);
exports.youtuber = {
  PARENT: ["basic"],
  LABEL: "Youtuber",
  COLOR: 32,
  TURRETS: [
    {
      POSITION: [7, 0, 0, 0, 0, 1],
      TYPE: "youtuberDeco",
    },
  ],
};
exports.machineShot = {
  PARENT: "genericTank",
  LABEL: "Machine Shot",
  TOOLTIP: "Heya Content Here Um Please Dont Abuse These",
  DANGER: 7,
  BODY: {
    SPEED: 0.85 * base.SPEED,
  },
  GUNS: [
    {
      POSITION: [16, 8, 1, 0, -3, -30, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.shot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 8, 1, 0, 3, 30, 0.667],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.shot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [19, 8, 1, 0, -2, -15, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.shot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [19, 8, 1, 0, 2, 15, 0.333],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.shot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [22, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.shot]),
        TYPE: "bullet",
      },
    },
  ],
};
exports.machinetrapper = {
  PARENT: "genericTank",
  LABEL: "Machine Trapper",
  TOOLTIP: "Heya Content Here Um Please Dont Abuse These",
  GUNS: [
    {
      POSITION: [15, 7, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [3, 7, 1.7, 15, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.shot]),
        TYPE: "trap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};
exports.blockmachine = {
  PARENT: "genericTank",
  LABEL: "Block Machine",
  COLOR: 0,
  TOOLTIP: "Heya Content Here Um Please Dont Abuse These",
  GUNS: [
    {
      POSITION: [15, 7, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [3, 7, 1.7, 15, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.shot]),
        TYPE: "setTrap",
        STAT_CALCULATOR: gunCalcNames.trap,
      },
    },
  ],
};

exports.memetanks = {
  PARENT: "menu",
  LABEL: "Meme tanks",
  COLOR: 36,
  TOOLTIP: "have fun lol",
};
exports.unused = {
  PARENT: "menu",
  LABEL: "Unsued Tanks Menu",
  COLOR: 1,
  TOOLTIP: "have fun lol",
};
exports.youtuber.UPGRADES_TIER_0 = [
  "memetanks",
  "unused",
  "medoing",
  // "machineShot",
];
exports.unused.UPGRADES_TIER_0 = [
  "rapture",
  "quadtrapper",
  "blockmachine",
  "machinetrapper",
];
exports.rapture = {
  PARENT: ["genericTank"],
  LABEL: "Rapture",
  GUNS: [
    {
      POSITION: [22, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.rapture]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 13, 1.3, 0, 0, 0, 0],
    },
    {
      POSITION: [4, 17, 1, 18, 0, 0, 0],
    },
  ],
};
exports.AutoRapture = makeAuto(exports.rapture, "Auto-Rapture", {
  type: exports.AutoTurret,
  size: 12,
});
exports.AutoRapture.UPGRADE_LABEL = "Auto-Rapture";
exports.quadtrapper = {
  PARENT: ["genericTank"],
  LABEL: "Quad-Trapper",
  GUNS: [
    {
      POSITION: [17, 7, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [17, 7, 1, 0, 0, -90, 0],
    },
    {
      POSITION: [17, 7, 1, 0, 0, 90, 0],
    },
    {
      POSITION: [17, 7, 1, 0, 0, -180, 0],
    },
    {
      POSITION: [2, 8, 1.4, 16, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.basic]),
        TYPE: "trap",
      },
    },
    {
      POSITION: [2, 8, 1.4, 16, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.basic]),
        TYPE: "trap",
      },
    },
    {
      POSITION: [2, 8, 1.4, 16, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.basic]),
        TYPE: "trap",
      },
    },
    {
      POSITION: [2, 8, 1.4, 16, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.basic]),
        TYPE: "trap",
      },
    },
  ],
};
/*
exports.medoing = {
  PARENT: ["genericTank"],
  LABEL: "Me Going To Your Mom",
  BODY: {
    SPEED: 0.85 * base.SPEED,
  },
  GUNS: [
    {
      POSITION: [16, 24, 0, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shot]),
        TYPE: "bullet",
      },
    },
  ],
};
*/
exports.medoing = {
  PARENT: ["genericTank"],
  LABEL: "Me going your mom",
  GUNS: [
    {
      POSITION: [21, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shot]),
        TYPE: "bullet",
      },
    },
  ],
};
exports.basicminion = {
  PARENT: "genericTank",
  //CONTROLLERS: ["alwaysFire"],
  LABEL: "Basic",
  DANGER: 4,
  BODY: {
    ACCELERATION: base.ACCEL * 1,
    SPEED: base.SPEED * 1,
    HEALTH: base.HEALTH * 1,
    DAMAGE: base.DAMAGE * 1,
    PENETRATION: base.PENETRATION * 1,
    SHIELD: base.SHIELD * 1,
    REGEN: base.REGEN * 1,
    FOV: base.FOV * 1,
    DENSITY: base.DENSITY * 1,
    PUSHABILITY: 1,
    HETERO: 3,
  },
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basiception]),
        TYPE: "bullet",
        COLOR: "black",
        LABEL: "",
        STAT_CALCULATOR: 0,
        WAIT_TO_CYCLE: false,
        AUTOFIRE: true,
        SYNCS_SKILLS: false,
        MAX_CHILDREN: 0,
        ALT_FIRE: false,
        NEGATIVE_RECOIL: false,
      },
    },
  ],
};
exports.basiception = {
  PARENT: "genericTank",
  //CONTROLLERS: ["alwaysFire", "mapAltToFire"],
  TOOLTIP: "Tank Made By Content lol", // AE or other developer Please dont delete this lol but if you want go ahead! :D
  LABEL: "Basic-Ception",
  BODY: {
    ACCELERATION: base.ACCEL * 1,
    SPEED: base.SPEED * 1,
    HEALTH: base.HEALTH * 1,
    DAMAGE: base.DAMAGE * 1,
    PENETRATION: base.PENETRATION * 1,
    SHIELD: base.SHIELD * 1,
    REGEN: base.REGEN * 1,
    FOV: base.FOV * 1,
    DENSITY: base.DENSITY * 1,
    PUSHABILITY: 1,
    HETERO: 3,
  },
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "basicminion",
        COLOR: "grey",
        LABEL: "",
        STAT_CALCULATOR: 0,
        WAIT_TO_CYCLE: false,
        AUTOFIRE: false,
        SYNCS_SKILLS: false,
        MAX_CHILDREN: 0,
        ALT_FIRE: false,
        NEGATIVE_RECOIL: false,
      },
    },
  ],
};
exports.tripilet = {
  PARENT: ["genericTank"],
  LABEL: "Tripilet",
  TOOLTIP: "Click G To Shoot Your Gun That Pushes You!",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, -6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.norecoil]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.norecoil]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [19, 8, 1, 1, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.norecoil]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 16, 1.4, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.mach]),
        TYPE: "bullet",
        ALT_FIRE: true,
      },
    },
    {
      POSITION: [12, 8, 1.3, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.swarm]),
        TYPE: "swarm",
      },
    },
    {
      POSITION: [12, 8, 1.3, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.swarm]),
        TYPE: "swarm",
      },
    },
  ],
};

// Ceptionists
// Auto Branch Upgrades!

// Game Moderator Menu's
//exports.unreleasedtanks.UPGRADES_TIER_0 = [
//"betatester",
// "ceptioniststanks",
//"tripilet",
//];
//exports.removedtanks.UPGRADES_TIER_0 = ["betatester"];
//exports.ceptioniststanks.UPGRADES_TIER_0 = ["basiception"];
exports.testbedformods = {
  PARENT: "menu",
  COLOR: 1,
  LABEL: "Game Moderator Menu",
};

exports.balls = {
  PARENT: ["genericTank"],
  LABEL: "Ball",
  COLOR: 15,
  GUNS: [
    {
      POSITION: [1, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "trianglebullet",
        COLOR: "red",
      },
    },
  ],
};

exports.octothot = {
  PARENT: ["genericTank"],
  LABEL: "Octo Thot Destoryer!",
  COLOR: 36,
  GUNS: [
    {
      POSITION: [37, 18, 5, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.thot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [37, 18, 5, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.thot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [37, 18, 5, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.thot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [37, 18, 5, 0, 0, -180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.thot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [37, 18, 5, 0, 0, 37.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.thot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [37, 18, 5, 0, 0, -52.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.thot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [37, 18, 5, 0, 0, -150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.thot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [37, 18, 5, 0, 0, 127.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.thot]),
        TYPE: "bullet",
      },
    },
  ],
};
exports.flamethrower = {
  PARENT: ["genericTank"],
  LABEL: "Flamethrower",
  GUNS: [
    {
      POSITION: [26, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "flare",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 5, 0, 0],
    },
  ],
};
exports.twinFlamethrower = {
  PARENT: ["genericTank"],
  LABEL: "Twin Flamethrower",
  GUNS: [
    {
      POSITION: [26, 8, 1, 0, -5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "flare",
      },
    },
    {
      POSITION: [26, 8, 1, 0, 5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "flare",
      },
    },
    {
      POSITION: [28, 8, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [18, 8, 1, 0, 0, -180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.tri, g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
exports.lorry = {
  PARENT: ["genericTank"],
  LABEL: "Lorry",
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [12, 10, 2.4, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.larry]),
        TYPE: "bullet",
      },
    },
  ],
};
exports.rocketeer2 = {
  PARENT: ["genericTank"],
  LABEL: "Rocketeer",
  GUNS: [
    {
      POSITION: [18, 7, 2, 0, 0, 0, 0],
    },
    {
      POSITION: [-10, 7, 0, 18, 0, 0, 0],
    },
    {
      POSITION: [2, 14, 1, 18, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shot]),
        TYPE: "rocketeerMissile",
      },
    },
  ],
};
exports.rapturev2 = {
  PARENT: ["genericTank"],
  LABEL: "Rapture",
  //COLOR: 37,
  GUNS: [
    {
      POSITION: [21, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy, g.rapture]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 13, -1.5, 0, 0, 0, 0],
    },
    {
      POSITION: [3, 13, 1, 18, 0, 0, 0],
    },
  ],
};

exports.misclite = {
  PARENT: "menu",
  COLOR: 3,
  LABEL: "Miscellaneous Tanks (Lite)",
};

exports.trianglebullet = {
  PARENT: "bullet",
  SHAPE: 3,
};

exports.betatester = {
  PARENT: "menu",
  LABEL: "Game Beta Tester Menu",
};
exports.removedtanks = {
  PARENT: "menu",
  LABEL: "Removed Tanks Menu",
  COLOR: 9,
};
exports.unreleasedtanks = {
  PARENT: "menu",
  LABEL: "Unreleased Tanks Menu",
  COLOR: 36,
};

exports.ceptioniststanks = {
  PARENT: "menu",
  LABEL: "Ceptionists Menu",
  COLOR: 5,
};
exports.swarmist = {
  PARENT: ["miniboss"],
  LABEL: "Swarmist",
  SHAPE: 4,
  SIZE: 24,
  COLOR: 0,
  GUNS: [
    {
      POSITION: [12, 11, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 11, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 11, 1, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 11, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroy]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 5, 1, 0, 0, -45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.swarm]),
        TYPE: "autoswarm",
      },
    },
    {
      POSITION: [18, 5, 1, 0, 0, -135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.swarm]),
        TYPE: "autoswarm",
      },
    },
    {
      POSITION: [18, 5, 1, 0, 0, 135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.swarm]),
        TYPE: "autoswarm",
      },
    },
    {
      POSITION: [18, 5, 1, 0, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.swarm]),
        TYPE: "autoswarm",
      },
    },
  ],
};

exports.DiepCloser = {
  PARENT: ["genericTank"],
  LABEL: "Diep Arena Closer",
  NAME: "Arena Closer",
  ACCEPTS_SCORE: true,
  CAN_BE_ON_LEADERBOARD: false,
  DANGER: 10,
  SIZE: 34,
  COLOR: "yellow",
  LAYER: 13,
  BODY: {
    REGEN: 1e5,
    HEALTH: 1e6,
    DENSITY: 30,
    DAMAGE: 1e5,
    FOV: 10,
    SPEED: 8,
  },
  SKILL: skillSet({
    rld: 1,
    dam: 1,
    pen: 1,
    str: 1,
    spd: 1,
    atk: 1,
    hlt: 1,
    shi: 1,
    rgn: 1,
    mob: 1,
  }),
  DRAW_HEALTH: false,
  HITS_OWN_TYPE: "pushOnlyTeam",
  ARENA_CLOSER: true,
  GUNS: [
    {
      POSITION: [16, 9.3, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.closer]),
        TYPE: ["bullet", { LAYER: 12 }],
      },
    },
  ],
};
exports.shotarenaCloser = {
  PARENT: ["genericTank"],
  LABEL: "Shot Arena Closer",
  NAME: "Arena Closer",
  DANGER: 10,
  SIZE: 34,
  COLOR: "yellow",
  UPGRADE_COLOR: "rainbow",
  LAYER: 13,
  BODY: {
    REGEN: 1e5,
    HEALTH: 1e6,
    DENSITY: 30,
    DAMAGE: 1e5,
    FOV: 10,
    SPEED: 8,
  },
  SKILL: skillSet({
    rld: 1,
    dam: 1,
    pen: 1,
    str: 1,
    spd: 1,
    atk: 1,
    hlt: 1,
    shi: 1,
    rgn: 1,
    mob: 1,
  }),
  DRAW_HEALTH: true,
  HITS_OWN_TYPE: "pushOnlyTeam",
  ARENA_CLOSER: true,
  GUNS: [
    {
      POSITION: [14, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.closer, g.op, g.shot]),
        TYPE: ["bullet", { LAYER: 12 }],
      },
    },
  ],
};
exports.customsiegestuff = {
  PARENT: ["menu"],
  LABEL: "Custom Siege Entity's/Bosses",
  COLOR: 33,
};
exports.dailytank = {
  PARENT: ["genericTank"],
  LABEL: "Daily Tank      ",
};
exports.page2ofbts = {
  PARENT: ["menu"],
  LABEL: "Page 2",
};
exports.nexusmenu = {
  PARENT: ["menu"],
  LABEL: "Nexus Menu",
};
exports.betateanks = {
  PARENT: ["menu"],
  LABEL: "Beta/Unfinished Tanks",
  UPGRADE_COLOR: "rainbow",
};
exports.thegrinch = {
  PARENT: ["ramMiniboss"],
  LABEL: "The Grinch",
  NAME: "The Grinch",
  SHAPE: 0,
  COLOR: 1,
  UPGRADE_COLOR: "trans",
  SIZE: 18,
  BODY: {
    FOV: 2,
    SPEED: 2 * base.SPEED,
    HEALTH: 5 * base.HEALTH,
    DAMAGE: 5 * base.DAMAGE,
    REGEN: 8 * base.REGEN,
    FOV: 0.5 * base.FOV,
    DENSITY: 6 * base.DENSITY,
  },
  CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
  TURRETS: [
    {
      POSITION: [21.5, 0, 0, 0, 360, 0],
      TYPE: "smasherBody",
    },
    {
      POSITION: [21.5, 0, 0, 30, 360, 0],
      TYPE: "landmineBody",
    },
    {
      POSITION: [23.75, 0, 0, 0, 360, 0],
      TYPE: "spikeBody",
    },
  ],
};
exports.twinabor = {
  PARENT: ["genericTank"],
  LABEL: "Twinabor",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 6, 0, 0.2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, -6, 0, 0.4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [13, 8, -1.9, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.trap]),
        TYPE: "pillbox",
        COLOR: "yellow",
        MAX_CHILDREN: 2,
      },
    },
    {
      POSITION: [13, 8, -1.9, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.trap]),
        TYPE: "pillbox",
        COLOR: "purple",
        MAX_CHILDREN: 2,
      },
    },
    {
      POSITION: [13, 8, -1.3, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.tri]),
        TYPE: "bullet",
      },
    },
  ],
};

exports.medoingurmama = {
  PARENT: ["genericTank"],
  LABEL: "Me Doing Ur Mom",
  DANGER: 7,
  BODY: {
    SPEED: 0.8 * base.SPEED,
    FOV: 1.5 * base.FOV,
  },
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [100, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assass, g.shot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [5, 8, -1.4, 8, 0, 0, 0],
    },
  ],
};
exports.medoingall = {
  PARENT: ["genericTank"],
  LABEL: "Me going your mom (All recoil)",
  GUNS: [
    {
      POSITION: [21, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.anni, g.destroy, g.shot]),
        TYPE: "bullet",
      },
    },
  ],
};
exports.pastdaily = {
  PARENT: ["menu"],
  LABEL: "Past Daily Tanks",
};
exports.pastdaily.UPGRADES_TIER_0 = [
  "twinFlamethrower",
  "rapturev2",
  "mummifier",
  "fullofglourious",
  "auraBasic",
  "hybannihilator",
];

exports.customsiegestuff.UPGRADES_TIER_0 = [
  "antiTankMachineGun",
  "antiTankMachineGunArm",
  "swarmist",
  "arenaCloser",
  "DiepCloser",
  "healer",
  "bob",
];
exports.betateanks.UPGRADES_TIER_0 = [
  //"florr_tank",
  "mummifier",
  "maximumOverdrive",
  "auraBasic",
  "armyOfOne",
  "vanquisher",
  "godbasic",
  "ghoster",
  "medoing",
  "medoingurmama",
  "medoingall",
];
exports.testbedformods.UPGRADES_TIER_0 = [
  "basic",
  "sentries",
  "unreleasedtanks",
  "removedtanks",
  "misclite",
  "rogues",
  "elites",
  "dominators",
  "sanctuaries",
  "customsiegestuff",
  "teams",
  "betatester",
  "page2ofbts",
];
exports.page2ofbts.UPGRADES_TIER_0 = [
  "nexusmenu",
  "bosses",
  "unavailable",
  "levels",
  "betateanks",
  "pastdaily",
];
exports.nexusmenu.UPGRADES_TIER_0 = ["baseProtector"];

exports.misclite.UPGRADES_TIER_0 = [
  "balls",
  "rapture",
  "quadtrapper",
  "blockmachine",
  "machinetrapper",
  "machineShot",
  "rock",
  "gravel",
  "tripilet",
  "bullet",
  "trianglebullet",
  "octothot",
  "lighter",
  "flamethrower",
  "twinFlamethrower",
  "rocketeer2",
  "lorry",
  "rapturev2",
  "swarmist",
  ["basic", "basic", "basic"],
  ["testbedformods", "testbedformods", "testbedformods"],
  "thegrinch",
];
exports.unreleasedtanks.UPGRADES_TIER_0 = [
  "betatester",
  "ceptioniststanks",
  "tripilet",
  "eggGenerator",
];
exports.removedtanks.UPGRADES_TIER_0 = ["betatester"];

exports.ceptioniststanks.UPGRADES_TIER_0 = ["basiception"];
// bt upgrades
exports.betatester.UPGRADES_TIER_0 = [
  "removedtanks",
  "unreleasedtanks",
  "sentries",
];
