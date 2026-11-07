const assert=require('assert'), fs=require('fs'), os=require('os'), path=require('path'), Module=require('module');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'shopee-review-test-'));
process.env.DATA_DIR=dir;
const routes=[];
const app={set(){},use(){},listen(port,cb){if(cb)cb()},get(p,...f){routes.push(['GET',p,f])},post(p,...f){routes.push(['POST',p,f])}};
function express(){return app}express.urlencoded=()=>()=>{};express.static=()=>()=>{};
const old=Module._load;Module._load=function(name,parent,main){if(name==='express')return express;if(name==='express-session')return () =>()=>{};if(name==='slugify')return v=>String(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');return old.apply(this,arguments)};
require(path.join(__dirname,'../server.js'));Module._load=old;
function route(method,p){const r=routes.find(x=>x[0]===method&&x[1]===p);assert(r,method+' '+p+' missing');return r[2]}
function makeRes(){return {statusCode:200,headers:{},body:null,status(n){this.statusCode=n;return this},send(x){this.body=x;return this},redirect(n,x){this.statusCode=x? n:302;this.location=x||n;return this},render(t,d){this.template=t;this.data=d;return this},set(k,v){this.headers[k]=v;return this}}}
function invoke(method,p,req){let r=makeRes(); const funcs=route(method,p);let i=0;function next(){i++;return funcs[i]?.(req,r,next)};funcs[0](req,r,next);return r}
const req=(params={},body={},query={})=>({params,body,query,path:'/',session:{isAdmin:true}});
let r=invoke('GET','/rekomendasi',req());assert.equal(r.template,'recommendations');assert.equal(r.data.items.length,0);
r=invoke('POST','/itsiregar24/:type/save',req({type:'recommendations'},{name:'Speaker Bluetooth',imageUrl:'https://images.example.com/speaker.jpg',shopeeUrl:'https://s.shopee.co.id/abc123',price:'Rp325.500',isPublished:'on'}));assert.equal(r.statusCode,302);
let items=JSON.parse(fs.readFileSync(path.join(dir,'recommendations.json')));assert.equal(items.length,1);assert.equal(items[0].slug,'speaker-bluetooth');
r=invoke('GET','/rekomendasi',req());assert.equal(r.data.items.length,1);
r=invoke('GET','/rekomendasi/:slug',req({slug:items[0].slug}));assert.equal(r.template,'recommendation-detail');
r=invoke('GET','/go/rekomendasi/:id',req({id:items[0].id}));assert.equal(r.statusCode,302);assert.equal(r.location,'https://s.shopee.co.id/abc123');
assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'recommendation-clicks.json')))[items[0].id],1);
r=invoke('POST','/itsiregar24/:type/save',req({type:'recommendations'},{name:'Bad Link',shopeeUrl:'https://evil.example.com'}));assert.equal(r.statusCode,400);
r=invoke('POST','/itsiregar24/:type/save',req({type:'recommendations'},{name:'Another Product',slug:'speaker-bluetooth',shopeeUrl:'https://shopee.co.id/a',isPublished:'on'}));assert.equal(r.statusCode,409);
r=invoke('POST','/itsiregar24/:type/save',req({type:'recommendations'},{id:items[0].id,name:'Speaker New',slug:'speaker-new',shopeeUrl:'https://shopee.co.id/official',isPublished:'on'}));assert.equal(r.statusCode,302);
items=JSON.parse(fs.readFileSync(path.join(dir,'recommendations.json')));assert.equal(items.length,1);assert.equal(items[0].slug,'speaker-new');
r=invoke('POST','/itsiregar24/:type/delete/:id',req({type:'recommendations',id:items[0].id}));assert.equal(r.statusCode,302);assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'recommendations.json'))).length,0);
const originalProducts=JSON.parse(fs.readFileSync(path.join(dir,'products.json')));assert(originalProducts.length>=1);
console.log('PASS: 12 assertions groups - new catalog, CRUD, redirect, click tracking, validation, duplicate prevention, isolated products');
fs.rmSync(dir,{recursive:true,force:true});
