const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.RADIO_TEST_BROWSER,headless:true});
 for(const width of [1440,900,701,700,520,390,320]){
  const context=await browser.newContext({viewport:{width,height:1000},hasTouch:width<=700});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*.api.radio-browser.info/**',r=>r.fulfill({json:[{stationuuid:'test',name:'Test radio',country:'France',url:'https://example.com/test.wav'}]}));
  const wav=Buffer.alloc(44+8000*30*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(wav.length-44,40);
  for(const url of ['https://27913.live.streamtheworld.com/**','https://example.com/**'])await page.route(url,r=>r.fulfill({contentType:'audio/wav',body:wav}));
  await page.goto(process.env.RADIO_TEST_URL || 'http://127.0.0.1:4173');
  await page.locator('#search').fill('rfm');await page.locator('#searchBtn').click();
  await page.waitForFunction(()=>document.querySelectorAll('#results button').length===2);
  await page.locator('#results button').first().click();
  await page.locator('#fav').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('retro-radio-favorites')).length),1);
  await page.locator('#fav').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('retro-radio-favorites')).length),0);
  await page.locator('#next').click();assert.equal(await page.locator('#station').textContent(),'Test radio');
  await page.locator('#prev').click();assert.equal(await page.locator('#station').textContent(),'RFM 80s');
  await page.locator('#stop').click();assert.equal(await page.locator('#audio').getAttribute('src'),null);
  await page.locator('#play').click();assert.match(await page.locator('#audio').getAttribute('src'),/GR80SRFM/);
  await page.waitForFunction(()=>!document.querySelector('#audio').paused);
  const source=await page.locator('#audio').getAttribute('src');
  await page.locator('#pause').click();assert.equal(await page.evaluate(()=>document.querySelector('#audio').paused),true);
  await page.locator('#pause').click();await page.waitForFunction(()=>!document.querySelector('#audio').paused);assert.equal(await page.locator('#audio').getAttribute('src'),source);
  const box=await page.locator('#volume').boundingBox();const y=box.y+box.height/2;
  await page.mouse.move(box.x+box.width*.2,y);await page.mouse.down();await page.mouse.move(box.x+box.width*.8,y);await page.mouse.up();
  assert.ok(Math.abs(await page.evaluate(()=>document.querySelector('#audio').volume)-.8)<.02);
  await page.locator('#volume').press('Home');assert.equal(await page.evaluate(()=>document.querySelector('#audio').volume),0);
  await page.locator('#volume').press('End');assert.equal(await page.evaluate(()=>document.querySelector('#audio').volume),1);
  if(width<=700){const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width*.1,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width*.6,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok(Math.abs(await page.evaluate(()=>document.querySelector('#audio').volume)-.6)<.02);}
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);
  if([1440,390,320].includes(width))await page.screenshot({path:`radio-check-${width}.png`,fullPage:true});
  console.log(`PASS ${width}px: search, RFM, favorites, next/previous, stop/play, volume drag/keyboard${width<=700?'/touch':''}, no overflow or JS errors`);
  await context.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
