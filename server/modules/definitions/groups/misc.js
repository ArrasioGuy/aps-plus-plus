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
require("./generics.js");
require("./tanks.js");
const g = require("../gunvals.js");

// OBSTACLES
Class.rock = {
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
  COLOR: "lightGray",
  VARIES_IN_SIZE: true,
  ACCEPTS_SCORE: false,
};
Class.stone = {
  PARENT: "rock",
  LABEL: "Stone",
  SIZE: 32,
  SHAPE: -7,
};
Class.gravel = {
  PARENT: "rock",
  LABEL: "Gravel",
  SIZE: 16,
  SHAPE: -7,
};
Class.wall = {
  PARENT: "rock",
  LABEL: "Wall",
  SIZE: 25,
  SHAPE: "M 1 1 L -1 1 L -1 -1 L 1 -1 Z",
  VARIES_IN_SIZE: false,
};
Class.moon = {
  PARENT: "rock",
  LABEL: "Moon",
  SIZE: 60,
  SHAPE: 0,
};

// DOMINATORS
Class.dominator = {
  PARENT: "genericTank",
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
  CONTROLLERS: ["nearestDifferentMaster", ["spin", { onlyWhenIdle: true }]],
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
Class.destroyerDominator = {
  PARENT: "dominator",
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
Class.gunnerDominator = {
  PARENT: "dominator",
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
Class.trapperDominator = makeMulti(
  {
    PARENT: "dominator",
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
    ],
  },
  8,
  "Dominator",
);

// SANCTUARIES
let sancTiers = [3, 6, 8, 9, 10, 12];
let sancHealerTiers = [2, 3, 4];
for (let tier of sancHealerTiers) {
  Class["sanctuaryHealerTier" + (sancHealerTiers.indexOf(tier) + 1)] = {
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
              SHOOT_SETTINGS: combineStats([g.basic, g.healer]),
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

Class.sanctuary = {
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
  Class["sanctuaryTier" + (sancIndex + 1)] = {
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
                { shudder: 0.15, speed: 0.8, health: 3, reload: 1.5 },
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
  Class["sanctuaryTier" + (sancIndex + 1)].TURRETS.push(
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
Class.crasher = {
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
Class.crasherSpawner = {
  PARENT: "genericTank",
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
Class.sentry = {
  PARENT: "genericTank",
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
  CLEAR_ON_MASTER_UPGRADE: true,
};
Class.sentrySwarm = {
  PARENT: "sentry",
  UPGRADE_LABEL: "Swarm Sentry",
  UPGRADE_COLOR: "pink",
  GUNS: [
    {
      POSITION: [7, 14, 0.6, 7, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.swarm, { recoil: 1.15 }]),
        TYPE: "swarm",
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};
Class.sentryGun = makeAuto("sentry", "Sentry", {
  type: "megaAutoTankGun",
  size: 12,
});
Class.sentryGun.UPGRADE_LABEL = "Gun Sentry";
Class.sentryTrap = makeAuto("sentry", "Sentry", {
  type: "trapTurret",
  size: 12,
});
Class.sentryTrap.UPGRADE_LABEL = "Trap Sentry";
Class.shinySentry = {
  PARENT: "sentry",
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
Class.shinySentrySwarm = {
  PARENT: "shinySentry",
  UPGRADE_LABEL: "Shiny Swarm Sentry",
  UPGRADE_COLOR: "lightGreen",
  GUNS: [
    {
      POSITION: [6, 11, 1.3, 7, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.swarm,
          { recoil: 1.15 },
          g.machineGun,
          { reload: 0.25 },
        ]),
        TYPE: "swarm",
        STAT_CALCULATOR: gunCalcNames.swarm,
      },
    },
  ],
};
Class.shinySentryGun = makeAuto("shinySentry", "Sentry", {
  type: Class.artilleryAutoTankgun,
  size: 12,
});
Class.shinySentryGun.UPGRADE_LABEL = "Shiny Gun Sentry";
Class.shinySentryTrap = makeAuto("shinySentry", "Sentry", {
  type: "barricadeTurret",
  size: 12,
});
Class.shinySentryTrap.UPGRADE_LABEL = "Shiny Trap Sentry";

// SENTINELS (by ranar)
Class.sentinel = {
  PARENT: "genericTank",
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
  CLEAR_ON_MASTER_UPGRADE: true,
};
Class.sentinelLauncher = {
  PARENT: "sentinel",
  UPGRADE_LABEL: "Missile Sentinel",
  UPGRADE_COLOR: "purple",
  GUNS: [
    {
      POSITION: [3, 12.45, -1.35, 17.2, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
        TYPE: "sentinelMissile",
      },
    },
    {
      POSITION: [17.5, 13, 1.25, 0, 0, 0, 0],
    },
    {
      POSITION: [18.55, 20.25, 0.25, 1, 0, 0, 0],
    },
  ],
};
Class.sentinelCrossbow = {
  PARENT: "sentinel",
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
          { speed: 0.7, maxSpeed: 0.7 },
          g.crossbow,
          { recoil: 0.5 },
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
          { speed: 0.7, maxSpeed: 0.7 },
          g.crossbow,
          { recoil: 0.5 },
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
          { speed: 0.7, maxSpeed: 0.7 },
          g.crossbow,
          { recoil: 0.5 },
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
          { speed: 0.7, maxSpeed: 0.7 },
          g.crossbow,
          { recoil: 0.5 },
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
          { speed: 0.7, maxSpeed: 0.7, reload: 2, recoil: 0.5 },
        ]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.sentinelMinigun = {
  PARENT: "sentinel",
  UPGRADE_LABEL: "Minigun Sentinel",
  UPGRADE_COLOR: "purple",
  GUNS: [
    {
      POSITION: [16, 7.5, 1, 0, 4.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [11.5, 7.5, -1.33, 1, 4.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 7.5, 1, 0, -4.5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [11.5, 7.5, -1.33, 1, -4.5, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [22.5, 9, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20.4, 9, 1, 0, 0, 0, 1 / 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18.3, 9, 1, 0, 0, 0, 2 / 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.twin]),
        TYPE: "bullet",
      },
    },
  ],
};

// MISCELLANEOUS TANKS
Class.baseProtector = {
  PARENT: "genericTank",
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

Class.mothership = {
  PARENT: "genericTank",
  LABEL: "Mothership",
  DANGER: 10,
  SIZE: Class.genericTank.SIZE * (7 / 3),
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
          SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
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
Class.arenaCloser = {
  PARENT: "genericTank",
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
        SHOOT_SETTINGS: combineStats([g.basic, g.arenaCloser]),
        TYPE: ["bullet", { LAYER: 12 }],
      },
    },
  ],
};

Class.antiTankMachineGun = {
  PARENT: "dominator",
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
Class.tracker3 = {
  PARENT: "genericTank",
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
Class.bot = {
  FACING_TYPE: "looseToTarget",
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
Class.tagMode = {
  PARENT: "bullet",
  LABEL: "Players",
  SHAPE: "",
};
Class.lighterDeco = makeDeco(4);
Class.plateDeco = makeDeco(0);
Class.lighter = {
  PARENT: "genericTank",
  LABEL: "Lighter",
  DANGER: 7,
  COLOR: "purple",
  TOOLTIP: "suggested by Catspy On Discord!",
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
        SHOOT_SETTINGS: combineStats([g.basic, g.single, g.machineGun]),
        TYPE: "trianglebullet",
      },
    },
    {
      POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
    },
  ],
};
Class.bruster = {
  PARENT: ["genericTank"],
  LABEL: "Bruster",
  GUNS: [
    {
      POSITION: [30, 15, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer]),
        TYPE: "missile",
        LABEL: "",
      },
    },
    {
      POSITION: [13, 6, 1, 0, 0, -48, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer]),
        TYPE: "missile",
        LABEL: "",
      },
    },
    {
      POSITION: [13, 6, 1, 0, 0, 48, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer]),
        TYPE: "missile",
        LABEL: "",
      },
    },
  ],
};
Class.apex = {
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
Class.apex = {
  PARENT: [Class.bruster],
  LABEL: "Apex",
  SHAPE: 8,
  DAMAGE_EFFECTS: false,
  GUNS: [
    {
      POSITION: [50, 18, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.annihilator, g.destroyer]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [16, 7, 1, 0, 0, -45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.annihilator, g.destroyer]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [16, 7, 1, 0, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.annihilator, g.destroyer]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [16, 7, 1, 0, 0, -75, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.annihilator, g.destroyer]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [16, 7, 1, 0, 0, 75, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.annihilator, g.destroyer]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
  ],
};

Class.fullofglourious = {
  PARENT: ["genericTank"],
  LABEL: "Full Of Glourious",
  GUNS: [
    {
      POSITION: [14, 8, 2, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone]),
        TYPE: "sunchip",
      },
    },
    {
      POSITION: [14, 8, 2, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone]),
        TYPE: "sunchip",
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
Class.hybannihilator = {
  PARENT: ["genericTank"],
  LABEL: "HybAnnihilator",
  GUNS: [
    {
      POSITION: [22, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer, g.annihilator]),
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
Class.youtuberDeco = makeDeco(3);
Class.youtuber = {
  PARENT: ["basic"],
  LABEL: "Youtuber",
  COLOR: 32,
  TURRETS: [
    {
      POSITION: [7, 0, 0, 0, 360, 1],
      TYPE: "youtuberDeco",
      COLOR: "white",
      INDEPENDENT: true,
    },
  ],
};
Class.machineShot = {
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
Class.machinetrapper = {
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
Class.blockmachine = {
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

Class.memetanks = {
  PARENT: "menu",
  LABEL: "Meme tanks",
  COLOR: 36,
  TOOLTIP: "have fun lol",
};
Class.unused = {
  PARENT: "menu",
  LABEL: "Unsued Tanks Menu",
  COLOR: 1,
  TOOLTIP: "have fun lol",
};
Class.youtuber.UPGRADES_TIER_0 = [
  "memetanks",
  "unused",
  "medoing",
  // "machineShot",
];
Class.unused.UPGRADES_TIER_0 = [
  "rapture",
  "quadtrapper",
  "blockmachine",
  "machinetrapper",
];
Class.rapture = {
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
Class.AutoRapture = makeAuto(Class.rapture, "Auto-Rapture", {
  type: Class.AutoTurret,
  size: 12,
});
Class.AutoRapture.UPGRADE_LABEL = "Auto-Rapture";
Class.quadtrapper = {
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
Class.medoing = {
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
Class.medoing = {
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
Class.basicminion = {
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
        SHOOT_SETTINGS: combineStats([g.basic]),
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
Class.basiception = {
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
Class.tripilet = {
  PARENT: ["genericTank"],
  LABEL: "Tripilet",
  TOOLTIP: "Click G To Shoot Your Gun That Pushes You!",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, -6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [19, 8, 1, 1, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 16, 1.4, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
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
//Class.unreleasedtanks.UPGRADES_TIER_0 = [
//"betatester",
// "ceptioniststanks",
//"tripilet",
//];
//Class.removedtanks.UPGRADES_TIER_0 = ["betatester"];
//Class.ceptioniststanks.UPGRADES_TIER_0 = ["basiception"];
Class.testbedformods = {
  PARENT: "menu",
  COLOR: 1,
  STROKE_WIDTH: 0.5,
  LABEL: "Game Moderator Menu",
};

Class.balls = {
  PARENT: ["genericTank"],
  LABEL: "Ball",
  COLOR: 15,
  GUNS: [
    {
      POSITION: [1, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.fastermachineshot]),
        TYPE: "aimbotbullet",
        COLOR: "red",
        MAX_CHILDREN: 100,
      },
    },
  ],
};
Class.lorry = {
  PARENT: ["genericTank"],
  LABEL: "Lorry",
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [12, 10, 2.4, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shot]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.rocketeer2 = {
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
Class.rapturev2 = {
  PARENT: ["genericTank"],
  LABEL: "Rapture",
  //COLOR: 37,
  GUNS: [
    {
      POSITION: [21, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer, g.rapture]),
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

Class.misclite = {
  PARENT: "menu",
  LABEL: "Miscellaneous Tanks",
};

Class.trianglebullet = {
  PARENT: "bullet",
  SHAPE: 3,
};

Class.betatester = {
  PARENT: "menu",
  LABEL: "Game Beta Tester Menu",
};
Class.removedtanks = {
  PARENT: "menu",
  LABEL: "Removed Tanks Menu",
};
Class.unreleasedtanks = {
  PARENT: "menu",
  LABEL: "Unreleased Tanks Menu",
};

Class.ceptioniststanks = {
  PARENT: "menu",
  LABEL: "Ceptionists Menu",
};
Class.swarmist = {
  PARENT: ["miniboss"],
  LABEL: "Swarmist",
  SHAPE: 4,
  SIZE: 24,
  COLOR: 0,
  GUNS: [
    {
      POSITION: [12, 11, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 11, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 11, 1, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 11, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer]),
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

Class.DiepCloser = {
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
        SHOOT_SETTINGS: combineStats([g.basic, g.arenaCloser]),
        TYPE: ["bullet", { LAYER: 12 }],
      },
    },
  ],
};
Class.shotarenaCloser = {
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
        SHOOT_SETTINGS: combineStats([g.basic, g.arenaCloser, g.op, g.shot]),
        TYPE: ["bullet", { LAYER: 12 }],
      },
    },
  ],
};
Class.customsiegestuff = {
  PARENT: ["menu"],
  LABEL: "Custom Siege Entity's/Bosses",
  COLOR: 33,
};
Class.page2ofbts = {
  PARENT: ["menu"],
  LABEL: "Page 2",
};
Class.page3ofbts = {
  PARENT: ["menu"],
  LABEL: "Page 3",
};
Class.OPTanks = {
  PARENT: ["menu"],
  LABEL: "OP Tanks",
};
Class.nexusmenu = {
  PARENT: ["menu"],
  LABEL: "Nexus Menu",
};
Class.betateanks = {
  PARENT: ["menu"],
  LABEL: "Beta/Unfinished Tanks",
  UPGRADE_COLOR: "rainbow",
};
Class.thegrinch = {
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
Class.twinabor = {
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
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.medoingurmama = {
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
      POSITION: [250, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.shot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [5, 8, -1.4, 8, 0, 0, 0],
    },
  ],
};
Class.medoingall = {
  PARENT: ["genericTank"],
  LABEL: "Me going your mom (All recoil)",
  GUNS: [
    {
      POSITION: [21, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.annihilator,
          g.destroyer,
          g.shot,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.spikeanni = {
  PARENT: ["genericTank"],
  LABEL: "Spike Annihilator",
  UPGRADE_TOOLTIP:
    "This Tank Is Still In Works! Please Wait Patiently For It To Come Out!",
  TURRETS: [
    {
      POSITION: [18.5, 0, 0, 0, 360, 0],
      TYPE: "spikeBody",
    },
    {
      POSITION: [18.5, 0, 0, 90, 360, 0],
      TYPE: "spikeBody",
    },
    {
      POSITION: [18.5, 0, 0, 180, 360, 0],
      TYPE: "spikeBody",
    },
    {
      POSITION: [18.5, 0, 0, 270, 360, 0],
      TYPE: "spikeBody",
    },
  ],
  GUNS: [
    {
      POSITION: [22, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.destroyer,
          g.annihilator,
          g.spikecatapulte,
        ]),
        TYPE: "bulletspike",
      },
    },
  ],
};
Class.bulletspike = {
  PARENT: "bullet",
  LABEL: "Spike",
  //CONTROLLERS: "mapTargetToGoal",
  BODY: {
    SPEED: base.SPEED * 0.9,
    DAMAGE: base.DAMAGE * 1.1,
  },
  TURRETS: [
    {
      POSITION: [18.5, 0, 0, 0, 360, 0],
      TYPE: "spikeBody",
    },
    {
      POSITION: [18.5, 0, 0, 90, 360, 0],
      TYPE: "spikeBody",
    },
    {
      POSITION: [18.5, 0, 0, 180, 360, 0],
      TYPE: "spikeBody",
    },
    {
      POSITION: [18.5, 0, 0, 270, 360, 0],
      TYPE: "spikeBody",
    },
  ],
};
Class.pastdaily = {
  PARENT: ["menu"],
  LABEL: "Past Daily Tanks",
};
Class.spectator2 = {
  PARENT: "genericTank",
  LABEL: "Spectator",
  ANGLE: 60,
  CONTROLLERS: ["whirlwind"],
  HAS_NO_RECOIL: true,
  LAYER: 600,
  COLOR: 36,
  ARENA_CLOSER: true,
  UPGRADE_COLOR: "rainbow",
  STAT_NAMES: statnames.whirlwind,
  AI: {
    SPEED: 5,
  },
  GUNS: (() => {
    let output = [];
    for (let i = 0; i < 6; i++) {
      output.push({
        POSITION: { WIDTH: 8, LENGTH: 1, DELAY: i * 0.25 },
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.satelliteop]),
          TYPE: ["satellite", { ANGLE: i * 60 }],
          COLOR: 36,
          SHAPE: 6,
          MAX_CHILDREN: 1,
          AUTOFIRE: true,
          LAYER: 600,
          SYNCS_SKILLS: false,
          WAIT_TO_CYCLE: true,
        },
      });
    }
    return output;
  })(),
};
Class.destroytor = {
  PARENT: ["genericTank"],
  LABEL: "Destroytor",
  DAMAGE_EFFECTS: true,
  GUNS: [
    {
      POSITION: [21, 17, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [17, 12, -1.5, 0, 0, 0, 0],
    },
    {
      POSITION: [2, 12, 1, 17, 0, 0, 0],
    },
    {
      POSITION: [0, 0, 1, 0, 0, -83.5, 0],
    },
  ],
};
Class.flankest = {
  PARENT: ["genericTank"],
  LABEL: "Flankest",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, -142.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.betatanksforfirend = {
  PARENT: ["menu"],
  LABEL: "Beta Tanks",
  //LEVEL: 60,
  COLOR: 36,
};

Class.arrasdev = {
  PARENT: ["menu"],
  LABEL: "Arras Dev Menu",
  COLOR: 36,
};
Class.battleshit = {
  PARENT: ["genericTank"],
  LABEL: "Battleshit",
  GUNS: [
    {
      POSITION: [14, 7, -1.3, 0, -5, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shot, g.swarm]),
        TYPE: "swarm",
      },
    },
    {
      POSITION: [14, 7, -1.3, 0, 5, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shot, g.swarm]),
        TYPE: "swarm",
      },
    },
    {
      POSITION: [14, 7, -1.3, 0, 5, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shot, g.swarm]),
        TYPE: "swarm",
      },
    },
    {
      POSITION: [14, 7, -1.3, 0, -5, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shot, g.swarm]),
        TYPE: "swarm",
      },
    },
  ],
};
Class.ninja = {
  PARENT: ["genericTank"],
  LABEL: "Ninja",
  UPGRADE_TOOLTIP: "Daily Tank!",
  UPGRADE_COLOR: "rainbow",
  GUNS: [
    {
      POSITION: [29, 8, 1, 0, 0, -41, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [29, 8, 1, 0, 0, 45.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [21, 8, 1, 0, 0, 0.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.tier1 = {
  PARENT: ["genericTank"],
  LABEL: "Tier 1",
  SHAPE: -4,
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 1, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, -88, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 179, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 90.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
  ],
};
Class.tier2 = {
  PARENT: ["genericTank"],
  LABEL: "Tier 2",
  SHAPE: -5,
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 1, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, -88, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 179, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 90.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
    {
      POSITION: [18, 8, 1, 26, 0, 1, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "boomerang",
      },
    },
  ],
};
Class.tier3 = {
  PARENT: ["genericTank"],
  LABEL: "Tier 3",
  SHAPE: -3,
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 179, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
    {
      POSITION: [18, 8, 1, 26, 0, 1, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "boomerang",
      },
    },
    {
      POSITION: [18, 8, 1, 26, 0, 179, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "missile",
      },
    },
  ],
};
Class.overdestroy = {
  PARENT: ["genericTank"],
  LABEL: "OverDestroy",
  GUNS: [
    {
      POSITION: [23, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer, g.annihilator]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 12, -1.3, 0, 0, 0, 0],
    },
    {
      POSITION: [1, 12, 1, 20, 0, 0, 0],
    },
  ],
};

Class.twintrap = {
  PARENT: ["genericTank"],
  LABEL: "Twin-Trap",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, -6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [21, 8, 1, 0, 0, -180, 0],
    },
    {
      POSITION: [3, 8, 1.5, 20, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.trap]),
        TYPE: "trap",
      },
    },
  ],
};
Class.hewnTwin = {
  PARENT: "genericTank",
  LABEL: "Hewn Twin",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, -6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [15, 4, 1, 0, 8, 30, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [15, 4, 1, 0, -8, -30, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [17, 4, 1, 0, -8, -60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [17, 4, 1, 0, 8, 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.nailer = {
  PARENT: "genericTank",
  LABEL: "Nailer",
  GUNS: [
    {
      POSITION: [9, 3, 1, 14, 3, 0, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.nailgun, g.nailer]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [9, 3, 1, 14, -3, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.nailgun, g.nailer]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [11, 3, 1, 14, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.nailgun, g.nailer]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [13, 11, -1.5, 0, 0, 0, 0],
    },
  ],
};

Class.joker = {
  PARENT: "genericTank",
  LABEL: "Joker",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, -142.5, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 180, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 142.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [25, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [21, 8, 1, 0, 0, 0, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [17, 8, 1, 0, 0, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 8, 1, 0, 0, -37.5, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 8, 1, 0, 0, 37.5, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [17, 8, 1, 0, 0, 37.5, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [17, 8, 1, 0, 0, -37.5, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
  ],
};

Class.Hurricane = {
  PARENT: "genericTank",
  LABEL: "Cyclone",
  GUNS: [
    {
      POSITION: [16, 5, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.hurricane]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, -30, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.hurricane]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, -60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.hurricane]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.hurricane]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, -120, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.hurricane]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, -150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.hurricane]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, -180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.hurricane]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, 150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.hurricane]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, 120, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.hurricane]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, 82.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.hurricane]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, 52.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 5, 1, 0, 0, 22.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.biggerCheese = {
  PARENT: "genericTank",
  LABEL: "Bigger cheese",
  STAT_NAMES: statnames.drone,
  MAX_CHILDREN: 1,
  GUNS: [
    {
      POSITION: [21, 16, 2, -3, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.biggerdrone, g.drone]),
        TYPE: "drone",
        AUTO_FIRE: true,
      },
    },
  ],
};
Class.overcheese = {
  PARENT: "genericTank",
  LABEL: "Over Cheese",
  MAX_CHILDREN: 2,
  STAT_NAMES: statnames.drone,
  GUNS: [
    {
      POSITION: [17, 16, 1.4, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.bigdrone]),
        TYPE: "drone",
        AUTO_FIRE: true,
      },
    },
    {
      POSITION: [17, 16, 1.4, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.bigdrone]),
        TYPE: "drone",
        AUTO_FIRE: true,
      },
    },
  ],
};

Class.bigmac = {
  PARENT: "genericTank",
  LABEL: "Big Mac",
  GUNS: [
    {
      POSITION: [16, 9, 3, -9, 0, 0.5, 0],
    },
    {
      POSITION: [16, 28, 1, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.annihilator,
          g.destroyer,
          g.bigmac,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.lightningRammer = {
  PARENT: "genericTank",
  LABEL: "Lightning Rammer",
  TURRETS: [
    {
      POSITION: [21.5, 0, 0, 0, 360, 0],
      TYPE: "smasherBody",
    },
  ],
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, -146, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 13, 1, 0, 0, -179.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.Rammer = {
  PARENT: "genericSmasher",
  LABEL: "Rammer",
  TURRETS: [
    {
      POSITION: [21.5, 0, 0, 0, 360, 0],
      TYPE: "smasherBody",
    },
    {
      POSITION: [21.5, 0, 0, 0, 333, 0],
      TYPE: "smasherBody",
    },
  ],
  GUNS: [
    {
      POSITION: [18, 16, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.annihilator, g.tonsmorrecoil]),
        TYPE: "bulletspike",
      },
    },
  ],
};
Class.drifter = {
  PARENT: "genericSmasher",
  LABEL: "Drifter",
  SIZE: 10,
  DANGER: 6,
  TURRETS: [
    {
      POSITION: [21.5, 0, 0, 0, 360, 0],
      TYPE: "spikeBody",
    },
  ],
};
Class.assemblerbutbig = {
  PARENT: "genericTank",
  LABEL: "Assembler",
  GUNS: [
    {
      POSITION: [19, 20, 1.3, 0, 0, 0, 0],
    },
    {
      POSITION: [1, 26, 1.1, 19, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.block, g.construct]),
        TYPE: "setTrap",
      },
    },
  ],
};
Class.vulstreamliner = {
  PARENT: "genericTank",
  LABEL: "Vul-Streamliner",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, -142.5, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 180, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 142.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [24, 8, 1.1, 0, 0, 0, 6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [22, 8, 1.1, 0, 0, 0, 5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 8, 1.1, 0, 0, 0, 4],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1.1, 0, 0, 0, 3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 8, 1.1, 0, 0, 0, 2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 8, 1.1, 0, 0, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 8, 1.1, 0, 0, 0, 0.5],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.snipy = {
  PARENT: "genericTank",
  LABEL: "Snipy",
  GUNS: [
    {
      POSITION: [12, 10, -1.7, 0, 0, 0, 0],
    },
    {
      POSITION: [15, 6, 1, 13, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [4, 0.5, -10, 23, 0, 0, 0],
    },
    {
      POSITION: [4, 0.5, -10, 14, 0, 0, 0],
    },
  ],
};
Class.triflank = {
  PARENT: "genericTank",
  LABEL: "Tri-Flank",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, -150, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 8, 1, 0, 0, -180, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.bonfire = {
  PARENT: "genericTank",
  LABEL: "Bonfire",
  GUNS: [
    {
      POSITION: [25, 6, 1, 0, -5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "flare",
      },
    },
    {
      POSITION: [18, 5, 1, 0, 1, 0, 0],
    },
  ],
};
Class.fires = {
  PARENT: "genericTank",
  LABEL: "Fire",
  GUNS: [
    {
      POSITION: [22, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 12, 1, 0, 0, 0, 0],
    },
  ],
};
Class.berker = {
  PARENT: "genericTank",
  LABEL: "Berker",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, -150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [15, 5, 1, 0, 0, 150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [15, 5, 1, 0, 0, -150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngle]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [22, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.triAngleFront]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [10, 1.1, 10, -21, 0, -180, 0],
    },
  ],
};
Class.baba = {
  PARENT: "genericTank",
  LABEL: "Baba",
  GUNS: [
    {
      POSITION: [25, 8, 1, 0, 0, 0, 1.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.streamliner, g.minigun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [23, 8, 1, 0, 0, 0, 1.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.streamliner, g.minigun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [21, 8, 1, 0, 0, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.streamliner, g.minigun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [19, 8, 1, 0, 0, 0, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.streamliner, g.minigun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [17, 8, 1, 0, 0, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.streamliner, g.minigun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [15, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.streamliner, g.minigun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [17, 8, 1, 0, 0, 180, 0],
    },
    {
      POSITION: [3, 7, 2, 17, 0, -180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: "trap",
      },
    },
  ],
};
Class.captain = {
  PARENT: "genericTank",
  LABEL: "Captain",
  MAX_CHILDREN: 8,
  GUNS: [
    {
      POSITION: [15, 6, 2, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone, g.big]),
        TYPE: "drone",
      },
    },
    {
      POSITION: [15, 6, 2, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone, g.big]),
        TYPE: "drone",
      },
    },
    {
      POSITION: [15, 6, 2, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone, g.big]),
        TYPE: "drone",
      },
    },
    {
      POSITION: [15, 6, 2, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone, g.big]),
        TYPE: "drone",
      },
    },
    {
      POSITION: [15, 6, 2, 0, 0, -135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone, g.big]),
        TYPE: "drone",
      },
    },
    {
      POSITION: [15, 6, 2, 0, 0, -45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone, g.big]),
        TYPE: "drone",
      },
    },
    {
      POSITION: [15, 6, 2, 0, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone, g.big]),
        TYPE: "drone",
      },
    },
    {
      POSITION: [15, 6, 2, 0, 0, 135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone, g.big]),
        TYPE: "drone",
      },
    },
  ],
};

Class.jerker = {
  PARENT: "genericTank",
  LABEL: "Jerker",
  GUNS: [
    {
      POSITION: [22, 15, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 8, 1, 0, 0, -45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 8, 1, 0, 0, 37.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.destroyer]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.boxer = {
  PARENT: "bullet",
  LABEL: "Boxer",
  SIZE: 7,
  //CONTROLLERS: "mapTargetToGoal",
  BODY: {
    SPEED: base.SPEED * 1.22,
    DAMAGE: base.DAMAGE * 1.1,
  },
  TURRETS: [
    {
      POSITION: [18.5, 0, 0, 0, 360, 0],
      TYPE: "spikeBody",
    },
    {
      POSITION: [18.5, 0, 0, 90, 360, 0],
      TYPE: "spikeBody",
    },
    {
      POSITION: [18.5, 0, 0, 180, 360, 0],
      TYPE: "spikeBody",
    },
    {
      POSITION: [18.5, 0, 0, 270, 360, 0],
      TYPE: "spikeBody",
    },
  ],
};
Class.machineliner = {
  PARENT: "genericTank",
  LABEL: "Machine-Liner",
  GUNS: [
    {
      POSITION: [28, 8, 2, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.streamliner, g.machineGun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [24, 8, 2, 0, 0, 0, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.streamliner, g.machineGun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 8, 2, 0, 0, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.streamliner, g.machineGun]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.mystic = {
  PARENT: "genericTank",
  LABEL: "Mystic",
  MAX_CHILDREN: 18,
  BODY: {
    SPEED: base.SPEED * 1.2,
  },
  GUNS: [
    {
      POSITION: [14, 14, 1.3, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "sunchip",
      },
    },
    {
      POSITION: [14, 14, 1.3, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "sunchip",
      },
    },
    {
      POSITION: [14, 14, 1.3, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "sunchip",
      },
    },
  ],
};
Class.twinmachine = {
  PARENT: "genericTank",
  LABEL: "Twin Machine",
  GUNS: [
    {
      POSITION: [19, 6, 1.5, 0, 5, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [19, 6, 1.5, 0, -6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.tripletmachine = {
  PARENT: "genericTank",
  LABEL: "Triplet Machine",
  GUNS: [
    {
      POSITION: [18, 7, 1.45, 0, 6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 7, 1.45, 0, -6, 0, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 7, 1.45, 0, 0, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.flankMachine = {
  PARENT: "genericTank",
  LABEL: "Flank Machine",
  GUNS: [
    {
      POSITION: [20, 8, 1.7, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 8, 1.7, 0, 0, 112.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 8, 1.7, 0, 0, -120, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.prelatorMachine = {
  PARENT: ["genericTank"],
  LABEL: "Prelator Machine",
  GUNS: [
    {
      POSITION: [18, 8, 2, 0, 0, 1, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.hunter]),
        TYPE: "hypermissile",
      },
    },
    {
      POSITION: [18, 11, 2, -4, 0, 0.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.hunter]),
        TYPE: "hypermissile",
      },
    },
    {
      POSITION: [18, 11, 1.8, -8, 0, 1, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.minigun]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.metalmach = {
  PARENT: ["genericTank"],
  LABEL: "Metal Machine",
  COLOR: "yellow",
  UPGRADE_COLOR: "yellow",
  CONTROLLERS: ["nearestDifferentMaster", "canRepel"],
  HITS_OWN_TYPE: "hardOnlyBosses",
  SKILL: skillSet({
    rld: 1,
    dam: 0.5,
    pen: 0.9,
    str: 0.9,
    spd: 0.4,
    atk: 0.4,
    hlt: 1,
    shi: 0.7,
    rgn: 0.7,
    mob: 0.9,
  }),
  SIZE: 35,
  LEVEL: 55,
  BROADCAST_MESSAGE: "A Metal Machine Died! Rip... :(",
  SHAPE: 4,
  GUNS: [
    {
      POSITION: [13, 13, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.block]),
        TYPE: "pillbox",
        MAX_CHILDREN: 3,
      },
    },
    {
      POSITION: [6, 9, -1.5, 13, 0, 180, 0],
    },
    {
      POSITION: [12, 7.5, 1, 0, -3, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 7.5, 1, 0, 3, 0, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [11, 8, -1.3, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.factory, g.drone]),
        TYPE: "minion",
        AUTO_FIRE: true,
        MAX_CHILDREN: 2,
      },
    },
    {
      POSITION: [11, 8, -1.3, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.factory, g.drone]),
        TYPE: "minion",
        AUTO_FIRE: true,
        MAX_CHILDREN: 2,
      },
    },
  ],
};
Class.spiniBoi = {
  PARENT: "genericTank",
  LABEL: "Spini boi",
  COLOR: 0,
  SHAPE: 7,
  GUNS: [
    {
      POSITION: [12, 9, 1, 0, 0, -22.5, 2],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 9, 1, 0, 0, 22.5, 1.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 9, 1, 0, 0, 75, 1.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 9, 1, 0, 0, 127.5, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 9, 1, 0, 0, -180, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 9, 1, 0, 0, -75, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [12, 9, 1, 0, 0, -127.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.eventdeveloper = {
  PARENT: ["menu"],
  LABEL: "Event Developer",
  RESET_CHILDREN: true,
  ACCEPTS_SCORE: true,
  LEVEL: 45,
  CAN_BE_ON_LEADERBOARD: true,
  DRAW_HEALTH: true,
  ARENA_CLOSER: false,
  INVISIBLE: [0, 0],
  ALPHA: [0, 1],
  HITS_OWN_TYPE: "hardOnlyTanks",
  SHAPE: [
    [-1, -0.8],
    [-0.8, -1],
    [0.8, -1],
    [1, -0.8],
    [0.2, 0],
    [1, 0.8],
    [0.8, 1],
    [-0.8, 1],
    [-1, 0.8],
  ],
  GUNS: [
    {
      /*** LENGTH WIDTH     ASPECT        X             Y         ANGLE     DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "developerBullet",
      },
    },
  ],
};
Class.eventdev2misc = {
  PARENT: ["eventdeveloper"],
  LABEL: "Miscellaneous (Lite) Event!",
  UPGRADE_TOOLTIP: "op upgrades removed laughing lol",
};
Class.eventdev3betatank = {
  PARENT: ["eventdeveloper"],
  LABEL: "Beta Tanks (Event)",
  UPGRADE_TOOLTIP: "op upgrades removed laughing lol",
};
Class.eventdev4page2bts = {
  PARENT: ["eventdeveloper"],
  LABEL: "Page 2",
  UPGRADE_TOOLTIP: "op upgrades removed laughing lol",
};
Class.todaysdailytank = {
  PARENT: ["menu"],
  LABEL: "Today's Daily Tank",
  UPGRADE_COLOR: "rainbow",
};
Class.boat = {
  PARENT: ["genericTank"],
  LABEL: "Boat",
  GUNS: [
    {
      POSITION: [18, 8, -2, 0, 0, -178.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bee",
      },
    },
    {
      POSITION: [18, 8, -2, 0, 0, 1, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bee",
      },
    },
    {
      POSITION: [18, 8, -2, 0, 0, 90.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bee",
      },
    },
    {
      POSITION: [18, 8, -2, 0, 0, -89.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bee",
      },
    },
  ],
};
Class.oldtank = {
  PARENT: ["menu"],
  LABEL: "Old Tanks",
  COLOR: 32,
};
Class.newbranch = {
  PARENT: ["genericTank"],
  LABEL: "Dir-Basic",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 5,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [10, 6, 0, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
Class.newbranch2 = {
  PARENT: ["genericTank"],
  LABEL: "Over-Basic",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 10,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [10, 6, 0, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
Class.newbranch3 = {
  PARENT: ["genericTank"],
  LABEL: "Over-Basic",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 12,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [10, 6, 0, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: Class.bullet,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
Class.trappers = {
  PARENT: ["genericTank"],
  LABEL: "Dir-Trapper",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 8,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [10, 6, 0, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "trap",
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
Class.trapper2 = {
  PARENT: ["genericTank"],
  LABEL: "Over-Trapper",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 13,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [10, 6, 0, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "trap",
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
Class.trapper3 = {
  PARENT: ["genericTank"],
  LABEL: "Over-Trapper",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 15,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [10, 6, 0, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "trap",
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
Class.enginner1 = {
  PARENT: ["genericTank"],
  LABEL: "EnginDirector",
  DANGER: 6,
  STAT_NAMES: statnames.drone,
  BODY: {
    ACCELERATION: base.ACCEL * 0.75,
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.1,
  },
  MAX_CHILDREN: 8,
  GUNS: [
    {
      /*** LENGTH  WIDTH   ASPECT    X       Y     ANGLE   DELAY */
      POSITION: [6, 12, 1.2, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
        TYPE: "drone",
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
        WAIT_TO_CYCLE: true,
      },
    },
    {
      POSITION: [10, 10, 0, 8, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "pillbox",
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: gunCalcNames.drone,
      },
    },
  ],
};
Class.Hunter2 = {
  PARENT: "genericTank",
  LABEL: "Hunter",
  GUNS: [
    {
      POSITION: [4, 4, 1, 23, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 4, 1, 23, 1, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 4, 1, 22, -1, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 4, 1, 21, 1, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 4, 1, 23, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 4, 1, 22, 2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 4, 1, 22, -2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 4, 1, 20, -2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [4, 4, 1, 20, 2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [19, 13, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [27, 10, 1, 0, 0, 0, 0],
    },
  ],
};
Class.miniArenaCloser = {
  PARENT: "genericTank",
  LABEL: "Mini Arena Closer",
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
      POSITION: [14, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.op]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.streamhiver = {
  PARENT: ["genericTank"],
  LABEL: "StreamHiver",
  DAMAGE_CLASS: 5,
  GUNS: [
    {
      POSITION: [27, 8, -2, 0, 0, 0.5, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bee",
      },
    },
    {
      POSITION: [23, 8, -2, 0, 0, -0.5, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bee",
      },
    },
    {
      POSITION: [19, 8, -2, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bee",
      },
    },
  ],
};
Class.redistibutor = {
  PARENT: "genericTank",
  LABEL: "Redistibutor",
  GUNS: [
    {
      POSITION: [15, 17, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [5, 13, -1.4, 14, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.rapture, g.redistibutor]),
        TYPE: "bulletspike",
      },
    },
    {
      POSITION: [20, 3, 1, 0, 0, 30, 0],
    },
    {
      POSITION: [20, 3, 1, 0, 0, -30, 0],
    },
    {
      POSITION: [5, 3, 1, 11, 0, -15, 0],
    },
    {
      POSITION: [5, 3, 1, 11, 0, 15, 0],
    },
    {
      POSITION: [5, 4, 1, 11, 0, 0, 0],
    },
  ],
};
Class.redistibutorop = {
  PARENT: "genericTank",
  LABEL: "OP Redistibutor",
  GUNS: [
    {
      POSITION: [15, 17, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [5, 13, -1.4, 14, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.rapture,
          g.redistibutor,
          g.shot,
          g.fastermachineshot,
        ]),
        TYPE: "bulletspike",
      },
    },
    {
      POSITION: [20, 3, 1, 0, 0, 30, 0],
    },
    {
      POSITION: [20, 3, 1, 0, 0, -30, 0],
    },
    {
      POSITION: [5, 3, 1, 11, 0, -15, 0],
    },
    {
      POSITION: [5, 3, 1, 11, 0, 15, 0],
    },
    {
      POSITION: [5, 4, 1, 11, 0, 0, 0],
    },
  ],
};
Class.subscriber = {
  PARENT: "genericTank",
  LABEL: "Subscriber",
  SKILL_CAP: Array(10).fill(9),
  COLOR: 32,
  TURRETS: [
    {
      POSITION: [7, 0, 0, 0, 0, 1],
      TYPE: "subscriberSymbol",
      INDEPENDENT: true,
    },
  ],
  GUNS: [
    {
      /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "whitebullet",
      },
    },
  ],
};
Class.whitebullet = {
  PARENT: "bullet",
  COLOR: "white",
  LABEL: "Bullet",
};
Class.maperHeight = {
  PARENT: ["genericTank"],
  LABEL: "Map Height Change",
  COMMAND_TYPE: "maperHeight",
  RESET_UPGRADES: true,
};
Class.maperWide = {
  PARENT: ["genericTank"],
  LABEL: "Map Width Settings",
  COMMAND_TYPE: "maperWide",
  RESET_UPGRADES: true,
};
Class.subscriberSymbol = {
  PARENT: ["genericTank"],
  INDEPENDENT: true,
  COLOR: "white",
  SHAPE: 3,
};

Class.maxstatstank = {
  PARENT: "menu",
  LABEL: "255 Stat Tanks",
  UPGRADE_TOOLTIP: "255 Max Stat Tanks What Else?",
  UPGRADE_COLOR: "white",
};
Class.mechsingleturret = {
  PARENT: "genericTank",
  LABEL: "Turret",
  DANGER: 7,
  GUNS: [
    {
      POSITION: [19, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.single]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
    },
  ],
};
Class.mechsingle = {
  PARENT: "genericTank",
  LABEL: "Triple-Single",
  TURRETS: [
    {
      POSITION: [20, 0, 25, 0, 180, 1],
      TYPE: ["mechsingleturret"],
    },
    {
      POSITION: [20, 0, -25, 0, 180, 1],
      TYPE: ["mechsingleturret"],
    },
    {
      POSITION: [25, 0, 0, 0, 360, 0],
      TYPE: ["dominationBody"],
    },
  ],
  DANGER: 7,
  GUNS: [
    {
      POSITION: [19, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.single]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
    },
    {
      POSITION: [20, 8, 1, 0, 0, -90, 0],
    },
    {
      POSITION: [20, 8, 1, 0, 0, 90, 0],
    },
  ],
};
Class.whirlwindop = {
  PARENT: "genericTank",
  LABEL: "OP Whirlwind",
  ANGLE: 60,
  CONTROLLERS: ["whirlwind"],
  SKILL: Array(10).fill(255),
  SKILL_CAP: Array(10).fill(255),
  HAS_NO_RECOIL: true,
  STAT_NAMES: statnames.whirlwind,
  TURRETS: [
    {
      POSITION: [8, 0, 0, 0, 360, 1],
      TYPE: "whirlwindDeco",
    },
  ],
  AI: {
    SPEED: 4.5,
  },
  GUNS: (() => {
    let output = [];
    for (let i = 0; i < 6; i++) {
      output.push({
        POSITION: { WIDTH: 8, LENGTH: 1, DELAY: i * 0.25 },
        PROPERTIES: {
          SHOOT_SETTINGS: combineStats([g.satellite]),
          TYPE: ["satellite", { ANGLE: i * 60 }],
          MAX_CHILDREN: 1,
          AUTOFIRE: true,
          SYNCS_SKILLS: false,
          WAIT_TO_CYCLE: true,
        },
      });
    }
    return output;
  })(),
};
Class.OPTanks2 = {
  PARENT: "menu",
  LABEL: "OP Tanks",
};
Class.oppredator = {
  PARENT: "genericTank",
  LABEL: "OP Predator",
  DANGER: 7,
  SKILL: Array(10).fill(255),
  SKILL_CAP: Array(10).fill(255),
  BODY: {
    SPEED: base.SPEED * 0.9,
    FOV: base.FOV * 1.25,
  },
  CONTROLLERS: ["zoom"],
  TOOLTIP: "Hold right click to zoom.",
  GUNS: [
    {
      POSITION: [24, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.hunter,
          g.hunter,
          g.hunter,
          g.predator,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [21, 12, 1, 0, 0, 0, 0.15],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.sniper,
          g.hunter,
          g.hunter,
          g.predator,
        ]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 16, 1, 0, 0, 0, 0.3],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.predator]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.crasherpenta = {
  TYPE: "crasher",
  LABEL: "Crasher",
  COLOR: "pink",
  SHAPE: 5,
  SIZE: 25,
  VARIES_IN_SIZE: false,
  CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
  AI: {
    NO_LEAD: true,
  },
  BODY: {
    SPEED: 5,
    ACCELERATION: 1.4,
    HEALTH: 0.75,
    DAMAGE: 5.25,
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
Class.crashersquare = {
  TYPE: "crasher",
  LABEL: "Crasher",
  COLOR: "pink",
  SHAPE: 4,
  SIZE: 10,
  VARIES_IN_SIZE: false,
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
Class.blocker = {
  PARENT: "genericTank",
  LABEL: "Blocker {MOCKUP}",
  GUNS: [
    {
      POSITION: [18, 7, 1, 0, 6, 0, 0],
    },
    {
      POSITION: [18, 7, 1, 0, -6, 0, 0],
    },
    {
      POSITION: [16, 11, 1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.fastermachineshot]),
        TYPE: "gravel",
      },
    },
  ],
};
Class.aimbotBasic = {
  PARENT: "genericTank",
  LABEL: "Aimbot Basic",
  TOOL_TIP:
    "[DEV NOTE] This Tank Isn't Fully Made Yet! So It may or may not work as intended!",
  GUNS: [
    {
      POSITION: [20, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "aimbotbullet",
      },
    },
    {
      POSITION: [7, 2, -2, 19, 0, 0, 0],
      COLOR: "red",
    },
    {
      POSITION: [7, 2, -2, 5, 0, 0, 0],
      COLOR: "red",
    },
  ],
};
Class.AimbotTwin = {
  PARENT: "genericTank",
  LABEL: "AimBot Twin",
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "aimbotbullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, -6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin]),
        TYPE: "aimbotbullet",
      },
    },
    {
      POSITION: [7, 3, -2, 8, 0, 0, 0],
      COLOR: "red",
    },
    {
      POSITION: [7, 3, -2, 16, 6, 0, 0],
      COLOR: "red",
    },
    {
      POSITION: [7, 3, -2, 16, -6, 0, 0],
      COLOR: "red",
    },
  ],
};
Class.aimbotDestroyer = {
  PARENT: "genericTank",
  LABEL: "Aimbot Destroyer",
  GUNS: [
    {
      POSITION: [21, 13, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
        TYPE: "aimbotbullet",
      },
    },
    {
      POSITION: [10, 2, -2, 9, 0, 0, 0],
      COLOR: "red",
    },
  ],
};
Class.aimbotbullet = {
  LABEL: "Bullet",
  TYPE: "bullet",
  ACCEPTS_SCORE: false,
  MOTION_TYPE: "chase",
  FACING_TYPE: "smoothToTarget",
  CONTROLLERS: [
    "nearestDifferentMaster",
    //"canRepel",
    "mapTargetToGoal",
    //"hangOutNearMaster",
  ],
  AI: {
    BLIND: true,
  },
  BODY: {
    PENETRATION: 1,
    SPEED: 3.75,
    RANGE: 90,
    DENSITY: 1.25,
    HEALTH: 0.165,
    DAMAGE: 6,
    PUSHABILITY: 0.3,
  },
  CAN_GO_OUTSIDE_ROOM: true,
  HITS_OWN_TYPE: "never",
  DIE_AT_RANGE: true,
};
Class.triplerarityGrower = {
  PARENT: ["genericTank"],
  LABEL: "Triplerarity grower",
  TOOL_TIP: "Made By Hamster! (Game Moderator)",
  GUNS: [
    {
      POSITION: [18, 8, 1, 2, -6, 7, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
        TYPE: "growBullet",
      },
    },
    {
      POSITION: [18, 8, 1, 2, 6, -3.5, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
        TYPE: "growBullet",
      },
    },
    {
      POSITION: [22, 11, 1, 1, 1, -0.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
        TYPE: "growBullet",
      },
    },
  ],
};
Class.shotgunner = {
  PARENT: "genericTank",
  LABEL: "ShotGunner",
  GUNS: [
    {
      POSITION: [2, 5, 1, 22, -4, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [2, 5, 1, 22, -2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [2, 5, 1, 22, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [2, 5, 1, 22, 2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [2, 5, 1, 22, 4, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [2, 5, 1, 22, 6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [2, 5, 1, 17, 6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [2, 5, 1, 17, 2, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [2, 5, 1, 17, -6, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [2, 5, 1, 17, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "casing",
      },
    },
    {
      POSITION: [7, 8, 1, 12, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [7, 8, 1, 12, 4, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [7, 8, 1, 12, -4, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.shotgun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [26, 18, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [24, 13, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [22, 10, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [19, 8, 1, 0, 0, 0, 0],
    },
  ],
};
Class.Jörmungandr = {
  PARENT: ["genericTank"],
  LABEL: "Jörmungandr",
  SHAPE: 5,
  SIZE: 22,
  GUNS: [
    {
      POSITION: [50, 17, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [14, 17, 1, 0, 0, -105, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [14, 17, 1, 0, 0, 105, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [14, 17, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [14, 17, 1, 15, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [14, 17, 1, 29, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
    {
      POSITION: [4, 17, 1, 43, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "hypermissile",
        LABEL: "",
      },
    },
  ],
};

Class.microscope = {
  PARENT: "genericTank",
  LABEL: "MicroScope",
  GUNS: [
    {
      POSITION: [9, 13, 0, 17, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "trap",
      },
    },
    {
      POSITION: [17, 7, 1, 5, 0, 0.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "trap",
      },
    },
    {
      POSITION: [17, 15, 1, 5, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "trap",
      },
    },
  ],
};

Class.trinuke = {
  PARENT: "genericTank",
  LABEL: "Tri-Nuke",
  MAX_CHILDREN: 30,
  GUNS: [
    {
      POSITION: [34, 10, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "trap",
      },
    },
    {
      POSITION: [29, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
    {
      POSITION: [22, 14, 1, -5, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
    {
      POSITION: [17, 14, 1, -5, 0, -0.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "setTrap",
      },
    },
  ],
};
Class.ak46 = {
  PARENT: "genericTank",
  LABEL: "Ak-46",
  GUNS: [
    {
      POSITION: [18, 19, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 12, 1, 0, 0, -0.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [28, 8, 1, 0, 0, -0.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 4, 1, 0, 7, 1, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 4, 1, 0, -7, -2, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.crab = {
  PARENT: "genericTank",
  LABEL: "Crab",
  SIZE: 10,
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, -180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 30, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, -30, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, -150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.petteler = {
  PARENT: "genericTank",
  LABEL: "Petteler",
  GUNS: [
    {
      POSITION: [18, 4, 1, 0, 5, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 4, 1, 0, -5, 0, 0.25],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [21, 4, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 3, 1, 0, 8, 0, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 3, 1, 0, -8, 0, 0.75],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 3, 1, 0, 0, 0, 1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.gunner]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.DestroyerDominatorOld = {
  PARENT: "destroyerDominator",
  UPGRADE_LABEL: "Dominator",
};
Class.GunnerDominatorOld = {
  PARENT: "gunnerDominator",
  UPGRADE_LABEL: "Dominator",
};
Class.TrapperDominatorOld = {
  PARENT: "gunnerDominator",
  UPGRADE_LABEL: "Dominator",
};
Class.BaseProtectorOld = {
  PARENT: "baseProtector",
  UPGRADE_LABEL: "Base",
};
Class.DominatorBlank = {
  PARENT: "genericTank",
  LABEL: "Dominator",
  TURRETS: [
    {
      POSITION: [22, 0, 0, 0, 360, 0],
      TYPE: "dominationBody",
    },
  ],
};
Class.HealerMenuOld = {
  PARENT: "healer",
  UPGRADE_LABEL: "Healer Menu",
};
Class.BossesMenuOld = {
  PARENT: "bosses",
  LABEL: "Bosses Menu",
  UPGRADES_TIER_0: ["elites", "sentries"],
};
Class.SpecialMenu = {
  PARENT: "menu",
  LABEL: "Special Menu",
  UPGRADES_TIER_0: [
    "basic",
    "SpecialTanksMenu",
    "BossesMenuOld",
    "NostalgiaMenu",
    "ScrappedMenu",
    "MemesMenu",
    "DreadnoughtsMenu",
    "ShinyMenu",
  ],
};
Class.NostalgiaMenu = {
  PARENT: "menu",
  LABEL: "Nostalgia Menu",
};
Class.DominatorMenu = {
  PARENT: "menu",
  LABEL: "Dominator Menu",
  UPGRADES_TIER_0: [
    "SpecialTanksMenu",
    "DominatorBlank",
    "DestroyerDominatorOld",
    "GunnerDominatorOld",
    "TrapperDominatorOld",
    //"BaseProtectorOld",
  ],
};
Class.ScrappedMenu = {
  PARENT: "menu",
  LABEL: "Scrapped Menu",
  UPGRADE_TOOLTIP: "Not Yet!",
};
Class.SpecialTanksMenu = {
  PARENT: "menu",
  LABEL: "Special Tanks Menu",
  UPGRADE_TOOLTIP: "Not Yet!",
  UPGRADES_TIER_0: [
    "SpecialMenu",
    "HealerMenuOld",
    "DominatorMenu",
    //"arenaCloser",
  ],
};
Class.MemesMenu = {
  PARENT: "menu",
  LABEL: "Memes",
  UPGRADES_TIER_0: ["DiepTanksMenu", "AdminTanksMenu", "MiscTanksMenu"],
};
Class.AdminTanksMenu = {
  PARENT: "menu",
  LABEL: "Admin Tanks",
  UPGRADES_TIER_0: ["antiTankMachineGun", "arenaCloser", "spectator"],
};
Class.DiepTanksMenu = {
  PARENT: "menu",
  UPGRADE_TOOLTIP: "Not Yet!",
  LABEL: "Diep Tanks",
};
Class.MiscTanksMenu = {
  PARENT: "menu",
  UPGRADE_TOOLTIP: "Not Yet!",
  LABEL: "Misc",
  //UPGRADES_TIER_1: [""],
};
Class.DreadnoughtsMenu = {
  PARENT: "menu",
  LABEL: "Dreadnoughts",
  UPGRADES_TIER_1: ["dreadOfficialV2"],
};
Class.ShinyMenu = {
  PARENT: "menu",
  UPGRADE_TOOLTIP: "Not finished",
  TOOL_TIP: "Not Finished Yet!",
  LABEL: "Shiny Member Menu",
  UPGRADES_TIER_0: [
    "eggGenerator",
    "SpecialTanksMenu",
    "BossesMenuOld",
    "NostalgiaMenu",
    "ScrappedMenu",
    "DreadnoughtsMenu",
    "tracker3",
  ],
};
Class.specialtankssubs = {
  PARENT: "menu",
  COLOR: 19,
  LABEL: "Special Tanks Menu",
  UPGRADE_TOOLTIP: "Nice And Orginazied!",
  UPGRADES_TIER_3: [
    ["basic", "basic"],
    "DreadnoughtsMenu",
    "DominatorMenu",
    "sanctuaries",
    "oldtank",
  ],
};
Class.misctanksmenuforsubs = {
  PARENT: "menu",
  LABEL: "Misc Tank Menu",
  COLOR: 25,
  UPGRADES_TIER_3: [
    "auraBasic",
    "rapturev2",
    "mummifier",
    "tripilet",
    "lighter",
    "balls",
  ],
};
Class.doubleFlamethrower = {
  PARENT: "genericTank",
  LABEL: "Double Flamethrower",
  GUNS: [
    {
      POSITION: [10, 9, -2.7, 16, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "growBullet",
      },
    },
    {
      POSITION: [21, 8, 3.7, 0, 0, 0, 0],
    },
    {
      POSITION: [10, 9, -2.7, 16, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "growBullet",
      },
    },
    {
      POSITION: [21, 8, 3.7, 0, 0, 180, 0],
    },
  ],
};
Class.Flamethrower = {
  PARENT: "genericTank",
  LABEL: "Flamethrower",
  GUNS: [
    {
      POSITION: [10, 9, -2.7, 16, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "growBullet",
      },
    },
    {
      POSITION: [21, 8, 3.7, 0, 0, 0, 0],
    },
  ],
};
Class.twisty = {
  PARENT: "genericTank",
  LABEL: "Twisty",
  GUNS: [
    {
      POSITION: [21, 8, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [19, 4, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [19, 8, 1, 0, 6, 30, 0],
    },
    {
      POSITION: [19, 8, 1, 0, -6, -30, 0],
    },
    {
      POSITION: [16, 4, 1, 0, -6, -30, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pounder,
          g.skimmer,
          g.morespeed,
          g.one_third_reload,
        ]),
        TYPE: "spinmissile",
      },
    },
    {
      POSITION: [16, 4, 1, 0, 6, 30, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.pounder,
          g.skimmer,
          g.morespeed,
          g.one_third_reload,
        ]),
        TYPE: "spinmissile",
      },
    },
  ],
};

Class.triachip = {
  PARENT: "sunchip",
  NECRO: [3],
  SHAPE: 3,
};
Class.triamancer = {
  PARENT: "genericTank",
  LABEL: "Trimancer",
  SHAPE: 3,
  GUNS: [
    {
      POSITION: [11, 11, 1, 0, 0, 60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "triachip",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [11, 11, 1, 0, 0, -60, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "triachip",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [11, 11, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "triachip",
        AUTOFIRE: true,
      },
    },
  ],
};
Class.pentachip2 = {
  PARENT: "sunchip",
  NECRO: [5],
  SHAPE: 5,
};

Class.pentamancer = {
  PARENT: "genericTank",
  LABEL: "Pentamancer",
  SHAPE: 5,
  GUNS: [
    {
      POSITION: [13, 10, 1, 0, 0, -112.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "pentachip2",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [13, 10, 1, 0, 0, 112.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "pentachip2",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [13, 10, 1, 0, 0, 37.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "pentachip2",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [13, 10, 1, 0, 0, -37.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "pentachip2",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [13, 10, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.sunchip]),
        TYPE: "pentachip2",
        AUTOFIRE: true,
      },
    },
  ],
};
Class.raven = {
  PARENT: "genericTank",
  LABEL: "Raven",
  GUNS: [
    {
      POSITION: [18, 4, 1, 0, -4, 0, 0],
    },
    {
      POSITION: [18, 4, 1, 0, 4, 0, 0],
    },
    {
      POSITION: [24, 7, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.raven]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, -157.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 157.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 8, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.masterbullet = {
  PARENT: "genericTank",
  LABEL: "Master Booster",
  AUTO_FIRE: true,
  FACING_TYPE: "veryfastspin",
  DANGER: 7,
  GUNS: [
    {
      POSITION: [18, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.triAngle,
          g.triAngleFront,
          g.tonsmorrecoil,
        ]),
        TYPE: "bullet",
        LABEL: "Front",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [14, 8, 1, 0, -1, 140, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.triAngle,
          g.thruster,
        ]),
        TYPE: "bullet",
        LABEL: gunCalcNames.thruster,
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [14, 8, 1, 0, 1, -140, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.triAngle,
          g.thruster,
        ]),
        TYPE: "bullet",
        AUTOFIRE: true,
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 150, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.triAngle,
          g.thruster,
        ]),
        TYPE: "bullet",
        LABEL: gunCalcNames.thruster,
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, -150, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.triAngle,
          g.thruster,
        ]),
        TYPE: "bullet",
        AUTOFIRE: true,
        LABEL: gunCalcNames.thruster,
      },
    },
  ],
};
Class.master = {
  PARENT: "genericTank",
  LABEL: "Master",
  GUNS: [
    {
      POSITION: [18, 18, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.triAngle,
          g.triAngleFront,
          g.tonsmorrecoil,
        ]),
        TYPE: "masterbullet",
        LABEL: "Master Booster",
        MAX_CHILDREN: 6,
      },
    },
    {
      POSITION: [14, 8, 1, 0, -1, 140, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.triAngle,
          g.thruster,
        ]),
        TYPE: "bullet",
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [14, 8, 1, 0, 1, -140, 0.6],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.triAngle,
          g.thruster,
        ]),
        TYPE: "bullet",
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, 150, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.triAngle,
          g.thruster,
        ]),
        TYPE: "bullet",
        LABEL: gunCalcNames.thruster,
      },
    },
    {
      POSITION: [16, 8, 1, 0, 0, -150, 0.1],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.flankGuard,
          g.triAngle,
          g.thruster,
        ]),
        TYPE: "bullet",
        LABEL: gunCalcNames.thruster,
      },
    },
  ],
};
Class.coordinator = {
  PARENT: "genericTank",
  LABEL: "Coordinator",
  MAX_CHILDREN: 6,
  UPGRADES_TIER_3: ["adviser"],
  FOV: base.FOV * 0.35,
  GUNS: [
    {
      POSITION: [14, 10, 2, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.fastdrone]),
        AUTOFIRE: true,
        TYPE: "drone",
      },
    },
    {
      POSITION: [17, 3, -1.5, 0, 0, 0, 0],
    },
  ],
};
Class.adviser = {
  PARENT: "genericTank",
  LABEL: "Adviser",
  FOV: base.FOV * 1.35,
  MAX_CHILDREN: 12,
  GUNS: [
    {
      POSITION: [14, 8, 2, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.fastdrone]),
        TYPE: "drone",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [14, 8, 2, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.fastdrone]),
        TYPE: "drone",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [18, 5, -2, 0, 0, -90, 0],
    },
    {
      POSITION: [18, 5, -2, 0, 0, 90, 0],
    },
  ],
};
Class.dualator = {
  PARENT: "genericTank",
  LABEL: "Dualator",
  BODY: {
    FOV: base.FOV * 1.25,
  },
  GUNS: [
    {
      POSITION: [16, 20, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.dual]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 8, 1, 0, -4, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.dual]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [20, 8, 1, 0, 4, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.dual]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.tankThatShootsTanks = {
  PARENT: "genericTank",
  LABEL:
    "Totally not an crash server tank nah why think that you know like it doesnt crash the server RIGHT?!?!??!?!?!?!?!",
  GUNS: [
    {
      POSITION: [24, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "tankThatShootsTanks8",
      },
    },
    {
      POSITION: [12, 10, -2, 0, 0, 0, 0],
    },
  ],
};
Class.tankThatShootsTanks8 = {
  PARENT: "genericTank",
  LABEL: "Tank that shoots tanks",
  GUNS: [
    {
      POSITION: [24, 8, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "tankThatShootsTanks",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [12, 10, -2, 0, 0, 0, 0],
    },
  ],
};
Class.sprayator = {
  PARENT: "genericTank",
  LABEL: "Sprayator",
  GUNS: [
    {
      POSITION: [8, 7, 2, 14, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.machineGun]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [18, 9, 2, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([
          g.basic,
          g.machineGun,
          g.lowPower,
          g.gunner,
          g.morerecoil,
        ]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.swarmTrap = {
  PARENT: "setTrap",
  LABEL: "Swarm Trap",
  TYPE: "trap",
  /*CONTROLLERS: ["nearestDifferentMaster", "goToMasterTarget"],*/
  SHAPE: -4,
  COLOR: 4,
  GUNS: [
    {
      POSITION: [12, 6, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.hive]),
        TYPE: "bee",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [12, 6, 1, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.hive]),
        TYPE: "bee",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [12, 6, 1, 0, 0, -180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.hive]),
        TYPE: "bee",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [12, 6, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.hive]),
        TYPE: "bee",
        AUTOFIRE: true,
      },
    },
  ],
};
Class.beetle = {
  PARENT: "genericTank",
  LABEL: "Beetle",
  MAX_CHILDREN: 4,
  GUNS: [
    {
      POSITION: [21, 12, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [2, 14, 1, 22, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap, g.block]),
        TYPE: "swarmTrap",
      },
    },
  ],
};
Class.alitteralhouse = {
  PARENT: "genericTank",
  LABEL: "A Litteral House",
  SHAPE: [
    [-0.592, 0.177],
    [-0.664, 0.25],
    [0.024, 0.98],
    [0.792, 0.304],
    [0.722, 0.225],
    [0.63, 0.317],
    [0.626, -0.58],
    [-0.51, -0.61],
    [-0.514, 0.265],
  ],
};

Class.Pistol = {
  PARENT: ["genericTank"],
  LABEL: "Pistol",
  SHAPE: 212,
  GUNS: [
    {
      POSITION: [1, 4, 1, 31, -22, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "developerBullet",
      },
    },
  ],
};
Class.developerspecial = {
  PARENT: ["genericTank"],
  LABEL: "Developer (Diep.io Tank)",
  CONTROLLERS: ["spin"],
  SHAPE: 8,
  SIZE: 20,
  COLOR: 14,
  TURRETS: [
    {
      /*  SIZE     X       Y     ANGLE    ARC */
      POSITION: [22.5, 0, 0, 0, 180, 0],
      TYPE: "devBodyspecial",
    },
    {
      POSITION: [10, 0, 0, 0, 0, 1],
      TYPE: ["autoTurret"],
      //SIZE: 12,
    },
  ],
};

Class.devBodyspecial = {
  LABEL: " ",
  CONTROLLERS: ["spin"],
  COLOR: 9,
  SHAPE: 8,
  SIZE: 14,
  INDEPENDENT: true,
};
Class.fallenPentagon = {
  PARENT: "miniboss",
  LABEL: "Fallen Pentagon",
  SHAPE: 5,
  SIZE: 20,
  COLOR: 16,
  GUNS: [
    {
      POSITION: [14, 11, 1, 0, 0, 179.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 11, 1, 0, 0, -35.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 11, 1, 0, 0, 38, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 11, 1, 0, 0, 110, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
    {
      POSITION: [14, 11, 1, 0, 0, -109, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.veryfastmissle = {
  PARENT: "bullet",
  LABEL: "VeryFastMissle",
  TYPE: "bullet",
  GUNS: [
    {
      POSITION: [18, 6, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.fastreload]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [18, 6, 1, 0, 0, 150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.fastreload]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [18, 6, 1, 0, 0, -150, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.fastreload]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },
  ],
};
Class.missler = {
  PARENT: "genericTank",
  LABEL: "Missler",
  GUNS: [
    {
      POSITION: [3, 8, 2, 23, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "veryfastmissle",
      },
    },
    {
      POSITION: [23, 14, 1, 0, 0, 0, 0],
    },
  ],
};
Class.eliteEgg = {
  PARENT: "miniboss",
  LABEL: "Elite Egg",
  SCORE: 69420,
  UPGRADE_LABEL: "This Boss Give 69420 Score HAHAHAHA FUnNi!1111!1",
  SIZE: 20,
  COLOR: 5,
  TURRETS: [
    {
      POSITION: [10, 0, 0, 0, 0, 1],
      TYPE: ["autoTurret"],
      //SIZE: 12,
    },
  ],
  GUNS: [
    {
      POSITION: [11, 8, 1, 0, 0, 0, 0],
    },
    {
      POSITION: [11, 8, 1, 0, 0, -180, 0],
    },
    {
      POSITION: [11, 8, 1, 0, 0, 90, 0],
    },
    {
      POSITION: [11, 8, 1, 0, 0, -90, 0],
    },
    {
      POSITION: [1, 6, 1, 12, 0, 0, 0],
    },
    {
      POSITION: [1, 6, 1, 12, 0, -90, 0],
    },
    {
      POSITION: [1, 6, 1, 12, 0, 180, 0],
    },
    {
      POSITION: [1, 6, 1, 12, 0, 90, 0],
    },
    {
      POSITION: [2, 9, 1, 13.5, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
        TYPE: "minion",
        MAX_CHILDREN: 1,
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [2, 9, 1, 13.5, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
        TYPE: "minion",
        MAX_CHILDREN: 1,
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [2, 9, 1, 13.5, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
        TYPE: "minion",
        MAX_CHILDREN: 1,
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [2, 9, 1, 13.5, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
        TYPE: "minion",
        MAX_CHILDREN: 1,
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [14, 6, 1, 0, 0, -45, 0],
    },
    {
      POSITION: [14, 6, 1, 0, 0, -135, 0],
    },
    {
      POSITION: [14, 6, 1, 0, 0, 135, 0],
    },
    {
      POSITION: [14, 6, 1, 0, 0, 45, 0],
    },
    {
      POSITION: [3, 6, 1.4, 13, 0, -45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: "trap",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [3, 6, 1.4, 13, 0, -135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: "trap",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [3, 6, 1.4, 13, 0, 135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: "trap",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [3, 6, 1.4, 13, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.trap]),
        TYPE: "trap",
        AUTOFIRE: true,
      },
    },
  ],
};
Class.EliteEggDestroyer = {
  PARENT: "miniboss",
  LABEL: "Elite Egg",
  UPGRADE_LABEL: "This Boss Give 69420 Score HAHAHAHA FUnNi!1111!1",
  SCORE: 69420,
  SIZE: 20,
  COLOR: 5,
  TURRETS: [
    {
      POSITION: [10, 0, 0, 0, 0, 1],
      TYPE: ["autoTurret"],
      //SIZE: 12,
    },
  ],
  GUNS: [
    {
      POSITION: [14, 15, 1, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [14, 15, 1, 0, 0, -90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [14, 15, 1, 0, 0, 90, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [14, 15, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
        TYPE: "bullet",
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [12, 9, 1.4, 2, 0, -45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone]),
        TYPE: "drone",
        MAX_CHILDREN: 2,
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [12, 9, 1.4, 2, 0, -142.5, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone]),
        TYPE: "drone",
        MAX_CHILDREN: 2,
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [12, 9, 1.4, 2, 0, 135, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone]),
        TYPE: "drone",
        MAX_CHILDREN: 2,
        AUTOFIRE: true,
      },
    },
    {
      POSITION: [12, 9, 1.4, 2, 0, 45, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone]),
        TYPE: "drone",
        MAX_CHILDREN: 2,
        AUTOFIRE: true,
      },
    },
  ],
};
Class.negativenumbertest = {
  PARENT: "genericTank",
  LABEL: "negativenumbertest(crash)",
  GUNS: [
    {
      POSITION: [-18, -8, 1, 0, 0, 180, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.menu = {
  PARENT: ["genericTank"],
  LABEL: "",
  SKILL_CAP: [
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
    dfltskl,
  ],
  IGNORED_BY_AI: true,
  TURRETS: [],
  GUNS: [
    {
      /*** LENGTH    WIDTH     ASPECT        X             Y         ANGLE     DELAY */
      POSITION: [18, 10, -1.4, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.trainPart1 = {
  PARENT: "booster",
  LABEL: "",
  TURRETS: [
    {
      POSITION: [20, -22, 0, 0, 90 / 4, 0],
      TYPE: "assassin",
      VULNERABLE: true,
    },
  ],
};
Class.trainPart2 = {
  PARENT: "assassin",
  LABEL: "",
  TURRETS: [
    {
      POSITION: [20, -22, 0, 0, 90 / 3, 0],
      TYPE: "trainPart1",
      VULNERABLE: true,
    },
  ],
};
Class.trainPart3 = {
  PARENT: "booster",
  LABEL: "",
  TURRETS: [
    {
      POSITION: [20, -22, 0, 0, 90 / 2, 0],
      TYPE: "trainPart2",
      VULNERABLE: true,
    },
  ],
};
Class.train = {
  PARENT: "developer",
  LABEL: "Europe Nexus Be Like",
  UPGRADE_TOOLTIP:
    "[DEV NOTE] this is a very early prototype and probably won't work so well lol",
  TURRETS: [
    {
      POSITION: [20, -22, 0, 0, 90, 0],
      TYPE: "trainPart3",
      VULNERABLE: true,
    },
  ],
};
Class.SkibibiToiliet = {
  PARENT: "menu",
  LABEL: "I Hate Doing This BROOOOO",
  SHAPE: "whyyyyyyyyy.jpg",
};
Class.tier4tanks = {
  PARENT: "menu",
  LABEL: "Tier 4",
};

Class.SkibibiToiliet.UPGRADES_TIER_1 = ["betatanksforfirend"];
let tanktypesrandom = [
  "rocketeer", //1
  "gatsPistol", //2
  "literallyAMachineGun", //3
  "literallyATank", //4
  "jumpSmasher", //5
  "rapturev2", //6
  "Flamethrower", //7
  "spikeanni", //8
];
Class.basic.UPGRADES_TIER_8 = ["dreadOfficialV2"];

Class.pastdaily.UPGRADES_TIER_0 = [
  "doubleFlamethrower",
  "rapturev2",
  "mummifier",
  "fullofglourious",
  "auraBasic",
  "hybannihilator",
  "ninja",
  "boat",
  "rapturev2",
  "maxstatstank",
];
Class.oldtank.UPGRADES_TIER_0 = ["newbranch", "Hunter2"];
Class.newbranch.UPGRADES_TIER_1 = ["newbranch2", "trappers", "enginner1"];
Class.trappers.UPGRADES_TIER_1 = ["newbranch", "trapper2"];
Class.trapper2.UPGRADES_TIER_1 = ["trapper3"];
Class.subscriber.UPGRADES_TIER_0 = ["misctanksmenuforsubs", "specialtankssubs"];
Class.maxstatstank.UPGRADES_TIER_0 = [ran.choose(tanktypesrandom)];
Class.newbranch2.UPGRADES_TIER_1 = ["newbranch3"];
Class.page3ofbts.UPGRADES_TIER_0 = [
  "OPTanks",
  "addons",
  "maperWide",
  "maperHeight",
  "betatanksforfirend",
];
Class.OPTanks.UPGRADES_TIER_0 = ["redistibutorop", "whirlwindop", "oppredator"];
Class.todaysdailytank.UPGRADES_TIER_0 = ["rocketeer"];
Class.eventdeveloper.UPGRADES_TIER_3 = [
  "basic",
  "pastdaily",
  "eventdev3betatank",
  "eventdev4page2bts",
  "eventdev2misc",
  "misctanksmenuforsubs",
  "oldtank",
];
Class.ninja.UPGRADES_TIER_3 = ["tier1", "tier2", "tier3"];
Class.arrasdev.UPGRADES_TIER_0 = ["spectator2", "defender", "guardian"];
Class.betatanksforfirend.UPGRADES_TIER_0 = [
  "doubleFlamethrower",
  "Flamethrower",
  "rapturev2",
  "spikeanni",
  "flankest",
  "destroytor",
  "twinabor",
  "ninja",
  "overdestroy",
  "vulstreamliner",
  "snipy",
  //"riot",
  "redistibutor",
  "tier4tanks",
  "aimbotBasic",
  //"Jörmungandr",
  "ak46",
  "trinuke",
  "microscope",
];
Class.customsiegestuff.UPGRADES_TIER_0 = [
  "antiTankMachineGun",
  "antiTankMachineGunArm",
  "swarmist",
  "arenaCloser",
  "DiepCloser",
  "healer",
  "bob",
  "metalmach",
  "spiniBoi",
  "fallenPentagon",
  "eliteEgg",
  "EliteEggDestroyer",
];
Class.betateanks.UPGRADES_TIER_0 = [
  //"florr_tank",
  "mummifier",
  //"maximumOverdrive",
  "auraBasic",
  "armyOfOne",
  "vanquisher",
  //"godbasic",
  "ghoster",
  "medoing",
  "medoingurmama",
  "medoingall",
  "subscriber",
  "OPTanks2",
];
Class.testbedformods.UPGRADES_TIER_0 = [
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
Class.page2ofbts.UPGRADES_TIER_0 = [
  "nexusmenu",
  "bosses",
  "unavailable",
  "levels",
  "betateanks",
  "pastdaily",
  "arrasdev",
  "oldtank",
  "eggGenerator",
  "page3ofbts",
];
Class.eventdev2misc.UPGRADES_TIER_0 = [
  "balls",
  "tripilet",
  "lighter",
  //"woomyBasic",
  "Flamethrower",
  "doubleFlamethrower",
  "rock",
  "gravel",
  "rapturev2",
  "swarmist",
  "thegrinch",
  "metalmach",
  "spiniBoi",
  "defender",
  "guardian",
  "mechsingleturret",
];
Class.eventdev3betatank.UPGRADES_TIER_0 = [
  "mummifier",
  "auraBasic",
  "armyOfOne",
  "vanquisher",
  //"godbasic",
  "ghoster",
];
Class.eventdev4page2bts.UPGRADES_TIER_0 = [
  "unavailable",
  "eventdev3betatank",
  "pastdaily",
];

Class.nexusmenu.UPGRADES_TIER_0 = ["baseProtector"];

Class.misclite.UPGRADES_TIER_0 = [
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
  "satellite",
  "trianglebullet",
  "lighter",
  //"woomyBasic",
  "Flamethrower",
  "doubleFlamethrower",
  "rocketeer2",
  "lorry",
  "rapturev2",
  "swarmist",
  ["basic", "basic", "basic"],
  "thegrinch",
  "mechsingleturret",
  //"gunchip",
  "alitteralhouse",
  "whatthefuck",
  "Pistol",
];
Class.unreleasedtanks.UPGRADES_TIER_0 = [
  "betatester",
  "ceptioniststanks",
  "tripilet",
  "redistibutor",
];
Class.removedtanks.UPGRADES_TIER_0 = ["betatester"];

Class.ceptioniststanks.UPGRADES_TIER_0 = ["basiception"];
// bt upgrades
Class.betatester.UPGRADES_TIER_0 = [
  "removedtanks",
  "unreleasedtanks",
  "sentries",
  "misclite",
  "pastdaily",
  "betatanksforfirend",
  "oldtank",
  "betateanks",
];
Class.aimbotBasic.UPGRADES_TIER_2 = ["aimbotDestroyer", "AimbotTwin"];
