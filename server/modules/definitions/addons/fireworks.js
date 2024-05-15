/** FIREWORKS ADDON **/

if (!c.FIREWORKS)
  console.log(
    "[fireworks.js] c.FIREWORKS is disabled. Set it to true to enable this addon.",
  );
else console.log("[fireworks.js] Fireworks enabled.");
console.log(
  "[fireworks.js] For more info visit: https://github.com/P-R-2000/aps-plus-plus-addons/tree/main/fireworks",
);

const fireworkShapes = c.FIREWORKS?.SHAPES ?? [
  0,
  3,
  4,
  "M 0 -1 L 0.3 -0.4 L 1 -0.4 L 0.6 0.3 L 0.8 1 L 0 0.6 L -0.8 1 L -0.6 0.2 L -1 -0.4 L -0.4 -0.4 Z",
];
const fireworkColors = c.FIREWORKS?.COLORS ?? [
  ["blue", "red"],
  ["red", "orange"],
  ["blue", "cyan"],
  ["purple", "pink"],
  ["lightGreen", "green"],
];
const fireworkCountMin = c.FIREWORKS?.MIN ?? 6;
const fireworkCountMax = c.FIREWORKS?.MAX ?? 22;
const fireworkSpeed = c.FIREWORKS?.SPEED ?? 7;
const fireworkRange = c.FIREWORKS?.RANGE ?? 25;

exports.genericFirework = {
  PARENT: "bullet",
  LABEL: "Fireworks",
  SIZE: c.FIREWORKS?.SIZE ?? 5,
  BODY: {
    HEALTH: c.FIREWORKS?.HEALTH ?? 10,
    DAMAGE: c.FIREWORKS?.DAMAGE ?? 10,
  },
};

let fireworkShapesClasses = [];
for (let i = 0; i < fireworkShapes.length; i++) {
  let name = `fireworkShape${i + 1}`;
  exports[name] = {
    PARENT: "genericFirework",
    SHAPE: fireworkShapes[i],
  };
  fireworkShapesClasses.push(name);
}

function spawnFireworks(position) {
  let definition =
    fireworkShapesClasses[
      Math.floor(Math.random() * fireworkShapesClasses.length)
    ];
  let colors =
    fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
  let count =
    Math.floor(fireworkCountMin / colors.length) * colors.length +
    Math.floor(
      Math.random() * ((fireworkCountMax - fireworkCountMin) / colors.length),
    ) *
      colors.length;

  let facing = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    let e = new Entity(position);
    e.isFirework = true;
    e.define(definition);
    e.colorUnboxed.base = colors[i % colors.length];
    e.compressColor();
    e.facing = facing * i;
    e.accel.x = Math.cos(facing * i) * fireworkSpeed;
    e.accel.y = Math.sin(facing * i) * fireworkSpeed;
    e.range = fireworkRange;
    e.team = TEAM_ROOM;
  }
}

module.exports = ({ Events }) => {
  Events.on("spawn", (body) => {
    body.on("dead", () => {
      if (
        c.FIREWORKS &&
        !body.isFirework &&
        (typeof c.FIREWORKS?.CHECK_ENTITY === "function"
          ? c.FIREWORKS.CHECK_ENTITY(body)
          : Array.isArray(c.FIREWORKS?.ENTITY_TYPES)
            ? c.FIREWORKS?.ENTITY_TYPES.includes(body.type)
            : true)
      ) {
        spawnFireworks({ x: body.x, y: body.y });
      }
    });
  });
  if (c.FIREWORKS?.SPAWN_EVERY_MS)
    setInterval(() => {
      spawnFireworks(room.random());
    }, c.FIREWORKS.SPAWN_EVERY_MS);
};
