/* input.js — Unified Input (Keyboard + Touch Joystick)
   Engine equivalent: Input singleton / InputMap
   API: Input.getAxis() → {x,y}, Input.isAction() → bool */

const Input = (() => {
  const keys = {};
  let touchDir = { x: 0, y: 0 };
  let actionPressed = false;
  let isTouchDevice = false;
  let joystickActive = false;
  let joystickTouchId = null;
  let joystickBase = null;
  let joystickKnob = null;
  let joystickRect = null;

  function onKeyDown(e) {
    keys[e.key] = true;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
  }
  function onKeyUp(e) { keys[e.key] = false; }

  function getKeyboardDir() {
    let x = 0, y = 0;
    if (keys['ArrowUp']||keys['w']||keys['W']) y -= 1;
    if (keys['ArrowDown']||keys['s']||keys['S']) y += 1;
    if (keys['ArrowLeft']||keys['a']||keys['A']) x -= 1;
    if (keys['ArrowRight']||keys['d']||keys['D']) x += 1;
    return (x||y) ? Utils.normalize(x,y) : {x:0,y:0};
  }

  function enableTouch() {
    isTouchDevice = true;
    document.body.classList.add('touch-enabled');
  }

  function onTouchStart(e) {
    if (!isTouchDevice) enableTouch();
    for (const t of e.changedTouches) {
      if (t.clientX < window.innerWidth * 0.5 && !joystickActive) {
        joystickActive = true;
        joystickTouchId = t.identifier;
        joystickRect = joystickBase.getBoundingClientRect();
        updateJoystick(t);
        e.preventDefault();
      }
    }
  }

  function onTouchMove(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === joystickTouchId) { updateJoystick(t); e.preventDefault(); }
    }
  }

  function onTouchEnd(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === joystickTouchId) {
        joystickActive = false;
        joystickTouchId = null;
        touchDir = { x: 0, y: 0 };
        joystickKnob.style.transform = 'translate(0px, 0px)';
      }
    }
  }

  function updateJoystick(touch) {
    if (!joystickRect) return;
    const cx = joystickRect.left + joystickRect.width/2;
    const cy = joystickRect.top + joystickRect.height/2;
    const maxD = joystickRect.width/2 - 10;
    let dx = touch.clientX - cx, dy = touch.clientY - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > maxD) { dx = (dx/dist)*maxD; dy = (dy/dist)*maxD; }
    joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    const deadzone = 0.15, normDist = Math.min(dist/maxD, 1);
    if (normDist < deadzone) { touchDir = {x:0,y:0}; }
    else {
      const scale = (normDist - deadzone) / (1 - deadzone);
      touchDir = { x: (dx/dist)*scale, y: (dy/dist)*scale };
    }
  }

  function init() {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    joystickBase = document.getElementById('joystick-base');
    joystickKnob = document.getElementById('joystick-knob');
    const btnAction = document.getElementById('btn-action');
    document.addEventListener('touchstart', onTouchStart, {passive:false});
    document.addEventListener('touchmove', onTouchMove, {passive:false});
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchcancel', onTouchEnd);
    if (btnAction) {
      btnAction.addEventListener('touchstart', e => { e.preventDefault(); actionPressed=true; }, {passive:false});
      btnAction.addEventListener('touchend', e => { e.preventDefault(); actionPressed=false; });
    }
    window.addEventListener('touchstart', () => { if (!isTouchDevice) enableTouch(); }, {once:true});
  }

  return {
    init,
    getAxis() { return joystickActive ? {...touchDir} : getKeyboardDir(); },
    isAction() { return actionPressed || keys[' '] || keys['Enter']; },
  };
})();
