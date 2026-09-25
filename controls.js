'use strict';
(() => {
 const control = document.getElementById('volume');
 const player = document.getElementById('audio');
 let pointer = null;
 function reflect() {
  const value = Math.round(player.volume * 100);
  control.style.setProperty('--volume', `${value}%`);
  control.setAttribute('aria-valuenow', value);
  control.setAttribute('aria-valuetext', `${value} %${player.muted ? ' — son coupé' : ''}`);
  control.querySelector('output').textContent = `${value} %`;
  document.getElementById('mute').setAttribute('aria-pressed', String(player.muted));
 }
 function setVolume(value) {
  player.volume = Math.max(0, Math.min(100, value)) / 100;
  player.muted = false;
  reflect();
 }
 function updatePointer(event) {
  const bounds = control.getBoundingClientRect();
  setVolume((event.clientX - bounds.left) / bounds.width * 100);
 }
 control.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  event.preventDefault();
  pointer = event.pointerId;
  control.setPointerCapture(pointer);
  control.focus({preventScroll:true});
  control.classList.add('dragging');
  updatePointer(event);
 });
 control.addEventListener('pointermove', event => {
  if (event.pointerId === pointer) updatePointer(event);
 });
 function finish(event) {
  if (event.pointerId !== pointer) return;
  if (event.type === 'pointerup') updatePointer(event);
  pointer = null;
  control.classList.remove('dragging');
  if (control.hasPointerCapture(event.pointerId)) control.releasePointerCapture(event.pointerId);
 }
 ['pointerup','pointercancel','lostpointercapture'].forEach(type => control.addEventListener(type, finish));
 control.addEventListener('keydown', event => {
  const value = player.volume * 100;
  const values = {ArrowRight:value+5,ArrowUp:value+5,ArrowLeft:value-5,ArrowDown:value-5,Home:0,End:100,PageUp:value+10,PageDown:value-10};
  if (!(event.key in values)) return;
  event.preventDefault();setVolume(values[event.key]);
 });
 player.addEventListener('volumechange', reflect);
 reflect();
})();
