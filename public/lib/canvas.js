import { global } from "./global.js";
import { settings } from "./settings.js";
import * as socketStuff from "./socketInit.js";
let { gui } = socketStuff;

class Canvas {
  constructor() {
    this.directionLock = false;
    this.target = global.target;
    this.socket = global.socket;
    this.directions = [];

    this.chatInput = document.getElementById("chatInput");
    this.chatInput.addEventListener("keydown", (event) => {
      if (![global.KEY_ENTER, global.KEY_ESC].includes(event.keyCode)) return;
      this.chatInput.blur();
      this.cv.focus();
      this.chatInput.hidden = true;
      if (!this.chatInput.value) return;
      if (event.keyCode === global.KEY_ENTER)
        this.socket.talk("M", this.chatInput.value);
      this.chatInput.value = "";
    });

    this.cv = document.getElementById("gameCanvas");
    if (global.mobile) {
      // Mobile
      let mobilecv = this.cv;
      this.controlTouch = null;
      this.movementTouch = null;
      this.movementTop = false;
      this.movementBottom = false;
      this.movementLeft = false;
      this.movementRight = false;
      this.movementTouchPos = { x: 0, y: 0 };
      this.controlTouchPos = { x: 0, y: 0 };
      mobilecv.addEventListener("touchstart", (event) => this.touchStart(event), false);
      mobilecv.addEventListener("touchmove", (event) => this.touchMove(event), false);
      mobilecv.addEventListener("touchend", (event) => this.touchEnd(event), false);
      mobilecv.addEventListener("touchcancel",(event) => this.touchEnd(event), false);
    } else {
      this.cv.addEventListener('mousemove', event => this.mouseMove(event), false);
      this.cv.addEventListener('mousedown', event => this.mouseDown(event), false);
      this.cv.addEventListener('mouseup', event => this.mouseUp(event), false);
      this.cv.addEventListener('keypress', event => this.keyPress(event), false);
      this.cv.addEventListener('keydown', event => this.keyDown(event), false);
      this.cv.addEventListener('keyup', event => this.keyUp(event), false);
      this.cv.addEventListener('wheel', event => this.wheel(event), false);
    }
    this.cv.resize = (width, height) => {
      this.cv.width = this.width = width;
      this.cv.height = this.height = height;
    };
    this.cv.resize(innerWidth, innerHeight);
    this.reverseDirection = false;
    this.inverseMouse = false;
    this.spinLock = true;
    this.treeScrollSpeed = 0.5;
    this.treeScrollSpeedMultiplier = 1;
    global.canvas = this;
  }
  wheel(event) {
    if (!global.died && global.showTree) {
        if (event.deltaY > 1) {
            global.treeScale /= 1.1;
        } else {
            global.treeScale *= 1.1;
        }
    }
  }
  keyPress(event) {
    switch (event.keyCode) {
        case global.KEY_ZOOM_OUT:
            if (!global.died && global.showTree) global.treeScale /= 1.1;
            break;
        case global.KEY_ZOOM_IN:
            if (!global.died && global.showTree) global.treeScale *= 1.1;
            break;
    }
  }
  keyDown(event) {
    switch (event.keyCode) {
        case global.KEY_SHIFT:
            if (global.showTree) this.treeScrollSpeedMultiplier = 5;
            else this.socket.cmd.set(6, true);
            break;

        case global.KEY_ENTER:
            // Enter to respawn
            if (global.died && !global.cannotRespawn) {
                this.socket.talk('s', global.playerName, 0, 1 * settings.game.autoLevelUp);
                global.died = false;
                break;
            }

            // or to talk instead
            if (this.chatInput.hidden && global.gameStart && !global.cannotRespawn) {
                this.chatInput.hidden = false;
                this.chatInput.focus();
                break;
            }
            break;

        case global.KEY_UP_ARROW:
            if (!global.died && global.showTree) return global.scrollVelocityY = -this.treeScrollSpeed * this.treeScrollSpeedMultiplier;
        case global.KEY_UP:
            this.socket.cmd.set(0, true);
            break;
        case global.KEY_DOWN_ARROW:
            if (!global.died && global.showTree) return global.scrollVelocityY = +this.treeScrollSpeed * this.treeScrollSpeedMultiplier;
        case global.KEY_DOWN:
            this.socket.cmd.set(1, true);
            break;
        case global.KEY_LEFT_ARROW:
            if (!global.died && global.showTree) return global.scrollVelocityX = -this.treeScrollSpeed * this.treeScrollSpeedMultiplier;
        case global.KEY_LEFT:
            this.socket.cmd.set(2, true);
            break;
        case global.KEY_RIGHT_ARROW:
            if (!global.died && global.showTree) return global.scrollVelocityX = +this.treeScrollSpeed * this.treeScrollSpeedMultiplier;
        case global.KEY_RIGHT:
            this.socket.cmd.set(3, true);
            break;
        case global.KEY_MOUSE_0:
            this.socket.cmd.set(4, true);
            break;
        case global.KEY_MOUSE_1:
            this.socket.cmd.set(5, true);
            break;
        case global.KEY_MOUSE_2:
            this.socket.cmd.set(6, true);
            break;
        case global.KEY_LEVEL_UP:
            this.socket.talk('L');
            break;
        case global.KEY_FUCK_YOU:
            this.socket.talk('0');
            break;
        case global.KEY_BECOME:
            this.socket.talk('H');
            break;
        case global.KEY_MAX_STAT:
            global.statMaxing = true;
            break;
        case global.KEY_SUICIDE:
            this.socket.talk('1');
            break;
    }
    if (!event.repeat) {
        switch (event.keyCode) {
            case global.KEY_AUTO_SPIN:
                global.autoSpin = !global.autoSpin;
                this.socket.talk('t', 0, true);
                break;
            case global.KEY_AUTO_FIRE:
                this.socket.talk('t', 1, true);
                break;
            case global.KEY_OVER_RIDE:
                this.socket.talk('t', 2, true);
                break;
            case global.KEY_AUTO_ALT:
                this.socket.talk('t', 3, true);
                break;
            case global.KEY_SPIN_LOCK:
                this.spinLock = !this.spinLock;
                global.createMessage(this.spinLock ? 'Spinlock disabled.' : 'Spinlock enabled.');
                this.socket.talk('t', 4, false);
                break;
            case global.KEY_REVERSE_MOUSE:
                this.inverseMouse = !this.inverseMouse;
                global.createMessage(this.inverseMouse ? 'Reverse mouse enabled.' : 'Reverse mouse disabled.');
                break;
            case global.KEY_REVERSE_TANK:
                this.reverseDirection = !this.reverseDirection;
                global.createMessage(this.reverseDirection ? 'Reverse tank enabled.' : 'Reverse tank disabled.');
                break;
              case global.KEY_DEBUG:
                global.showDebug = !global.showDebug;
                break;
            case global.KEY_CLASS_TREE:
                global.treeScale = 1;
                global.showTree = !global.showTree;
                break;
        }
        if (global.canSkill) {
            let skill = [
                global.KEY_UPGRADE_ATK, global.KEY_UPGRADE_HTL, global.KEY_UPGRADE_SPD,
                global.KEY_UPGRADE_STR, global.KEY_UPGRADE_PEN, global.KEY_UPGRADE_DAM,
                global.KEY_UPGRADE_RLD, global.KEY_UPGRADE_MOB, global.KEY_UPGRADE_RGN,
                global.KEY_UPGRADE_SHI
            ].indexOf(event.keyCode);
            if (skill >= 0) this.socket.talk('x', skill, 1 * global.statMaxing);
        }
        if (global.canUpgrade) {
            switch (event.keyCode) {
                case global.KEY_CHOOSE_1:
                    this.socket.talk('U', 0, parseInt(gui.upgrades[0][0]));
                    break;
                case global.KEY_CHOOSE_2:
                    this.socket.talk('U', 1, parseInt(gui.upgrades[1][0]));
                    break;
                case global.KEY_CHOOSE_3:
                    this.socket.talk('U', 2, parseInt(gui.upgrades[2][0]));
                    break;
                case global.KEY_CHOOSE_4:
                    this.socket.talk('U', 3, parseInt(gui.upgrades[3][0]));
                    break;
                case global.KEY_CHOOSE_5:
                    this.socket.talk('U', 4, parseInt(gui.upgrades[4][0]));
                    break;
                case global.KEY_CHOOSE_6:
                    this.socket.talk('U', 5, parseInt(gui.upgrades[5][0]));
                    break;
             }
         }
     }
  }
  keyUp(event) {
    switch (event.keyCode) {
        case global.KEY_SHIFT:
            if (global.showTree) this.treeScrollSpeedMultiplier = 1;
            else this.socket.cmd.set(6, false);
            break;
        case global.KEY_UP_ARROW:
            global.scrollVelocityY = 0;
        case global.KEY_UP:
            this.socket.cmd.set(0, false);
            break;
        case global.KEY_DOWN_ARROW:
            global.scrollVelocityY = 0;
        case global.KEY_DOWN:
            this.socket.cmd.set(1, false);
            break;
        case global.KEY_LEFT_ARROW:
            global.scrollVelocityX = 0;
        case global.KEY_LEFT:
            this.socket.cmd.set(2, false);
            break;
        case global.KEY_RIGHT_ARROW:
            global.scrollVelocityX = 0;
        case global.KEY_RIGHT:
            this.socket.cmd.set(3, false);
            break;
        case global.KEY_MOUSE_0:
            this.socket.cmd.set(4, false);
            break;
        case global.KEY_MOUSE_1:
            this.socket.cmd.set(5, false);
            break;
        case global.KEY_MOUSE_2:
            this.socket.cmd.set(6, false);
            break;
        case global.KEY_MAX_STAT:
            global.statMaxing = false;
            break;
     }
  }
  mouseDown(mouse) {
    if (!this.socket) return;
    let primaryFire = 4,
        secondaryFire = 6;
    if (this.inverseMouse) [primaryFire, secondaryFire] = [secondaryFire, primaryFire];
    switch (mouse.button) {
        case 0:
            let mpos = {
                x: mouse.clientX * global.ratio,
                y: mouse.clientY * global.ratio,
            };
            let statIndex = global.clickables.stat.check(mpos);
            if (statIndex !== -1) {
                this.socket.talk('x', statIndex, 0);
            } else if (global.clickables.skipUpgrades.check(mpos) !== -1) {
                global.clearUpgrades();
            } else {
                let upgradeIndex = global.clickables.upgrade.check(mpos);
                if (upgradeIndex !== -1 && upgradeIndex < gui.upgrades.length) this.socket.talk('U', upgradeIndex, parseInt(gui.upgrades[upgradeIndex][0]));
                else this.socket.cmd.set(primaryFire, true);
            }
            break;
        case 1:
            this.socket.cmd.set(5, true);
            break;
        case 2:
            this.socket.cmd.set(secondaryFire, true);
            break;
     }
  }
  mouseUp(mouse) {
    if (!this.socket) return;
    let primaryFire = 4,
        secondaryFire = 6;
    if (this.inverseMouse) [primaryFire, secondaryFire] = [secondaryFire, primaryFire];
    switch (mouse.button) {
        case 0:
            this.socket.cmd.set(primaryFire, false);
            break;
        case 1:
            this.socket.cmd.set(5, false);
            break;
        case 2:
            this.socket.cmd.set(secondaryFire, false);
            break;
    }
  }
  mouseMove(mouse) {
    global.statHover = global.clickables.hover.check({
        x: mouse.clientX * global.ratio,
        y: mouse.clientY * global.ratio,
    }) === 0;
    if (!this.spinLock) return;
    global.mouse.x = mouse.clientX * global.ratio;
    global.mouse.y = mouse.clientY * global.ratio;
  }
  touchStart(e) {
    e.preventDefault();
    if (global.died && !global.cannotRespawn) {
      this.socket.talk("s", global.playerName, 0, 1 * settings.game.autoLevelUp);
      global.died = false;
      global.autoSpin = false;
    } else {
      for (let touch of e.changedTouches) {
        let mpos = {
          x: touch.clientX * global.ratio,
          y: touch.clientY * global.ratio,
        };
        let id = touch.identifier;
        let buttonIndex = global.clickables.mobileButtons.check(mpos);
          if (buttonIndex !== -1) {
              switch (buttonIndex) {
                case 0:
                  global.clickables.mobileButtons.active = !global.clickables.mobileButtons.active;
                  break;
                case 1:
                  if (global.clickables.mobileButtons.active) {
                        global.clickables.mobileButtons.altFire = !global.clickables.mobileButtons.altFire; 
                        if (!global.clickables.mobileButtons.altFire) this.socket.cmd.set(6, false);
                  } else if (global.isInverted) global.isInverted = false, this.socket.cmd.set(6, false);
                    else global.isInverted = true, this.socket.cmd.set(6, true);
                  break;
                case 2:
                  if (!document.fullscreenElement) {
                        var d = document.body;
                        d.requestFullscreen
                        ? d.requestFullscreen()
                        : d.msRequestFullscreen
                        ? d.msRequestFullscreen()
                        : d.mozRequestFullScreen
                        ? d.mozRequestFullScreen()
                        : d.webkitRequestFullscreen && d.webkitRequestFullscreen();
                  } else { 
                        document.exitFullscreen();
                  }
                  break;
                  case 3:
                    this.socket.talk('t', 1, true);
                    break;
                  case 4:
                    this.reverseDirection = !this.reverseDirection; 
                    global.reverseTank = -global.reverseTank; 
                    global.createMessage(this.reverseDirection ? 'Reverse tank enabled.' : 'Reverse tank disabled.');
                    break;
                  case 5:
                    global.clickables.mobileButtons.active = false; 
                    this.socket.talk('1');
                    break;
                  case 6:
                    global.autoSpin = !global.autoSpin;
                    this.socket.talk('t', 0, true);
                    break;
                  case 7:
                    this.socket.talk('t', 2, true);
                    break;
                  case 8:
                    this.socket.talk('L');
                    break;
                  case 9:
                    this.socket.talk('H');
                    break;
                  case 10:
                    this.socket.talk('0');
                    break;
                  case 11:
                    if (this.chatInput.hidden && global.gameStart && !global.cannotRespawn) { 
                          this.chatInput.hidden = false; this.chatInput.focus(); 
                    } else { 
                          this.chatInput.hidden = true; this.cv.focus(); 
                    }
                    break;
                  default:
                    throw new Error('Unknown button index.');
              }
            }
        else {
          let statIndex = global.clickables.stat.check(mpos);
          if (statIndex !== -1) this.socket.talk("x", statIndex, 0);
          else if (global.clickables.skipUpgrades.check(mpos) !== -1)
            global.clearUpgrades();
          else {
            let upgradeIndex = global.clickables.upgrade.check(mpos);
            if (upgradeIndex !== -1)
              this.socket.talk("U", upgradeIndex, parseInt(gui.upgrades[upgradeIndex][0]));
            else {
              let onLeft = mpos.x < this.cv.width / 2;
              if (this.movementTouch === null && onLeft) {
                this.movementTouch = id;
              } else if (this.controlTouch === null && !onLeft) {
                this.controlTouch = id;
                this.socket.cmd.set(4, true);
              }
            }
          }
        }
      } 
      this.touchMove(e);
    }
  }
  touchMove(e) {
    e.preventDefault();
    for (let touch of e.changedTouches) {
      let mpos = {
        x: touch.clientX * global.ratio,
        y: touch.clientY * global.ratio,
      };
      let id = touch.identifier;

      if (this.movementTouch === id) {
        let radius = Math.min(global.screenWidth * 0.6, global.screenHeight * 0.12);
        let cx = mpos.x - (this.cv.width * 1) / 6;
        let cy = mpos.y - (this.cv.height * 2) / 3;
        let r = Math.sqrt(cx ** 2 + cy ** 2);
        let angle = Math.atan2(cy, cx);
        if (r > radius) {
          cx = Math.cos(angle) * radius;
          cy = Math.sin(angle) * radius;
        }
        this.movementTouchPos = { x: cx, y: cy };
        let x = mpos.x - (this.cv.width * 1) / 6;
        let y = mpos.y - (this.cv.height * 2) / 3;
        let norm = Math.sqrt(x * x + y * y);
        x /= norm;
        y /= norm;
        let amount = 0.38268323650898;
        if (y < -amount !== this.movementTop)
          this.socket.cmd.set(0, (this.movementTop = y < -amount));
        if (y > amount !== this.movementBottom)
          this.socket.cmd.set(1, (this.movementBottom = y > amount));
        if (x < -amount !== this.movementLeft)
          this.socket.cmd.set(2, (this.movementLeft = x < -amount));
        if (x > amount !== this.movementRight)
          this.socket.cmd.set(3, (this.movementRight = x > amount));
      } else if (this.controlTouch === id) {
        let radius = Math.min(
          global.screenWidth * 0.6,
          global.screenHeight * 0.12
        );
        let cx = mpos.x - (this.cv.width * 5) / 6;
        let cy = mpos.y - (this.cv.height * 2) / 3;
        let r = Math.sqrt(cx ** 2 + cy ** 2);
        let angle = Math.atan2(cy, cx);
        if (r > radius) {
          cx = Math.cos(angle) * radius;
          cy = Math.sin(angle) * radius;
        }
        this.controlTouchPos = { x: cx, y: cy };
        if (this.spinLock) {
          /* let x = cx / radius * this.cv.width / 2;
              let y = cy / radius * this.cv.height / 2;
              if (x > this.cv.width / 2) x = this.cv.width / 2;
              else if (x < -this.cv.width / 2) x = -this.cv.width / 2;
              if (y > this.cv.height / 2) y = this.cv.height / 2;
              else if (y < -this.cv.height / 2) y = -this.cv.height / 2;
              */
          this.target.x = ((cx / radius) * global.screenWidth) / 2;
          this.target.y = ((cy / radius) * global.screenHeight) / 2;
        }
      }
    }
    global.mouse = this.target;
  }
  touchEnd(e) {
    e.preventDefault();
    for (let touch of e.changedTouches) {
      let mpos = { x: touch.clientX, y: touch.clientY };
      let id = touch.identifier;

      if (this.movementTouch === id) {
        this.movementTouch = null;
        this.movementTouchPos = { x: 0, y: 0 };
        if (this.movementTop)
          this.socket.cmd.set(0, (this.movementTop = false));
        if (this.movementBottom)
          this.socket.cmd.set(1, (this.movementBottom = false));
        if (this.movementLeft)
          this.socket.cmd.set(2, (this.movementLeft = false));
        if (this.movementRight)
          this.socket.cmd.set(3, (this.movementRight = false));
      } else if (this.controlTouch === id) {
        this.controlTouch = null;
        this.controlTouchPos = { x: 0, y: 0 };
        this.socket.cmd.set(4, false);
      }
    }
  }
}
export { Canvas };
