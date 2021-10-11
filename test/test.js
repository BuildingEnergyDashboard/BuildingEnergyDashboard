
describe('test', () => {
    
 it('getEnergyStarRangesize(1-25) = "6"', () => {
    for (let index = 1; index < 26; index++) {
     chai.expect(getEnergyStarRangesize(index)).to.eql("6");
     }
 });    
  
it("Test Json Catitgory returns = 38  and contains Commercial", async function() {
    var testPromise = new Promise(function(resolve, reject) {
        setTimeout(function() {
           var result = getJson("https://data.cityoforlando.net/resource/f63n-kp6t.json?$select=primary_us,count(primary_us)%20AS%20cnt&$group=primary_us&$order=cnt%20DESC");
            resolve(result);
        }, 200);
    });
    var result = await testPromise;
    chai.expect(result.length).to.equal(38);
    chai.expect(result).to.satisfy((n) =>{
      console.log(n); 
      return n[0].primary_us.includes("Commercial")
    });
});
it("Test Json ", async function() {
  var testPromise = new Promise(function(resolve, reject) {
      setTimeout(function() {
         var result =  getJson("https://data.cityoforlando.net/resource/f63n-kp6t.geojson");
          resolve(result);
      }, 230);
  });
  var result = await testPromise;
  chai.expect(result.features.length).to.equal(909);
  chai.expect(result).to.satisfy((n) =>{
    console.log(n.features[0]); 
    console.log(n.features[0].properties.property_a); 
    return (n.features[0].properties.property_a == "1905 LEE RD")
  });
});

//chai.expect(result[0]).to.have.members(['Commercial']);
/* it("Using an async method with async/await!", async function(done) {
  try {
    var result = await getJson("https://data.cityoforlando.net/resource/f63n-kp6t.geojson");
       chai.expect(result).to.exist;
      done();
  } catch(err) {
      done(err);
  }
}); */
/*    it('Test 2 ', async() => {
    let data = await 
    chai.expect(data).to.contain('cat');
  }); */
});
